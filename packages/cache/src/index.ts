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
}

interface MemoryEntry {
  value: unknown;
  expiresAt: number | null;
}

export function getCacheHealth(env: Record<string, string | undefined> = process.env): CacheHealth {
  if (env.REDIS_URL?.trim()) {
    return {
      name: "redis",
      mode: "live",
      // Configuration present; connectivity is validated when the store is constructed.
      ready: true,
      requiredEnv: "REDIS_URL",
      note: "REDIS_URL configured; runtime store may fall back to memory if connect fails.",
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

/**
 * Minimal Redis-backed cache using the RESP protocol over TCP.
 * Supports GET/SET/DEL/INCR+PEXPIRE for rate limiting without extra deps.
 */
export async function createRedisCache(
  redisUrl: string,
  options?: { connectTimeoutMs?: number },
): Promise<CacheStore> {
  const url = new URL(redisUrl);
  const host = url.hostname || "127.0.0.1";
  const port = Number(url.port || 6379);
  const password = url.password ? decodeURIComponent(url.password) : undefined;
  const db = url.pathname && url.pathname !== "/" ? Number(url.pathname.slice(1)) : 0;
  const connectTimeoutMs = options?.connectTimeoutMs ?? 1500;

  const { createConnection } = await import("node:net");

  type Pending = {
    resolve: (value: unknown) => void;
    reject: (error: Error) => void;
  };

  const queue: Pending[] = [];
  let buffer: Buffer = Buffer.alloc(0);
  let connected = false;

  const socket = createConnection({ host, port });
  socket.setNoDelay(true);

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error("Redis connect timeout"));
    }, connectTimeoutMs);

    socket.once("connect", () => {
      clearTimeout(timer);
      connected = true;
      resolve();
    });
    socket.once("error", (error) => {
      clearTimeout(timer);
      reject(error instanceof Error ? error : new Error(String(error)));
    });
  });

  socket.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    drain();
  });

  socket.on("error", (error) => {
    while (queue.length > 0) {
      queue.shift()?.reject(error instanceof Error ? error : new Error(String(error)));
    }
  });

  socket.on("close", () => {
    connected = false;
    while (queue.length > 0) {
      queue.shift()?.reject(new Error("Redis connection closed"));
    }
  });

  function drain() {
    while (queue.length > 0) {
      const parsed = tryParse(buffer);

      if (!parsed) {
        return;
      }

      buffer = parsed.rest;
      const pending = queue.shift();

      if (!pending) {
        return;
      }

      if (parsed.error) {
        pending.reject(new Error(parsed.error));
      } else {
        pending.resolve(parsed.value);
      }
    }
  }

  function tryParse(input: Buffer): { value?: unknown; error?: string; rest: Buffer } | null {
    if (input.length === 0) {
      return null;
    }

    const type = String.fromCharCode(input[0]!);

    if (type === "+" || type === "-" || type === ":" || type === "$") {
      const lineEnd = input.indexOf("\r\n");

      if (lineEnd < 0) {
        return null;
      }

      const line = input.subarray(1, lineEnd).toString("utf8");
      const restAfterLine = input.subarray(lineEnd + 2);

      if (type === "+") {
        return { value: line, rest: restAfterLine };
      }

      if (type === "-") {
        return { error: line, rest: restAfterLine };
      }

      if (type === ":") {
        return { value: Number(line), rest: restAfterLine };
      }

      // bulk string
      const length = Number(line);

      if (length === -1) {
        return { value: null, rest: restAfterLine };
      }

      if (restAfterLine.length < length + 2) {
        return null;
      }

      const value = restAfterLine.subarray(0, length).toString("utf8");
      return { value, rest: restAfterLine.subarray(length + 2) };
    }

    return { error: `Unsupported RESP type: ${type}`, rest: input.subarray(1) };
  }

  function encodeCommand(args: Array<string | number>): Buffer {
    const parts = [`*${args.length}\r\n`];

    for (const arg of args) {
      const text = String(arg);
      parts.push(`$${Buffer.byteLength(text)}\r\n${text}\r\n`);
    }

    return Buffer.from(parts.join(""), "utf8");
  }

  async function send<T>(args: Array<string | number>): Promise<T> {
    if (!connected) {
      throw new Error("Redis not connected");
    }

    return new Promise<T>((resolve, reject) => {
      queue.push({
        resolve: (value) => resolve(value as T),
        reject,
      });
      socket.write(encodeCommand(args));
    });
  }

  if (password) {
    await send(["AUTH", password]);
  }

  if (db > 0) {
    await send(["SELECT", db]);
  }

  return {
    async get<T>(key: string) {
      const raw = await send<string | null>(["GET", key]);

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
        await send(["SET", key, payload, "EX", options.ttlSeconds]);
      } else {
        await send(["SET", key, payload]);
      }
    },
    async delete(key: string) {
      await send(["DEL", key]);
    },
    async incrWithWindow(key: string, windowSeconds: number, nowMs = Date.now()) {
      const count = await send<number>(["INCR", key]);

      if (count === 1) {
        await send(["EXPIRE", key, windowSeconds]);
      }

      const ttlSeconds = await send<number>(["TTL", key]);
      const remaining = ttlSeconds > 0 ? ttlSeconds : windowSeconds;

      return {
        count,
        resetAtMs: nowMs + remaining * 1000,
      };
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
  } catch {
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
