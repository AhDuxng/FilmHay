const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const ApiError = require('./ApiError');
const { TOKEN_TYPES, JWT_CONFIG, BEARER_PREFIX } = require('./constants');

const JWT_ERRORS = {
    TokenExpiredError: 'Access token da het han',
    JsonWebTokenError: 'Access token khong hop le',
};

class TokenUtils {
    static extractToken(req, tokenType = TOKEN_TYPES.ACCESS) {
        const cookieName = tokenType === TOKEN_TYPES.ACCESS
            ? config.jwt.accessToken.cookieName
            : config.jwt.refreshToken.cookieName;

        const token = req.cookies?.[cookieName];
        if (token) return token;

        const auth = req.headers.authorization;
        return auth?.startsWith(BEARER_PREFIX) ? auth.slice(BEARER_PREFIX.length) : null;
    }

    static generateAccessToken(payload) {
        return jwt.sign(payload, config.jwt.accessToken.secret, {
            expiresIn: config.jwt.accessToken.expiresIn,
            issuer: JWT_CONFIG.ISSUER,
            audience: JWT_CONFIG.AUDIENCE,
        });
    }

    static generateRefreshToken() {
        return crypto.randomBytes(64).toString('hex');
    }

    static hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, config.jwt.accessToken.secret);
        } catch (err) {
            throw ApiError.unauthorized(JWT_ERRORS[err.name] || 'Xac thuc that bai');
        }
    }

    static getTokenRemainingTime(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded?.exp) return 0;
            return Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
        } catch {
            return 0;
        }
    }

    static getCookieOptions(tokenType = TOKEN_TYPES.ACCESS) {
        const tokenConfig = tokenType === TOKEN_TYPES.REFRESH
            ? config.jwt.refreshToken
            : config.jwt.accessToken;

        return {
            httpOnly: true,
            secure: config.isProduction,
            sameSite: 'strict',
            path: '/',
            maxAge: tokenConfig.maxAge,
        };
    }

    static getClientIp(req) {
        return req.headers['x-forwarded-for']?.split(',')[0]
            || req.headers['x-real-ip']
            || req.socket?.remoteAddress
            || 'unknown';
    }

    static getUserAgent(req) {
        return req.headers['user-agent'] || 'unknown';
    }
}

module.exports = TokenUtils;
