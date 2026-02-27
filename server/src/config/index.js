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
};
