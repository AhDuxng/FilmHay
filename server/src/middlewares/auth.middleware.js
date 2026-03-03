const { LRUCache } = require('lru-cache');
const supabase = require('../config/supabase.config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const TokenUtils = require('../utils/tokenUtils');
const tokenBlacklistService = require('../services/tokenBlacklistService');

const userCache = new LRUCache({ max: 500, ttl: 60_000 });

const loadUser = async (userId) => {
    const cached = userCache.get(userId);
    if (cached) return cached;

    const { data: user, error } = await supabase
        .from('users')
        .select('id, username, email, full_name, role, is_active')
        .eq('id', userId)
        .single();

    if (error || !user) return null;

    userCache.set(userId, user);
    return user;
};

/**
 * Middleware xac thuc - Verify JWT token
 */
const authenticate = async (req, res, next) => {
    try {
        // Lay access token
        const token = TokenUtils.extractToken(req, 'access');

        if (!token) {
            logger.warn('Unauthenticated access', {
                path: req.path,
                method: req.method,
                ip: TokenUtils.getClientIp(req),
            });
            return next(new ApiError(401, 'Vui long dang nhap de tiep tuc'));
        }

        // Kiem tra blacklist truoc khi verify
        const tokenHash = TokenUtils.hashToken(token);
        if (tokenBlacklistService.isBlacklisted(tokenHash)) {
            return next(new ApiError(401, 'Token da bi vo hieu hoa. Vui long dang nhap lai'));
        }

        // Verify token
        let decoded;
        try {
            decoded = TokenUtils.verifyAccessToken(token);
        } catch (error) {
            return next(new ApiError(401, error.message || 'Token khong hop le'));
        }

        // Lay thong tin user tu database
        const user = await loadUser(decoded.userId);

        if (!user) {
            logger.warn('User not found', { userId: decoded.userId });
            return next(new ApiError(401, 'Nguoi dung khong ton tai'));
        }

        if (!user.is_active) {
            logger.warn('Disabled user access attempt', { userId: user.id });
            return next(new ApiError(403, 'Tai khoan da bi vo hieu hoa'));
        }

        // Gan user vao request
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        logger.error('Auth middleware error', { error: error.message, stack: error.stack });
        next(new ApiError(500, 'Loi he thong khi xac thuc'));
    }
};

/**
 * Middleware kiem tra role
 */
const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, 'Chua dang nhap'));
    }

    if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Access denied - insufficient role', {
            userId: req.user.id,
            userRole: req.user.role,
            requiredRoles: allowedRoles,
        });
        return next(new ApiError(403, 'Ban khong co quyen truy cap chuc nang nay'));
    }

    next();
};

/**
 * Optional authentication
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = TokenUtils.extractToken(req, 'access');

        if (token) {
            // Kiem tra blacklist
            const tokenHash = TokenUtils.hashToken(token);
            if (!tokenBlacklistService.isBlacklisted(tokenHash)) {
                try {
                    const decoded = TokenUtils.verifyAccessToken(token);
                    const user = await loadUser(decoded.userId);
                    if (user?.is_active) {
                        req.user = user;
                        req.token = token;
                    }
                } catch {
                    // Khong lam gi, van cho qua
                }
            }
        }

        next();
    } catch {
        next();
    }
};

const invalidateUserCache = (userId) => userCache.delete(userId);

module.exports = { authenticate, requireRole, optionalAuth, invalidateUserCache };
