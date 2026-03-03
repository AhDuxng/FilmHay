const { LRUCache } = require('lru-cache');
const config = require('../config');
const logger = require('./logger');

const cache = new LRUCache({
    max: config.cache.maxSize,
    ttl: config.cache.ttl * 1000,
    updateAgeOnGet: true,
    allowStale: false,
});

const getOrSet = async (key, fetchFn, ttl) => {
    const cached = cache.get(key);
    if (cached !== undefined) {
        logger.debug(`Cache HIT: ${key}`);
        return cached;
    }

    logger.debug(`Cache MISS: ${key}`);
    const data = await fetchFn();
    cache.set(key, data, ttl ? { ttl } : undefined);
    return data;
};

const invalidate = (key) => {
    if (key) {
        cache.delete(key);
        logger.debug(`Cache INVALIDATED: ${key}`);
    } else {
        cache.clear();
        logger.debug('Cache CLEARED');
    }
};

const getStats = () => ({
    size: cache.size,
    maxSize: config.cache.maxSize,
    ttl: config.cache.ttl,
});

module.exports = { cache, getOrSet, invalidate, getStats };
