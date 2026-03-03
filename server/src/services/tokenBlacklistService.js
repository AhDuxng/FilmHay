const logger = require('../utils/logger');

const CLEANUP_INTERVAL = 60 * 60 * 1000;

class TokenBlacklistService {
    constructor() {
        this.blacklist = new Map();
        this.cleanupInterval = setInterval(() => this.cleanup(), CLEANUP_INTERVAL);
        logger.info('TokenBlacklistService initialized (in-memory)');
    }

    add(tokenHash, expiryTime) {
        if (!tokenHash) throw new Error('Token hash is required');
        this.blacklist.set(tokenHash, expiryTime);
        logger.debug('Token blacklisted', {
            hash: tokenHash.substring(0, 10) + '...',
            totalBlacklisted: this.blacklist.size,
        });
    }

    isBlacklisted(tokenHash) {
        if (!tokenHash) return false;
        const expiryTime = this.blacklist.get(tokenHash);
        if (!expiryTime) return false;

        if (expiryTime < Math.floor(Date.now() / 1000)) {
            this.blacklist.delete(tokenHash);
            return false;
        }
        return true;
    }

    cleanup() {
        const now = Math.floor(Date.now() / 1000);
        let removed = 0;

        for (const [hash, expiry] of this.blacklist) {
            if (expiry < now) {
                this.blacklist.delete(hash);
                removed++;
            }
        }

        if (removed > 0) {
            logger.info('Blacklist cleanup', { removed, remaining: this.blacklist.size });
        }
    }

    size() { return this.blacklist.size; }

    destroy() {
        clearInterval(this.cleanupInterval);
        this.blacklist.clear();
        logger.info('TokenBlacklistService destroyed');
    }
}

module.exports = new TokenBlacklistService();
