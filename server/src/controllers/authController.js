const config = require('../config');
const logger = require('../utils/logger');
const TokenUtils = require('../utils/tokenUtils');
const catchAsync = require('../utils/catchAsync');
const { TOKEN_TYPES } = require('../utils/constants');

const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie(config.jwt.accessToken.cookieName, accessToken, TokenUtils.getCookieOptions(TOKEN_TYPES.ACCESS));
    res.cookie(config.jwt.refreshToken.cookieName, refreshToken, TokenUtils.getCookieOptions(TOKEN_TYPES.REFRESH));
};

const clearTokenCookies = (res) => {
    res.clearCookie(config.jwt.accessToken.cookieName, TokenUtils.getCookieOptions(TOKEN_TYPES.ACCESS));
    res.clearCookie(config.jwt.refreshToken.cookieName, TokenUtils.getCookieOptions(TOKEN_TYPES.REFRESH));
};

const getMetadata = (req) => ({
    ip: TokenUtils.getClientIp(req),
    userAgent: TokenUtils.getUserAgent(req),
});

class AuthController {
    constructor(authService) {
        this.authService = authService;

        // Bind tat ca route handlers voi catchAsync
        this.login = catchAsync(this.login.bind(this));
        this.logout = catchAsync(this.logout.bind(this));
        this.verifyToken = catchAsync(this.verifyToken.bind(this));
        this.refreshToken = catchAsync(this.refreshToken.bind(this));
        this.logoutAll = catchAsync(this.logoutAll.bind(this));
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    async login(req, res) {
        const { identifier, password } = req.body;
        const result = await this.authService.login(identifier, password, getMetadata(req));

        setTokenCookies(res, result.accessToken, result.refreshToken);

        res.json({
            success: true,
            message: 'Dang nhap thanh cong',
            data: { user: result.user },
        });
    }

    async logout(req, res) {
        const accessToken = TokenUtils.extractToken(req, TOKEN_TYPES.ACCESS);
        const refreshToken = TokenUtils.extractToken(req, TOKEN_TYPES.REFRESH);

        await this.authService.logout(req.user?.id, accessToken, refreshToken);
        clearTokenCookies(res);

        res.json({ success: true, message: 'Dang xuat thanh cong' });
    }

    getCurrentUser(req, res) {
        res.json({ success: true, data: { user: req.user } });
    }

    async verifyToken(req, res) {
        const token = TokenUtils.extractToken(req, TOKEN_TYPES.ACCESS);
        if (!token) {
            return res.status(401).json({ success: false, message: 'Khong tim thay token' });
        }

        const user = await this.authService.verifyAccessToken(token);
        res.json({ success: true, message: 'Token hop le', data: { user } });
    }

    async refreshToken(req, res) {
        const refreshToken = TokenUtils.extractToken(req, TOKEN_TYPES.REFRESH);
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Khong tim thay refresh token' });
        }

        const result = await this.authService.refreshAccessToken(refreshToken, getMetadata(req));
        setTokenCookies(res, result.accessToken, result.refreshToken);

        res.json({
            success: true,
            message: 'Token da duoc refresh',
            data: { user: result.user },
        });
    }

    async logoutAll(req, res) {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Chua dang nhap' });
        }

        await this.authService.revokeAllRefreshTokens(userId);
        this.authService.blacklistAccessToken(TokenUtils.extractToken(req, TOKEN_TYPES.ACCESS));
        clearTokenCookies(res);

        logger.info('Logout tat ca devices', { userId });
        res.json({ success: true, message: 'Da dang xuat khoi tat ca thiet bi' });
    }

    healthCheck(_req, res) {
        res.json({
            success: true,
            message: 'Auth service hoat dong binh thuong',
            timestamp: new Date().toISOString(),
            blacklistSize: this.authService.blacklist.size(),
        });
    }
}

const authService = require('../services/authService');
module.exports = new AuthController(authService);
