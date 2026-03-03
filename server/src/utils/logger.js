const winston = require('winston');
const config = require('../config');

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
        if (Object.keys(meta).length > 0) log += ` ${JSON.stringify(meta)}`;
        if (stack) log += `\n${stack}`;
        return log;
    })
);

// Trong moi truong serverless (Netlify Functions), filesystem la read-only
// Chi dung file transports khi chay tren server truyen thong
const isServerless = !!process.env.NETLIFY || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const productionTransports = isServerless ? [] : [
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5 * 1024 * 1024,
        maxFiles: 5,
    }),
    new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 10 * 1024 * 1024,
        maxFiles: 5,
    }),
];

module.exports = winston.createLogger({
    level: config.isProduction ? 'info' : 'debug',
    format: logFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), logFormat),
        }),
        ...(config.isProduction ? productionTransports : []),
    ],
});
