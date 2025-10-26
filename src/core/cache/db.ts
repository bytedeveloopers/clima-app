import localforage from 'localforage';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // TTL in milliseconds
}

export interface CacheResult<T> {
  data: T | null;
  stale: boolean;
  ageMs: number;
}

export class CacheDB {
  private store: LocalForage;

  constructor(name = 'clima-app-cache') {
    this.store = localforage.createInstance({
      name,
      driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
      storeName: 'keyvaluepairs',
    });
  }

  /**
   * Store data with TTL (Time To Live)
   * @param key - Cache key
   * @param value - Data to cache
   * @param ttlMinutes - TTL in minutes
   */
  async setWithTTL<T>(key: string, value: T, ttlMinutes: number): Promise<void> {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000, // Convert minutes to milliseconds
    };

    try {
      await this.store.setItem(key, entry);
      
      if (import.meta.env.DEV) {
        console.log(`[Cache] Set ${key} with TTL ${ttlMinutes}min`);
      }
    } catch (error) {
      console.error(`[Cache] Failed to set ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get data from cache, checking freshness
   * @param key - Cache key
   * @returns CacheResult with data, stale flag, and age
   */
  async getFresh<T>(key: string): Promise<CacheResult<T>> {
    try {
      const entry = await this.store.getItem<CacheEntry<T>>(key);
      
      if (!entry) {
        return {
          data: null,
          stale: true,
          ageMs: 0,
        };
      }

      const now = Date.now();
      const ageMs = now - entry.timestamp;
      const isExpired = ageMs > entry.ttl;

      if (import.meta.env.DEV) {
        console.log(`[Cache] Get ${key}: age=${Math.round(ageMs / 1000)}s, expired=${isExpired}`);
      }

      return {
        data: entry.data,
        stale: isExpired,
        ageMs,
      };
    } catch (error) {
      console.error(`[Cache] Failed to get ${key}:`, error);
      return {
        data: null,
        stale: true,
        ageMs: 0,
      };
    }
  }

  /**
   * Get data from cache without checking freshness
   * @param key - Cache key
   * @returns Raw data or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const entry = await this.store.getItem<CacheEntry<T>>(key);
      return entry?.data || null;
    } catch (error) {
      console.error(`[Cache] Failed to get ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item from cache
   * @param key - Cache key
   */
  async remove(key: string): Promise<void> {
    try {
      await this.store.removeItem(key);
      
      if (import.meta.env.DEV) {
        console.log(`[Cache] Removed ${key}`);
      }
    } catch (error) {
      console.error(`[Cache] Failed to remove ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all cached data
   */
  async clear(): Promise<void> {
    try {
      await this.store.clear();
      
      if (import.meta.env.DEV) {
        console.log('[Cache] Cleared all data');
      }
    } catch (error) {
      console.error('[Cache] Failed to clear cache:', error);
      throw error;
    }
  }

  /**
   * Get all cache keys
   */
  async keys(): Promise<string[]> {
    try {
      return await this.store.keys();
    } catch (error) {
      console.error('[Cache] Failed to get keys:', error);
      return [];
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalKeys: number;
    freshKeys: number;
    staleKeys: number;
    totalSizeEstimate: number;
  }> {
    try {
      const keys = await this.keys();
      let freshKeys = 0;
      let staleKeys = 0;
      let totalSizeEstimate = 0;

      for (const key of keys) {
        const result = await this.getFresh(key);
        if (result.stale) {
          staleKeys++;
        } else {
          freshKeys++;
        }
        
        // Rough size estimate (not completely accurate)
        if (result.data) {
          totalSizeEstimate += JSON.stringify(result.data).length;
        }
      }

      return {
        totalKeys: keys.length,
        freshKeys,
        staleKeys,
        totalSizeEstimate,
      };
    } catch (error) {
      console.error('[Cache] Failed to get stats:', error);
      return {
        totalKeys: 0,
        freshKeys: 0,
        staleKeys: 0,
        totalSizeEstimate: 0,
      };
    }
  }

  /**
   * Clean up expired entries
   */
  async cleanup(): Promise<number> {
    try {
      const keys = await this.keys();
      let removedCount = 0;

      for (const key of keys) {
        const result = await this.getFresh(key);
        if (result.stale && result.data === null) {
          await this.remove(key);
          removedCount++;
        }
      }

      if (import.meta.env.DEV) {
        console.log(`[Cache] Cleaned up ${removedCount} expired entries`);
      }

      return removedCount;
    } catch (error) {
      console.error('[Cache] Failed to cleanup:', error);
      return 0;
    }
  }
}

// Default cache instance
export const cacheDB = new CacheDB();

// Utility functions for common cache operations
export const cache = {
  /**
   * Set data with default TTL of 10 minutes
   */
  set: <T>(key: string, value: T, ttlMinutes = 10) => 
    cacheDB.setWithTTL(key, value, ttlMinutes),

  /**
   * Get fresh data from cache
   */
  getFresh: <T>(key: string) => cacheDB.getFresh<T>(key),

  /**
   * Get data without freshness check
   */
  get: <T>(key: string) => cacheDB.get<T>(key),

  /**
   * Remove from cache
   */
  remove: (key: string) => cacheDB.remove(key),

  /**
   * Clear all cache
   */
  clear: () => cacheDB.clear(),

  /**
   * Get cache stats
   */
  stats: () => cacheDB.getStats(),

  /**
   * Cleanup expired entries
   */
  cleanup: () => cacheDB.cleanup(),
};

// Auto-cleanup on app start (run once)
if (typeof window !== 'undefined') {
  // Run cleanup after a short delay to avoid blocking app initialization
  setTimeout(() => {
    cache.cleanup().catch(console.error);
  }, 2000);
}