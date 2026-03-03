const config = require('../config');
const supabase = require('../config/supabase.config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const TokenUtils = require('../utils/tokenUtils');
const tokenBlacklistService = require('../services/tokenBlacklistService');

/**
 * Middleware xac thuc - Verify JWT token
 */
const authenticate = async (req, res, next) => {
    try {
        // Lay access token
        const token = TokenUtils.extractToken(req, 'access');

        if (!token) {
            logger.warn('Truy cap khong duoc xac thuc', {
                path: req.path,
                method: req.method,
                ip: TokenUtils.getClientIp(req),
            });
            return res.status(401).json({
                success: false,
                message: 'Vui long dang nhap de tiep tuc',
            });
        }

        // Kiem tra blacklist truoc khi verify
        const tokenHash = TokenUtils.hashToken(token);
        if (tokenBlacklistService.isBlacklisted(tokenHash)) {
            return res.status(401).json({
                success: false,
                message: 'Token da bi vo hieu hoa. Vui long dang nhap lai',
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = TokenUtils.verifyAccessToken(token);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message || 'Token khong hop le',
            });
        }

        // Lay thong tin user tu database
        const { data: user, error } = await supabase
            .from('users')
            .select('id, username, email, full_name, role, is_active')
            .eq('id', decoded.userId)
            .single();

        if (error || !user) {
            logger.warn('User khong ton tai', { userId: decoded.userId });
            return res.status(401).json({
                success: false,
                message: 'Nguoi dung khong ton tai',
            });
        }

        if (!user.is_active) {
            logger.warn('User da bi vo hieu hoa', { userId: user.id });
            return res.status(403).json({
                success: false,
                message: 'Tai khoan da bi vo hieu hoa',
            });
        }

        // Gan user vao request
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        logger.error('Loi trong auth middleware', {
            error: error.message,
            stack: error.stack,
        });
        return res.status(500).json({
            success: false,
            message: 'Loi he thong khi xac thuc',
        });
    }
};

/**
 * Middleware kiem tra role
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Chua dang nhap',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            logger.warn('Truy cap bi tu choi - Khong du quyen', {
                userId: req.user.id,
                userRole: req.user.role,
                requiredRoles: allowedRoles,
            });
            return res.status(403).json({
                success: false,
                message: 'Ban khong co quyen truy cap chuc nang nay',
            });
        }

        next();
    };
};

/**
 * Optional authentication
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = TokenUtils.extractToken(req, 'access');

        if (token) {
            try {
                // Kiem tra blacklist
                const tokenHash = TokenUtils.hashToken(token);
                if (!tokenBlacklistService.isBlacklisted(tokenHash)) {
                    const decoded = TokenUtils.verifyAccessToken(token);
                    const { data: user } = await supabase
                        .from('users')
                        .select('id, username, email, full_name, role, is_active')
                        .eq('id', decoded.userId)
                        .single();

                    if (user && user.is_active) {
                        req.user = user;
                        req.token = token;
                    }
                }
            } catch (error) {
                // Khong lam gi, van cho qua
            }
        }

        next();
    } catch (error) {
        next();
    }
};

module.exports = {
    authenticate,
    requireRole,
    optionalAuth,
};
