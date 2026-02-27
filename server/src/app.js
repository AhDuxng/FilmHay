const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const config = require('./config');
const { helmetMiddleware, corsMiddleware } = require('./middlewares/security');
const { globalLimiter } = require('./middlewares/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');
const logger = require('./utils/logger');

const app = express();

// ===== SECURITY MIDDLEWARES =====
app.use(helmetMiddleware);
app.use(corsMiddleware);

// ===== PERFORMANCE MIDDLEWARES =====
app.use(compression({
    level: 6,                // Can bang giua toc do nen va CPU
    threshold: 1024,         // Chi nen response > 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    },
}));

// ===== RATE LIMITING =====
app.use('/api', globalLimiter);

// ===== PARSING =====
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ===== LOGGING =====
const morganFormat = config.isProduction ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
    skip: (req) => req.url === '/api/health', // Khong log health check
}));

// ===== API ROUTES =====
app.use('/api', routes);

// ===== STATIC FILES (Production) =====
if (config.isProduction) {
    app.use(express.static(config.staticPath, {
        maxAge: '7d',        // Browser cache 7 ngay cho static files
        etag: true,
        lastModified: true,
    }));

    // SPA fallback - moi route khong phai API deu tra ve index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(config.staticPath, 'index.html'));
    });
}

// ===== ERROR HANDLING =====
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
