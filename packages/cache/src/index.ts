export interface CacheHealth {
  name: "memory" | "redis" | "noop";
  mode: "mock" | "live";
  ready: boolean;
  requiredEnv?: string;
  note?: string;
}

export interface CacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: { ttlSeconds?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  /**
   * Atomic increment with TTL window for rate limiting.
   * Returns the count after increment and the window reset time in ms.
   */
  incrWithWindow?(
    key: string,
    windowSeconds: number,
    nowMs?: number,
  ): Promise<{ count: number; resetAtMs: number }>;
  ping?(): Promise<boolean>;
  close?(): Promise<void>;
}

interface MemoryEntry {
  value: unknown;
  expiresAt: number | null;
}

export function getCacheHealth(
  env: Record<string, string | undefined> = process.env,
  backend?: "memory" | "redis",
): CacheHealth {
  const redisConfigured = Boolean(env.REDIS_URL?.trim());

  if (backend === "redis") {
    return {
      name: "redis",
      mode: "live",
      ready: true,
      requiredEnv: "REDIS_URL",
      note: "Redis connection established and PING verified.",
    };
  }

  if (redisConfigured) {
    return {
      name: "memory",
      mode: "mock",
      ready: false,
      requiredEnv: "REDIS_URL",
      note: "REDIS_URL is configured, but this process is not using Redis.",
    };
  }

  return {
    name: "memory",
    mode: "mock",
    ready: true,
    requiredEnv: "REDIS_URL",
    note: "In-process memory cache; not shared across instances.",
  };
}

export function createMemoryCache(now: () => number = () => Date.now()): CacheStore {
  const store = new Map<string, MemoryEntry>();

  return {
    async get<T>(key: string) {
      const entry = store.get(key);

      if (!entry) {
        return null;
      }

      if (entry.expiresAt !== null && entry.expiresAt <= now()) {
        store.delete(key);
        return null;
      }

      return entry.value as T;
    },
    async set<T>(key: string, value: T, options?: { ttlSeconds?: number }) {
      store.set(key, {
        value,
        expiresAt: options?.ttlSeconds ? now() + options.ttlSeconds * 1000 : null,
      });
    },
    async delete(key: string) {
      store.delete(key);
    },
    async incrWithWindow(key: string, windowSeconds: number, nowMs = now()) {
      const existing = await this.get<{ count: number; resetAtMs: number }>(key);
      const bucket =
        existing && existing.resetAtMs > nowMs
          ? existing
          : { count: 0, resetAtMs: nowMs + windowSeconds * 1000 };
      const next = { count: bucket.count + 1, resetAtMs: bucket.resetAtMs };
      await this.set(key, next, {
        ttlSeconds: Math.max(1, Math.ceil((bucket.resetAtMs - nowMs) / 1000)),
      });
      return next;
    },
  };
}

export function createNoopCache(): CacheStore {
  return {
    async get() {
      return null;
    },
    async set() {
      return undefined;
    },
    async delete() {
      return undefined;
    },
    async incrWithWindow(_key, windowSeconds, nowMs = Date.now()) {
      return { count: 1, resetAtMs: nowMs + windowSeconds * 1000 };
    },
  };
}

export async function createRedisCache(
  redisUrl: string,
  options?: { connectTimeoutMs?: number },
): Promise<CacheStore> {
  const { createClient } = await import("redis");
  const connectTimeoutMs = options?.connectTimeoutMs ?? 1500;
  const client = createClient({
    url: redisUrl,
    socket: {
      connectTimeout: connectTimeoutMs,
      reconnectStrategy: (retries) => Math.min(50 * 2 ** retries, 3000),
    },
  });
  client.on("error", () => undefined);
  await client.connect();
  await client.ping();

  return {
    async get<T>(key: string) {
      const raw = await client.get(key);

      if (raw == null) {
        return null;
      }

      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as T;
      }
    },
    async set<T>(key: string, value: T, options?: { ttlSeconds?: number }) {
      const payload = JSON.stringify(value);
      if (options?.ttlSeconds && options.ttlSeconds > 0) {
        await client.set(key, payload, { EX: options.ttlSeconds });
      } else {
        await client.set(key, payload);
      }
    },
    async delete(key: string) {
      await client.del(key);
    },
    async incrWithWindow(key: string, windowSeconds: number, nowMs = Date.now()) {
      const result = await client.multi().incr(key).ttl(key).exec();
      const count = Number(result[0]);
      let ttlSeconds = Number(result[1]);
      if (count === 1 || ttlSeconds < 0) {
        await client.expire(key, windowSeconds);
        ttlSeconds = windowSeconds;
      }

      return {
        count,
        resetAtMs: nowMs + ttlSeconds * 1000,
      };
    },
    async ping() {
      return (await client.ping()) === "PONG";
    },
    async close() {
      if (client.isOpen) {
        await client.quit();
      }
    },
  };
}

export async function createCacheStore(
  env: Record<string, string | undefined> = process.env,
): Promise<{ store: CacheStore; backend: "memory" | "redis" }> {
  const redisUrl = env.REDIS_URL?.trim();

  if (!redisUrl) {
    return { store: createMemoryCache(), backend: "memory" };
  }

  try {
    const store = await createRedisCache(redisUrl);
    return { store, backend: "redis" };
  } catch (error) {
    if (env.CHAINVIGIL_RUNTIME_MODE === "production") {
      throw new Error(
        `Redis is required in production but unavailable: ${
          error instanceof Error ? error.message : "unknown connection error"
        }`,
      );
    }
    return { store: createMemoryCache(), backend: "memory" };
  }
}

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

export class RateLimitError extends Error {
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
    const resetAtFallback = new Date(currentTime + windowSeconds * 1000).toISOString();

    if (!enabled) {
      return {
        allowed: true,
        remaining: maxRequests,
        resetAt: resetAtFallback,
      };
    }

    let count: number;
    let resetAtMs: number;

    if (cache.incrWithWindow) {
      const result = await cache.incrWithWindow(cacheKey, windowSeconds, currentTime);
      count = result.count;
      resetAtMs = result.resetAtMs;
    } else {
      const existing = await cache.get<{ count: number; resetAtMs: number }>(cacheKey);
      const bucket =
        existing && existing.resetAtMs > currentTime
          ? existing
          : { count: 0, resetAtMs: currentTime + windowSeconds * 1000 };
      count = bucket.count + 1;
      resetAtMs = bucket.resetAtMs;
      await cache.set(
        cacheKey,
        { count, resetAtMs },
        { ttlSeconds: Math.max(1, Math.ceil((resetAtMs - currentTime) / 1000)) },
      );
    }

    const resetAt = new Date(resetAtMs).toISOString();

    if (count > maxRequests) {
      throw new RateLimitError("请求过于频繁，请稍后再试。", resetAt);
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - count),
      resetAt,
    };
  };
}
