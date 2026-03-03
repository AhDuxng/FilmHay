const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const ApiError = require('./ApiError');

class TokenUtils {
    /**
     * Trich xuat token tu request (Cookie > Header > Body)
     * @param {Object} req - Express request object
     * @param {String} tokenType - 'access' hoac 'refresh'
     * @returns {String|null} Token string
     */
    static extractToken(req, tokenType = 'access') {
        const cookieName = tokenType === 'access' 
            ? config.jwt.accessToken.cookieName 
            : config.jwt.refreshToken.cookieName;

        // Priority: Cookie > Authorization Header > Body
        let token = req.cookies?.[cookieName];

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        return token;
    }

    /**
     * Tao Access Token (JWT)
     * @param {Object} payload - User data
     * @returns {String} JWT token
     */
    static generateAccessToken(payload) {
        return jwt.sign(payload, config.jwt.accessToken.secret, {
            expiresIn: config.jwt.accessToken.expiresIn,
            issuer: 'phimhay-api',
            audience: 'phimhay-client',
        });
    }

    /**
     * Tao Refresh Token (random string)
     * @returns {String} Random token (hex)
     */
    static generateRefreshToken() {
        return crypto.randomBytes(64).toString('hex');
    }

    /**
     * Hash token de luu vao database (SHA256)
     * @param {String} token - Token can hash
     * @returns {String} Hashed token
     */
    static hashToken(token) {
        return crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
    }

    /**
     * Verify Access Token
     * @param {String} token - JWT token
     * @returns {Object} Decoded payload
     * @throws {ApiError} Neu token khong hop le
     */
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, config.jwt.accessToken.secret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new ApiError(401, 'Access token da het han');
            }
            if (error.name === 'JsonWebTokenError') {
                throw new ApiError(401, 'Access token khong hop le');
            }
            throw new ApiError(401, 'Xac thuc that bai');
        }
    }

    /**
     * Lay thoi gian con lai cua token (seconds)
     * @param {String} token - JWT token
     * @returns {Number} Seconds con lai
     */
    static getTokenRemainingTime(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) return 0;
            
            const now = Math.floor(Date.now() / 1000);
            const remaining = decoded.exp - now;
            
            return remaining > 0 ? remaining : 0;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Tao cookie options cho response
     * @param {String} tokenType - 'access' hoac 'refresh'
     * @returns {Object} Cookie options
     */
    static getCookieOptions(tokenType = 'access') {
        const baseOptions = {
            httpOnly: true,
            secure: config.isProduction,
            sameSite: 'strict',
            path: '/',
        };

        if (tokenType === 'refresh') {
            return {
                ...baseOptions,
                maxAge: config.jwt.refreshToken.maxAge,
            };
        }

        return {
            ...baseOptions,
            maxAge: config.jwt.accessToken.maxAge,
        };
    }

    /**
     * Lay IP address tu request
     * @param {Object} req - Express request
     * @returns {String} IP address
     */
    static getClientIp(req) {
        return req.headers['x-forwarded-for']?.split(',')[0] || 
               req.headers['x-real-ip'] || 
               req.connection?.remoteAddress || 
               req.socket?.remoteAddress || 
               'unknown';
    }

    /**
     * Lay User Agent tu request
     * @param {Object} req - Express request
     * @returns {String} User agent string
     */
    static getUserAgent(req) {
        return req.headers['user-agent'] || 'unknown';
    }
}

module.exports = TokenUtils;
