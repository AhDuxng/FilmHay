const TOKEN_TYPES = Object.freeze({
    ACCESS: 'access',
    REFRESH: 'refresh',
});

const JWT_CONFIG = Object.freeze({
    ISSUER: 'phimhay-api',
    AUDIENCE: 'phimhay-client',
});

const BEARER_PREFIX = 'Bearer ';

const KEYWORD = Object.freeze({
    MIN_LEN: 1,
    SEARCH_MAX_LEN: 100,
    SUGGEST_MAX_LEN: 50,
});

module.exports = { TOKEN_TYPES, JWT_CONFIG, BEARER_PREFIX, KEYWORD };
