const logger = require('../utils/logger');
const config = require('../config');

/**
 * Middleware xu ly loi tap trung
 * Pattern: Centralized Error Handler
 * Moi loi trong app deu chay qua day
 */
const errorHandler = (err, req, res, _next) => {
    // Mac dinh
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Loi he thong';

    // Log error
    if (statusCode >= 500) {
        logger.error('Server Error', {
            error: message,
            stack: err.stack,
            path: req.originalUrl,
            method: req.method,
            ip: req.ip,
        });
    } else {
        logger.warn('Client Error', {
            error: message,
            path: req.originalUrl,
            statusCode,
        });
    }

    // Response
    const response = {
        success: false,
        message,
        ...(config.isProduction ? {} : { stack: err.stack }),
    };

    res.status(statusCode).json(response);
};

/**
 * Middleware xu ly 404 - Route khong ton tai
 */
const notFoundHandler = (req, res, _next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} khong ton tai`,
    });
};

module.exports = { errorHandler, notFoundHandler };
