const { LRUCache } = require('lru-cache');
const supabase = require('../config/supabase.config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const TokenUtils = require('../utils/tokenUtils');
const tokenBlacklistService = require('../services/tokenBlacklistService');
const { TOKEN_TYPES } = require('../utils/constants');

const USER_FIELDS = 'id, username, email, full_name, role, is_active';
const userCache = new LRUCache({ max: 500, ttl: 60_000 });

const loadUser = async (userId) => {
    const cached = userCache.get(userId);
    if (cached) return cached;

    const { data: user, error } = await supabase
        .from('users')
        .select(USER_FIELDS)
        .eq('id', userId)
        .single();

    if (error) {
        logger.warn('Load user that bai', { userId, error: error.message });
        return null;
    }
    if (!user) return null;

    userCache.set(userId, user);
    return user;
};

// Kiem tra token hop le va chua bi blacklist
const verifyAndDecode = (token) => {
    const tokenHash = TokenUtils.hashToken(token);
    if (tokenBlacklistService.isBlacklisted(tokenHash)) {
        throw ApiError.unauthorized('Token da bi vo hieu hoa. Vui long dang nhap lai');
    }
    return TokenUtils.verifyAccessToken(token);
};

const authenticate = async (req, _res, next) => {
    try {
        const token = TokenUtils.extractToken(req, TOKEN_TYPES.ACCESS);
        if (!token) {
            return next(ApiError.unauthorized('Vui long dang nhap de tiep tuc'));
        }

        const decoded = verifyAndDecode(token);
        const user = await loadUser(decoded.userId);

        if (!user) return next(ApiError.unauthorized('Nguoi dung khong ton tai'));
        if (!user.is_active) return next(ApiError.forbidden('Tai khoan da bi vo hieu hoa'));

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        if (err instanceof ApiError) return next(err);
        logger.error('Auth middleware error', { error: err.message });
        next(ApiError.internal('Loi he thong khi xac thuc'));
    }
};

const requireRole = (...allowedRoles) => (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized('Chua dang nhap'));

    if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Access denied', {
            userId: req.user.id,
            userRole: req.user.role,
            requiredRoles: allowedRoles,
        });
        return next(ApiError.forbidden('Ban khong co quyen truy cap chuc nang nay'));
    }
    next();
};

const optionalAuth = async (req, _res, next) => {
    try {
        const token = TokenUtils.extractToken(req, TOKEN_TYPES.ACCESS);
        if (!token) return next();

        try {
            const decoded = verifyAndDecode(token);
            const user = await loadUser(decoded.userId);
            if (user?.is_active) {
                req.user = user;
                req.token = token;
            }
        } catch {
            // Token khong hop le - van cho request di tiep
        }
        next();
    } catch {
        next();
    }
};

const invalidateUserCache = (userId) => userCache.delete(userId);

module.exports = { authenticate, requireRole, optionalAuth, invalidateUserCache };
