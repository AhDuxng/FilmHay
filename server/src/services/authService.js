const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase.config');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const TokenUtils = require('../utils/tokenUtils');
const tokenBlacklistService = require('./tokenBlacklistService');

class AuthService {
    constructor(database = supabase, blacklist = tokenBlacklistService) {
        this.db = database;
        this.blacklist = blacklist;
    }

    login = async (identifier, password, metadata = {}) => {
        const { data: users, error } = await this.db
            .from('users')
            .select('*')
            .or(`username.eq.${identifier},email.eq.${identifier}`)
            .eq('is_active', true)
            .limit(1);

        if (error) {
            logger.error('Database error khi tim user', { error: error.message });
            throw ApiError.internal('Loi he thong khi xac thuc');
        }

        if (!users?.length) {
            logger.warn('Login failed: user khong ton tai', { identifier });
            throw ApiError.unauthorized('Thong tin dang nhap khong chinh xac');
        }

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            logger.warn('Login failed: sai mat khau', { userId: user.id });
            throw ApiError.unauthorized('Thong tin dang nhap khong chinh xac');
        }

        const accessToken = this._createAccessToken(user);
        const refreshToken = TokenUtils.generateRefreshToken();

        await Promise.all([
            this._saveRefreshToken(user.id, refreshToken, metadata),
            this._updateLastLogin(user.id),
        ]);

        logger.info('Login thanh cong', { userId: user.id, role: user.role, ip: metadata.ip });

        return {
            user: this._sanitize(user),
            accessToken,
            refreshToken,
        };
    }

    refreshAccessToken = async (refreshToken, metadata = {}) => {
        if (!refreshToken) throw ApiError.unauthorized('Refresh token la bat buoc');

        const tokenHash = TokenUtils.hashToken(refreshToken);

        const { data: record, error } = await this.db
            .from('refresh_tokens')
            .select('*, users(*)')
            .eq('token_hash', tokenHash)
            .is('revoked_at', null)
            .single();

        if (error || !record) {
            logger.warn('Refresh token khong hop le', { hash: tokenHash.substring(0, 10) });
            throw ApiError.unauthorized('Refresh token khong hop le');
        }

        if (new Date(record.expires_at) < new Date()) {
            logger.warn('Refresh token het han', { userId: record.user_id });
            throw ApiError.unauthorized('Refresh token da het han');
        }

        const user = record.users;
        if (!user.is_active) throw ApiError.forbidden('Tai khoan da bi vo hieu hoa');

        const newAccessToken = this._createAccessToken(user);
        const newRefreshToken = TokenUtils.generateRefreshToken();

        // Revoke token cu, luu token moi dong thoi
        await Promise.all([
            this._revokeRefreshToken(record.id),
            this._saveRefreshToken(user.id, newRefreshToken, metadata),
        ]);

        logger.info('Token refresh thanh cong', { userId: user.id });

        return {
            user: this._sanitize(user),
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    logout = async (userId, accessToken, refreshToken) => {
        try {
            this._blacklistAccessToken(accessToken);

            if (refreshToken) {
                const tokenHash = TokenUtils.hashToken(refreshToken);
                await this.db
                    .from('refresh_tokens')
                    .update({ revoked_at: new Date().toISOString() })
                    .eq('token_hash', tokenHash)
                    .is('revoked_at', null);
            }

            logger.info('Logout thanh cong', { userId });
        } catch (err) {
            logger.error('Loi khi logout', { error: err.message, userId });
        }
    }

    verifyAccessToken = async (token) => {
        const decoded = TokenUtils.verifyAccessToken(token);

        const tokenHash = TokenUtils.hashToken(token);
        if (this.blacklist.isBlacklisted(tokenHash)) {
            throw ApiError.unauthorized('Token da bi vo hieu hoa');
        }

        const { data: user, error } = await this.db
            .from('users')
            .select('id, username, email, full_name, role, is_active')
            .eq('id', decoded.userId)
            .single();

        if (error || !user) throw ApiError.unauthorized('Nguoi dung khong ton tai');
        if (!user.is_active) throw ApiError.forbidden('Tai khoan da bi vo hieu hoa');

        return this._sanitize(user);
    }

    revokeAllRefreshTokens = async (userId) => {
        await this.db
            .from('refresh_tokens')
            .update({ revoked_at: new Date().toISOString() })
            .eq('user_id', userId)
            .is('revoked_at', null);
    }

    // Blacklist access token hien tai
    _blacklistAccessToken = (accessToken) => {
        if (!accessToken) return;
        const tokenHash = TokenUtils.hashToken(accessToken);
        const remaining = TokenUtils.getTokenRemainingTime(accessToken);
        if (remaining > 0) {
            this.blacklist.add(tokenHash, Math.floor(Date.now() / 1000) + remaining);
        }
    }

    _createAccessToken = (user) => {
        return TokenUtils.generateAccessToken({
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    }

    _saveRefreshToken = async (userId, refreshToken, metadata = {}) => {
        const tokenHash = TokenUtils.hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + config.jwt.refreshToken.maxAge);

        await this.db.from('refresh_tokens').insert({
            user_id: userId,
            token_hash: tokenHash,
            expires_at: expiresAt.toISOString(),
            created_by_ip: metadata.ip || null,
            user_agent: metadata.userAgent || null,
        });
    }

    _revokeRefreshToken = async (tokenId) => {
        await this.db
            .from('refresh_tokens')
            .update({ revoked_at: new Date().toISOString() })
            .eq('id', tokenId);
    }

    _updateLastLogin = async (userId) => {
        try {
            await this.db
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', userId);
        } catch (err) {
            logger.warn('Khong the cap nhat last_login', { userId, error: err.message });
        }
    }

    _sanitize = (user) => {
        const { password_hash, ...clean } = user;
        return clean;
    }
}

module.exports = new AuthService();
