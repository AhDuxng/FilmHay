const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('../utils/logger');

const createRateLimiter = ({
    windowMs = 60_000,
    max = 100,
    message = 'Qua nhieu yeu cau, vui long thu lai sau',
    logLabel = 'Rate limit exceeded',
} = {}) => rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
    handler: (req, res, _next, opts) => {
        logger.warn(logLabel, { ip: req.ip, path: req.originalUrl });
        res.status(429).json(opts.message);
    },
});

const globalLimiter = createRateLimiter({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
});

const searchLimiter = createRateLimiter({
    max: 30,
    message: 'Ban dang tim kiem qua nhieu, vui long cho 1 phut',
});

const suggestLimiter = createRateLimiter({
    max: 60,
    message: 'Qua nhieu yeu cau goi y, vui long cho 1 phut',
});

module.exports = { globalLimiter, searchLimiter, suggestLimiter, createRateLimiter };
