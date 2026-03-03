require('dotenv').config();

const path = require('path');

module.exports = {
    // Server
    port: parseInt(process.env.PORT, 10) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',

    // OPHIM API
    ophim: {
        baseUrl: process.env.OPHIM_BASE_URL || 'https://ophim1.com/v1/api',
        timeout: 10_000, // 10s timeout cho external API
    },

    // Cache
    cache: {
        ttl: parseInt(process.env.CACHE_TTL, 10) || 300,       // 5 phut mac dinh
        maxSize: 500,                                            // Toi da 500 entries trong LRU cache
    },

    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
        max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    },

    // CORS
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
    },

    // Static files (production - serve React build)
    staticPath: path.join(__dirname, '../../client/dist'),

    // JWT Authentication - Access & Refresh Token rieng biet
    jwt: {
        // Access Token - Thoi han ngan (15 phut)
        accessToken: {
            secret: process.env.JWT_ACCESS_SECRET || 'access-token-secret-change-in-production',
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
            cookieName: 'access_token',
            maxAge: 15 * 60 * 1000, // 15 minutes
        },
        // Refresh Token - Thoi han dai (7 ngay)
        refreshToken: {
            secret: process.env.JWT_REFRESH_SECRET || 'refresh-token-secret-change-in-production',
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
            cookieName: 'refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        },
    },
};
