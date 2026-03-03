const helmet = require('helmet');
const cors = require('cors');
const config = require('../config');

const helmetMiddleware = helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: config.isProduction ? undefined : false,
});

const corsMiddleware = cors({
    origin: config.isProduction
        ? config.cors.origin
        : [config.cors.origin, 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
});

module.exports = { helmetMiddleware, corsMiddleware };
