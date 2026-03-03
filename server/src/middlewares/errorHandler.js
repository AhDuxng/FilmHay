const logger = require('../utils/logger');
const config = require('../config');

const errorHandler = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Loi he thong';

    const logData = { error: message, path: req.originalUrl, method: req.method };

    if (statusCode >= 500) {
        logger.error('Server Error', { ...logData, stack: err.stack, ip: req.ip });
    } else {
        logger.warn('Client Error', { ...logData, statusCode });
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(config.isProduction ? {} : { stack: err.stack }),
    });
};

const notFoundHandler = (req, res, _next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} khong ton tai`,
    });
};

module.exports = { errorHandler, notFoundHandler };
