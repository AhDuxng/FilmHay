const logger = require('../utils/logger');

class TokenBlacklistService {
    constructor() {
        this.blacklist = new Map();
        
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 60 * 60 * 1000); // 1 hour

        logger.info('TokenBlacklistService initialized (in-memory)');
    }

    /**
     * Them token vao blacklist
     * @param {String} tokenHash - Hash cua access token
     * @param {Number} expiryTime - Thoi diem token het han (timestamp)
     */
    add(tokenHash, expiryTime) {
        if (!tokenHash) {
            throw new Error('Token hash is required');
        }

        this.blacklist.set(tokenHash, expiryTime);
        
        logger.debug('Token added to blacklist', { 
            tokenHash: tokenHash.substring(0, 10) + '...',
            expiryTime: new Date(expiryTime * 1000).toISOString(),
            totalBlacklisted: this.blacklist.size
        });
    }

    /**
     * Kiem tra token co trong blacklist khong
     * @param {String} tokenHash - Hash cua access token
     * @returns {Boolean} true neu token da bi blacklist
     */
    isBlacklisted(tokenHash) {
        if (!tokenHash) return false;

        const expiryTime = this.blacklist.get(tokenHash);
        
        if (!expiryTime) return false;

        // Neu token da het han tu roi, xoa khoi blacklist
        const now = Math.floor(Date.now() / 1000);
        if (expiryTime < now) {
            this.blacklist.delete(tokenHash);
            return false;
        }

        return true;
    }

    /**
     * Xoa cac token da het han khoi blacklist
     */
    cleanup() {
        const now = Math.floor(Date.now() / 1000);
        let removedCount = 0;

        for (const [tokenHash, expiryTime] of this.blacklist.entries()) {
            if (expiryTime < now) {
                this.blacklist.delete(tokenHash);
                removedCount++;
            }
        }

        if (removedCount > 0) {
            logger.info('Blacklist cleanup completed', {
                removed: removedCount,
                remaining: this.blacklist.size
            });
        }
    }

    /**
     * Lay so luong token trong blacklist
     * @returns {Number}
     */
    size() {
        return this.blacklist.size;
    }

    /**
     * Xoa tat ca token khoi blacklist (dung cho testing)
     */
    clear() {
        this.blacklist.clear();
        logger.warn('Blacklist cleared');
    }

    /**
     * Dung cleanup interval khi shutdown
     */
    destroy() {
        clearInterval(this.cleanupInterval);
        this.blacklist.clear();
        logger.info('TokenBlacklistService destroyed');
    }
}

// Export singleton instance
module.exports = new TokenBlacklistService();
