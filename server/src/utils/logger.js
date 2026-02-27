const winston = require('winston');
const config = require('../config');

// Custom format: timestamp + level + message + metadata
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
        }
        if (stack) {
            log += `\n${stack}`;
        }
        return log;
    })
);

const logger = winston.createLogger({
    level: config.isProduction ? 'info' : 'debug',
    format: logFormat,
    transports: [
        // Console - luon bat
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            ),
        }),
        // File - chi ghi error trong production
        ...(config.isProduction
            ? [
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    maxsize: 5 * 1024 * 1024,   // 5MB
                    maxFiles: 5,
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                    maxsize: 10 * 1024 * 1024,  // 10MB
                    maxFiles: 5,
                }),
            ]
            : []),
    ],
});

module.exports = logger;
