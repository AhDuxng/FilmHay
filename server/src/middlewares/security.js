const helmet = require('helmet');
const cors = require('cors');
const config = require('../config');

// Helmet - bao ve HTTP headers
const helmetMiddleware = helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: config.isProduction ? undefined : false,
});

// CORS - chi cho phep client URL, chi GET method (read-only API)
const corsMiddleware = cors({
    origin: config.isProduction
        ? config.cors.origin
        : [config.cors.origin, 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    maxAge: 86400, // Pre-flight cache 24h
});

module.exports = { helmetMiddleware, corsMiddleware };
