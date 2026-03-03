const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase.config');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const TokenUtils = require('../utils/tokenUtils');
const tokenBlacklistService = require('./tokenBlacklistService');

class AuthService {
    constructor(database = supabase, blacklistService = tokenBlacklistService) {
        this.db = database;
        this.blacklist = blacklistService;
    }

    /**
     * Dang nhap voi username/email va password
     * @param {string} identifier - Username hoac email
     * @param {string} password - Password nguyen ban
     * @param {Object} metadata - { ip, userAgent }
     * @returns {Promise<Object>} User object, access token, refresh token
     */
    login = async (identifier, password, metadata = {}) => {
        try {
            // Tim user theo username hoac email
            const { data: users, error } = await this.db
                .from('users')
                .select('*')
                .or(`username.eq.${identifier},email.eq.${identifier}`)
                .eq('is_active', true)
                .limit(1);

            if (error) {
                logger.error('Database error khi tim user', { error: error.message });
                throw new ApiError(500, 'Loi he thong khi xac thuc');
            }

            if (!users || users.length === 0) {
                logger.warn('Login failed: User khong ton tai', { identifier });
                // Dung message chung de khong reveal thong tin
                throw new ApiError(401, 'Thong tin dang nhap khong chinh xac');
            }

            const user = users[0];

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            
            if (!isPasswordValid) {
                logger.warn('Login failed: Sai mat khau', { 
                    userId: user.id,
                    username: user.username 
                });
                throw new ApiError(401, 'Thong tin dang nhap khong chinh xac');
            }

            // Tao tokens
            const accessToken = this.generateAccessToken(user);
            const refreshToken = TokenUtils.generateRefreshToken();

            // Luu refresh token vao database
            await this.saveRefreshToken(user.id, refreshToken, metadata);

            // Cap nhat last_login
            await this.updateLastLogin(user.id);

            // Loai bo sensitive data
            const userResponse = this.sanitizeUser(user);

            logger.info('User dang nhap thanh cong', {
                userId: user.id,
                username: user.username,
                role: user.role,
                ip: metadata.ip
            });

            return {
                user: userResponse,
                accessToken,
                refreshToken,
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            logger.error('Loi khong mong muon trong login service', { 
                error: error.message,
                stack: error.stack 
            });
            throw new ApiError(500, 'Loi he thong khi dang nhap');
        }
    }

    /**
     * Refresh access token bang refresh token
     * @param {string} refreshToken - Refresh token
     * @param {Object} metadata - { ip, userAgent }
     * @returns {Promise<Object>} Access token moi va refresh token moi
     */
    refreshAccessToken = async (refreshToken, metadata = {}) => {
        try {
            if (!refreshToken) {
                throw new ApiError(401, 'Refresh token la bat buoc');
            }

            // Hash refresh token de tim trong database
            const tokenHash = TokenUtils.hashToken(refreshToken);

            // Tim refresh token trong database
            const { data: tokenRecord, error } = await this.db
                .from('refresh_tokens')
                .select('*, users(*)')
                .eq('token_hash', tokenHash)
                .is('revoked_at', null)
                .single();

            if (error || !tokenRecord) {
                logger.warn('Refresh token khong hop le hoac da bi revoke', { 
                    tokenHash: tokenHash.substring(0, 10) 
                });
                throw new ApiError(401, 'Refresh token khong hop le');
            }

            // Kiem tra token het han chua
            const now = new Date();
            const expiresAt = new Date(tokenRecord.expires_at);
            
            if (expiresAt < now) {
                logger.warn('Refresh token da het han', { 
                    userId: tokenRecord.user_id,
                    expiredAt: expiresAt 
                });
                throw new ApiError(401, 'Refresh token da het han');
            }

            const user = tokenRecord.users;

            // Kiem tra user con active khong
            if (!user.is_active) {
                throw new ApiError(403, 'Tai khoan da bi vo hieu hoa');
            }

            // Tao tokens moi
            const newAccessToken = this.generateAccessToken(user);
            const newRefreshToken = TokenUtils.generateRefreshToken();

            // Revoke refresh token cu va luu token moi
            await this.revokeRefreshToken(tokenRecord.id);
            await this.saveRefreshToken(user.id, newRefreshToken, metadata);

            logger.info('Token refresh thanh cong', {
                userId: user.id,
                username: user.username
            });

            return {
                user: this.sanitizeUser(user),
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            logger.error('Loi trong refresh token service', { 
                error: error.message 
            });
            throw new ApiError(500, 'Loi he thong khi refresh token');
        }
    }

    /**
     * Logout - Revoke refresh token va blacklist access token
     * @param {string} userId - User ID
     * @param {string} accessToken - Access token can blacklist
     * @param {string} refreshToken - Refresh token can revoke
     */
    logout = async (userId, accessToken, refreshToken) => {
        try {
            // Blacklist access token
            if (accessToken) {
                const tokenHash = TokenUtils.hashToken(accessToken);
                const remainingTime = TokenUtils.getTokenRemainingTime(accessToken);
                
                if (remainingTime > 0) {
                    const expiryTimestamp = Math.floor(Date.now() / 1000) + remainingTime;
                    this.blacklist.add(tokenHash, expiryTimestamp);
                }
            }

            if (refreshToken) {
                const tokenHash = TokenUtils.hashToken(refreshToken);
                await this.db
                    .from('refresh_tokens')
                    .update({ revoked_at: new Date().toISOString() })
                    .eq('token_hash', tokenHash)
                    .is('revoked_at', null);
            }

            logger.info('User logout thanh cong', { userId });
        } catch (error) {
            logger.error('Loi khi logout', { 
                error: error.message,
                userId 
            });
            // Khong throw error, van cho logout thanh cong
        }
    }

    /**
     * Verify access token va kiem tra blacklist
     * @param {string} token - Access token
     * @returns {Promise<Object>} User object
     */
    verifyAccessToken = async (token) => {
        try {
            // Verify JWT signature va expiry
            const decoded = TokenUtils.verifyAccessToken(token);

            // Kiem tra token co bi blacklist khong
            const tokenHash = TokenUtils.hashToken(token);
            if (this.blacklist.isBlacklisted(tokenHash)) {
                throw new ApiError(401, 'Token da bi vo hieu hoa');
            }

            // Lay thong tin user tu database
            const { data: user, error } = await this.db
                .from('users')
                .select('id, username, email, full_name, role, is_active')
                .eq('id', decoded.userId)
                .single();

            if (error || !user) {
                throw new ApiError(401, 'Nguoi dung khong ton tai');
            }

            if (!user.is_active) {
                throw new ApiError(403, 'Tai khoan da bi vo hieu hoa');
            }

            return this.sanitizeUser(user);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(401, 'Token khong hop le');
        }
    }

    /**
     * Generate Access Token (JWT)
     * @param {Object} user - User object
     * @returns {string} JWT token
     */
    generateAccessToken = (user) => {
        const payload = {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        return TokenUtils.generateAccessToken(payload);
    }

    /**
     * Luu refresh token vao database
     * @param {string} userId - User ID
     * @param {string} refreshToken - Refresh token
     * @param {Object} metadata - { ip, userAgent }
     */
    saveRefreshToken = async (userId, refreshToken, metadata = {}) => {
        const tokenHash = TokenUtils.hashToken(refreshToken);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await this.db.from('refresh_tokens').insert({
            user_id: userId,
            token_hash: tokenHash,
            expires_at: expiresAt.toISOString(),
            created_by_ip: metadata.ip || null,
            user_agent: metadata.userAgent || null,
        });
    }

    /**
     * Revoke refresh token
     * @param {string} tokenId - Token ID trong database
     */
    revokeRefreshToken = async (tokenId) => {
        await this.db
            .from('refresh_tokens')
            .update({ revoked_at: new Date().toISOString() })
            .eq('id', tokenId);
    }

    /**
     * Revoke tat ca refresh tokens cua user (logout all devices)
     * @param {string} userId - User ID
     */
    revokeAllRefreshTokens = async (userId) => {
        await this.db
            .from('refresh_tokens')
            .update({ revoked_at: new Date().toISOString() })
            .eq('user_id', userId)
            .is('revoked_at', null);
    }

    /**
     * Cap nhat thoi gian dang nhap cuoi cung
     * @param {string} userId - User ID
     */
    updateLastLogin = async (userId) => {
        try {
            await this.db
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', userId);
        } catch (error) {
            logger.warn('Khong the cap nhat last_login', { 
                userId, 
                error: error.message 
            });
        }
    }

    /**
     * Loai bo sensitive fields tu user object
     * @param {Object} user - User object
     * @returns {Object} Sanitized user object
     */
    sanitizeUser = (user) => {
        const { password_hash, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}

// Export singleton instance voi DI
module.exports = new AuthService();
