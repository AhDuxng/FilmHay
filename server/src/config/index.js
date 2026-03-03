const path = require('path');

const env = (key, fallback) => process.env[key] || fallback;
const envInt = (key, fallback) => parseInt(process.env[key], 10) || fallback;

const config = Object.freeze({
    port: envInt('PORT', 5000),
    nodeEnv: env('NODE_ENV', 'development'),
    isProduction: process.env.NODE_ENV === 'production',

    ophim: Object.freeze({
        baseUrl: env('OPHIM_BASE_URL', 'https://ophim1.com/v1/api'),
        timeout: 10_000,
    }),

    cache: Object.freeze({
        ttl: envInt('CACHE_TTL', 300),
        maxSize: 500,
    }),

    rateLimit: Object.freeze({
        windowMs: envInt('RATE_LIMIT_WINDOW_MS', 60_000),
        max: envInt('RATE_LIMIT_MAX', 100),
    }),

    cors: Object.freeze({
        origin: env('CLIENT_URL', 'http://localhost:5173'),
    }),

    staticPath: path.join(__dirname, '../../client/dist'),

    jwt: Object.freeze({
        accessToken: Object.freeze({
            secret: env('JWT_ACCESS_SECRET', 'access-token-secret-change-in-production'),
            expiresIn: env('JWT_ACCESS_EXPIRES_IN', '15m'),
            cookieName: 'access_token',
            maxAge: 15 * 60 * 1000,
        }),
        refreshToken: Object.freeze({
            secret: env('JWT_REFRESH_SECRET', 'refresh-token-secret-change-in-production'),
            expiresIn: env('JWT_REFRESH_EXPIRES_IN', '7d'),
            cookieName: 'refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }),
    }),
});

module.exports = config;
