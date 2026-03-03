require('dotenv').config();

const path = require('path');
const express = require('express');
const app = require('./src/app');
const logger = require('./src/utils/logger');
const config = require('./src/config');
const { invalidate } = require('./src/utils/cache');
const tokenBlacklistService = require('./src/services/tokenBlacklistService');

if (config.isProduction) {
    app.use(express.static(config.staticPath, {
        maxAge: '7d',
        etag: true,
        lastModified: true,
    }));
    app.get('*', (_req, res) => {
        res.sendFile(path.join(config.staticPath, 'index.html'));
    });
}

const server = app.listen(config.port, () => {
    logger.info(`Server started | port=${config.port} | env=${config.nodeEnv} | api=${config.ophim.baseUrl}`);
});

// Graceful shutdown
const SHUTDOWN_TIMEOUT = 10_000;

const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down...`);

    server.close(() => {
        invalidate();
        tokenBlacklistService.destroy();
        logger.info('Shutdown hoan tat');
        process.exit(0);
    });

    setTimeout(() => {
        logger.error('Shutdown timeout, force exit');
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection', { error: err.message, stack: err.stack });
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
    server.close(() => process.exit(1));
});
