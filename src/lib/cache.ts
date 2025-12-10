/**
 * Simple in-memory cache with TTL (Time To Live) support
 * No external dependencies - uses native Map
 */

interface CacheEntry<T> {
  data: T;
  expires: number;
}

class MemoryCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Get cached value or fetch and cache if not available/expired
   * @param key - Unique cache key
   * @param ttl - Time to live in milliseconds
   * @param fetchFn - Function to fetch data if cache miss
   */
  async get<T>(
    key: string,
    ttl: number,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key);

    // Cache hit and not expired
    if (cached && cached.expires > Date.now()) {
      console.log(`[Cache HIT] ${key}`);
      return cached.data as T;
    }

    // Cache miss or expired - fetch fresh data
    console.log(`[Cache MISS] ${key}`);
    const data = await fetchFn();

    // Store in cache with expiration
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });

    return data;
  }

  /**
   * Manually set a cache entry
   */
  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  /**
   * Invalidate (delete) a specific cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`[Cache INVALIDATE] ${key}`);
  }

  /**
   * Invalidate all keys matching a pattern
   * Example: invalidatePattern('friends:') clears all friend-related cache
   */
  invalidatePattern(pattern: string): void {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    console.log(`[Cache INVALIDATE PATTERN] ${pattern} (${count} entries cleared)`);
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`[Cache CLEAR] All ${size} entries cleared`);
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires <= now) {
        this.cache.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`[Cache CLEANUP] Removed ${removed} expired entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Cleanup interval on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Singleton instance
export const cache = new MemoryCache();

// Helper function for common usage
export async function getCached<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  return cache.get(key, ttl, fetchFn);
}

// Common TTL presets (in milliseconds)
export const TTL = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const;
