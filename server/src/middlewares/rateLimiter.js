const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('../utils/logger');

// Rate limiter chung - gioi han tat ca request
const globalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,      // Tra ve rate limit info trong headers (RateLimit-*)
    legacyHeaders: false,       // Tat X-RateLimit-* headers
    message: {
        success: false,
        message: 'Qua nhieu yeu cau, vui long thu lai sau',
    },
    handler: (req, res, next, options) => {
        logger.warn('Rate limit exceeded', {
            ip: req.ip,
            path: req.originalUrl,
        });
        res.status(429).json(options.message);
    },
});

// Rate limiter 
const searchLimiter = rateLimit({
    windowMs: 60_000,  
    max: 30,           
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Ban dang tim kiem qua nhieu, vui long cho 1 phut',
    },
});

// Rate limiter rieng cho suggest 
const suggestLimiter = rateLimit({
    windowMs: 60_000,  
    max: 60,           
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Qua nhieu yeu cau goi y, vui long cho 1 phut',
    },
});

// custom rate limiter
const createRateLimiter = (options = {}) => {
    const defaultOptions = {
        windowMs: 60_000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: options.message || 'Qua nhieu yeu cau, vui long thu lai sau',
        },
        handler: (req, res, next, opts) => {
            logger.warn('Custom rate limit exceeded', {
                ip: req.ip,
                path: req.originalUrl,
            });
            res.status(429).json(opts.message);
        },
    };

    return rateLimit({ ...defaultOptions, ...options });
};

module.exports = { 
    globalLimiter, 
    searchLimiter, 
    suggestLimiter,
    createRateLimiter,
};
