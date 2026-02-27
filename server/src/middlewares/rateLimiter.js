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

// Rate limiter nghiem ngat hon cho API search (de phong spam)
const searchLimiter = rateLimit({
    windowMs: 60_000,  // 1 phut
    max: 30,           // 30 request/phut cho search
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Ban dang tim kiem qua nhieu, vui long cho 1 phut',
    },
});

module.exports = { globalLimiter, searchLimiter };
