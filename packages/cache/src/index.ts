export interface CacheHealth {
  name: "memory" | "redis" | "noop";
  mode: "mock" | "live";
  ready: boolean;
  requiredEnv?: string;
}

export interface CacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: { ttlSeconds?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

interface MemoryEntry {
  value: unknown;
  expiresAt: number | null;
}

export function getCacheHealth(env: Record<string, string | undefined> = process.env): CacheHealth {
  return env.REDIS_URL?.trim()
    ? { name: "redis", mode: "live", ready: true, requiredEnv: "REDIS_URL" }
    : { name: "memory", mode: "mock", ready: true, requiredEnv: "REDIS_URL" };
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
  };
}
