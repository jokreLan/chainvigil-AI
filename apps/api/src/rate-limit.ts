import { createMemoryCache, type CacheStore } from "@chainvigil/cache";

export interface RateLimitOptions {
  enabled?: boolean;
  maxRequests?: number;
  windowSeconds?: number;
  now?: () => number;
  cache?: CacheStore;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string;
}

interface RateLimitBucket {
  count: number;
  resetAtMs: number;
}

export class ApiRateLimitError extends Error {
  statusCode = 429;

  constructor(
    message: string,
    readonly resetAt: string,
  ) {
    super(message);
  }
}

export function createRateLimiter(options: RateLimitOptions = {}) {
  const enabled = options.enabled ?? true;
  const maxRequests = options.maxRequests ?? 60;
  const windowSeconds = options.windowSeconds ?? 60;
  const now = options.now ?? (() => Date.now());
  const cache = options.cache ?? createMemoryCache(now);

  return async function checkRateLimit(key: string): Promise<RateLimitResult> {
    const currentTime = now();
    const cacheKey = `rate-limit:${key}`;
    const existing = await cache.get<RateLimitBucket>(cacheKey);
    const bucket =
      existing && existing.resetAtMs > currentTime
        ? existing
        : { count: 0, resetAtMs: currentTime + windowSeconds * 1000 };
    const nextCount = bucket.count + 1;
    const resetAt = new Date(bucket.resetAtMs).toISOString();

    if (!enabled) {
      return {
        allowed: true,
        remaining: maxRequests,
        resetAt,
      };
    }

    if (nextCount > maxRequests) {
      throw new ApiRateLimitError("请求过于频繁，请稍后再试。", resetAt);
    }

    await cache.set<RateLimitBucket>(
      cacheKey,
      {
        count: nextCount,
        resetAtMs: bucket.resetAtMs,
      },
      { ttlSeconds: Math.max(1, Math.ceil((bucket.resetAtMs - currentTime) / 1000)) },
    );

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - nextCount),
      resetAt,
    };
  };
}
