const config = require('../config');
const logger = require('../utils/logger');
const TokenUtils = require('../utils/tokenUtils');

class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/login
     * Dang nhap voi username/email va password
     */
    login = async (req, res, next) => {
        try {
            const { identifier, password } = req.body;

            // Metadata cho audit log
            const metadata = {
                ip: TokenUtils.getClientIp(req),
                userAgent: TokenUtils.getUserAgent(req),
            };

            // Goi service de xu ly logic
            const result = await this.authService.login(identifier, password, metadata);

            // Set HTTP-only cookies cho ca 2 tokens
            res.cookie(
                config.jwt.accessToken.cookieName,
                result.accessToken,
                TokenUtils.getCookieOptions('access')
            );

            res.cookie(
                config.jwt.refreshToken.cookieName,
                result.refreshToken,
                TokenUtils.getCookieOptions('refresh')
            );

            // Tra ve response
            return res.status(200).json({
                success: true,
                message: 'Dang nhap thanh cong',
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/logout
     * Dang xuat - revoke tokens va xoa cookies
     */
    logout = async (req, res, next) => {
        try {
            const userId = req.user?.id;
            
            // Lay tokens de revoke
            const accessToken = TokenUtils.extractToken(req, 'access');
            const refreshToken = TokenUtils.extractToken(req, 'refresh');

            // Revoke tokens
            await this.authService.logout(userId, accessToken, refreshToken);

            // Clear cookies - su dung same options de dam bao xoa duoc
            res.clearCookie(
                config.jwt.accessToken.cookieName,
                TokenUtils.getCookieOptions('access')
            );

            res.clearCookie(
                config.jwt.refreshToken.cookieName,
                TokenUtils.getCookieOptions('refresh')
            );

            logger.info('User dang xuat', { userId });

            return res.status(200).json({
                success: true,
                message: 'Dang xuat thanh cong',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/auth/me
     * Lay thong tin user hien tai (da authenticate)
     */
    getCurrentUser = async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Chua dang nhap',
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    user: req.user,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/verify
     * Verify access token
     */
    verifyToken = async (req, res, next) => {
        try {
            const token = TokenUtils.extractToken(req, 'access');

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Khong tim thay token',
                });
            }

            const user = await this.authService.verifyAccessToken(token);

            return res.status(200).json({
                success: true,
                message: 'Token hop le',
                data: {
                    user,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/refresh
     * Refresh access token bang refresh token
     */
    refreshToken = async (req, res, next) => {
        try {
            const refreshToken = TokenUtils.extractToken(req, 'refresh');

            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Khong tim thay refresh token',
                });
            }

            // Metadata cho audit log
            const metadata = {
                ip: TokenUtils.getClientIp(req),
                userAgent: TokenUtils.getUserAgent(req),
            };

            const result = await this.authService.refreshAccessToken(refreshToken, metadata);

            // Set cookies moi
            res.cookie(
                config.jwt.accessToken.cookieName,
                result.accessToken,
                TokenUtils.getCookieOptions('access')
            );

            res.cookie(
                config.jwt.refreshToken.cookieName,
                result.refreshToken,
                TokenUtils.getCookieOptions('refresh')
            );

            return res.status(200).json({
                success: true,
                message: 'Token da duoc refresh',
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/logout-all
     * Logout tat ca devices
     */
    logoutAll = async (req, res, next) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Chua dang nhap',
                });
            }

            // Revoke tat ca refresh tokens
            await this.authService.revokeAllRefreshTokens(userId);

            // Blacklist access token hien tai
            const accessToken = TokenUtils.extractToken(req, 'access');
            if (accessToken) {
                const tokenHash = TokenUtils.hashToken(accessToken);
                const remainingTime = TokenUtils.getTokenRemainingTime(accessToken);
                if (remainingTime > 0) {
                    const expiryTimestamp = Math.floor(Date.now() / 1000) + remainingTime;
                    this.authService.blacklist.add(tokenHash, expiryTimestamp);
                }
            }

            // Clear cookies
            res.clearCookie(
                config.jwt.accessToken.cookieName,
                TokenUtils.getCookieOptions('access')
            );

            res.clearCookie(
                config.jwt.refreshToken.cookieName,
                TokenUtils.getCookieOptions('refresh')
            );

            logger.info('User logout all devices', { userId });

            return res.status(200).json({
                success: true,
                message: 'Da dang xuat khoi tat ca thiet bi',
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Health check endpoint
     */
    healthCheck = async (req, res) => {
        return res.status(200).json({
            success: true,
            message: 'Auth service hoat dong binh thuong',
            timestamp: new Date().toISOString(),
            blacklistSize: this.authService.blacklist.size(),
        });
    }
}

// Export singleton voi DI
const authService = require('../services/authService');
module.exports = new AuthController(authService);
