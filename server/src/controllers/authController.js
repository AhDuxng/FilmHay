const config = require('../config');
const logger = require('../utils/logger');
const TokenUtils = require('../utils/tokenUtils');
const authService = require('../services/authService');

// Helper: set token cookies vao response
const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie(config.jwt.accessToken.cookieName, accessToken, TokenUtils.getCookieOptions('access'));
    res.cookie(config.jwt.refreshToken.cookieName, refreshToken, TokenUtils.getCookieOptions('refresh'));
};

// Helper: xoa token cookies
const clearTokenCookies = (res) => {
    res.clearCookie(config.jwt.accessToken.cookieName, TokenUtils.getCookieOptions('access'));
    res.clearCookie(config.jwt.refreshToken.cookieName, TokenUtils.getCookieOptions('refresh'));
};

// Helper: lay metadata tu request
const getMetadata = (req) => ({
    ip: TokenUtils.getClientIp(req),
    userAgent: TokenUtils.getUserAgent(req),
});

class AuthController {
    login = async (req, res, next) => {
        try {
            const { identifier, password } = req.body;
            const result = await authService.login(identifier, password, getMetadata(req));

            setTokenCookies(res, result.accessToken, result.refreshToken);

            res.json({
                success: true,
                message: 'Dang nhap thanh cong',
                data: { user: result.user },
            });
        } catch (err) {
            next(err);
        }
    }

    logout = async (req, res, next) => {
        try {
            const accessToken = TokenUtils.extractToken(req, 'access');
            const refreshToken = TokenUtils.extractToken(req, 'refresh');

            await authService.logout(req.user?.id, accessToken, refreshToken);
            clearTokenCookies(res);

            res.json({ success: true, message: 'Dang xuat thanh cong' });
        } catch (err) {
            next(err);
        }
    }

    getCurrentUser = (_req, res) => {
        res.json({ success: true, data: { user: _req.user } });
    }

    verifyToken = async (req, res, next) => {
        try {
            const token = TokenUtils.extractToken(req, 'access');
            if (!token) {
                return res.status(401).json({ success: false, message: 'Khong tim thay token' });
            }

            const user = await authService.verifyAccessToken(token);
            res.json({ success: true, message: 'Token hop le', data: { user } });
        } catch (err) {
            next(err);
        }
    }

    refreshToken = async (req, res, next) => {
        try {
            const refreshToken = TokenUtils.extractToken(req, 'refresh');
            if (!refreshToken) {
                return res.status(401).json({ success: false, message: 'Khong tim thay refresh token' });
            }

            const result = await authService.refreshAccessToken(refreshToken, getMetadata(req));
            setTokenCookies(res, result.accessToken, result.refreshToken);

            res.json({
                success: true,
                message: 'Token da duoc refresh',
                data: { user: result.user },
            });
        } catch (err) {
            next(err);
        }
    }

    logoutAll = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'Chua dang nhap' });
            }

            await authService.revokeAllRefreshTokens(userId);
            authService._blacklistAccessToken(TokenUtils.extractToken(req, 'access'));
            clearTokenCookies(res);

            logger.info('Logout tat ca devices', { userId });
            res.json({ success: true, message: 'Da dang xuat khoi tat ca thiet bi' });
        } catch (err) {
            next(err);
        }
    }

    healthCheck = (_req, res) => {
        res.json({
            success: true,
            message: 'Auth service hoat dong binh thuong',
            timestamp: new Date().toISOString(),
            blacklistSize: authService.blacklist.size(),
        });
    }
}

module.exports = new AuthController();
