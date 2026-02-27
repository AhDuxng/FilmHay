require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/utils/logger');
const config = require('./src/config');

const PORT = config.port;

const server = app.listen(PORT, () => {
    logger.info(`Server dang chay tren PORT ${PORT}`);
    logger.info(`Moi truong: ${config.nodeEnv}`);
    logger.info(`OPHIM API: ${config.ophim.baseUrl}`);
});

// ===== GRACEFUL SHUTDOWN =====
const shutdown = (signal) => {
    logger.info(`Nhan duoc tin hieu ${signal}, dang tat server...`);
    server.close(async () => {
        logger.info('HTTP server da dong. Giai phong resources...');

        // Xoa cache truoc khi tat
        try {
            const { invalidate } = require('./src/utils/cache');
            invalidate();
            logger.info('Cache da duoc xoa');
        } catch (err) {
            logger.warn('Loi khi xoa cache', { error: err.message });
        }

        logger.info('Shutdown hoan tat. Tam biet!');
        process.exit(0);
    });

    // Buoc chuyen tiep neu server khong dong trong 10s
    setTimeout(() => {
        logger.error('Graceful shutdown timeout, ep tat...');
        process.exit(1);
    }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection', {
        error: err.message,
        stack: err.stack,
    });
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', {
        error: err.message,
        stack: err.stack,
    });
    server.close(() => {
        process.exit(1);
    });
});
