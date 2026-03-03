const { LRUCache } = require('lru-cache');
const config = require('../config');
const logger = require('./logger');

// LRU Cache - In-memory cache
const cache = new LRUCache({
    max: config.cache.maxSize,
    ttl: config.cache.ttl * 1000, 
    updateAgeOnGet: true,         
    allowStale: false,
});

/**
 * @param {string} key
 * @param {Function} fetchFn 
 * @param {number} [ttl] 
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
