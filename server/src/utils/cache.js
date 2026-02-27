const { LRUCache } = require('lru-cache');
const config = require('../config');
const logger = require('./logger');

// LRU Cache - In-memory cache, khong can Redis cho project nho
// Khi scale len thi co the thay bang Redis
const cache = new LRUCache({
    max: config.cache.maxSize,
    ttl: config.cache.ttl * 1000, // chuyen sang milliseconds
    updateAgeOnGet: true,         // reset TTL khi doc
    allowStale: false,
});

/**
 * Lay du lieu tu cache hoac fetch moi tu fetchFn
 * Pattern: Cache-Aside (Lazy Loading)
 * @param {string} key - Cache key
 * @param {Function} fetchFn - Ham async de fetch data neu cache miss
 * @param {number} [ttl] - Custom TTL (ms), mac dinh dung config
 * @returns {Promise<any>}
 */
const getOrSet = async (key, fetchFn, ttl) => {
    // Kiem tra cache hit
    const cached = cache.get(key);
    if (cached !== undefined) {
        logger.debug(`Cache HIT: ${key}`);
        return cached;
    }

    // Cache miss - fetch du lieu moi
    logger.debug(`Cache MISS: ${key}`);
    const data = await fetchFn();

    // Luu vao cache
    const options = ttl ? { ttl } : undefined;
    cache.set(key, data, options);

    return data;
};

/**
 * Xoa cache theo key hoac pattern
 * @param {string} [key] - Neu khong truyen thi xoa het
 */
const invalidate = (key) => {
    if (key) {
        cache.delete(key);
        logger.debug(`Cache INVALIDATED: ${key}`);
    } else {
        cache.clear();
        logger.debug('Cache CLEARED: tat ca');
    }
};

/**
 * Lay thong tin cache stats
 */
const getStats = () => ({
    size: cache.size,
    maxSize: config.cache.maxSize,
    ttl: config.cache.ttl,
});

module.exports = {
    cache,
    getOrSet,
    invalidate,
    getStats,
};
