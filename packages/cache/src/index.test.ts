import { describe, expect, it } from "vitest";
import { createMemoryCache, createNoopCache, getCacheHealth } from "./index";

describe("cache skeleton", () => {
  it("reports memory cache when Redis is not configured", () => {
    expect(getCacheHealth({})).toMatchObject({
      name: "memory",
      mode: "mock",
      ready: true,
      requiredEnv: "REDIS_URL",
    });
  });

  it("reports redis live-ready when REDIS_URL exists", () => {
    expect(getCacheHealth({ REDIS_URL: "redis://localhost:6379" })).toMatchObject({
      name: "redis",
      mode: "live",
      ready: true,
      requiredEnv: "REDIS_URL",
    });
  });

  it("stores and expires memory cache values", async () => {
    let currentTime = 1_000;
    const cache = createMemoryCache(() => currentTime);

    await cache.set("token:base:0x1", { risk: "HIGH" }, { ttlSeconds: 1 });
    await expect(cache.get("token:base:0x1")).resolves.toEqual({ risk: "HIGH" });

    currentTime = 2_001;
    await expect(cache.get("token:base:0x1")).resolves.toBeNull();
  });

  it("provides a noop cache for tests and disabled modes", async () => {
    const cache = createNoopCache();

    await cache.set("key", "value");
    await expect(cache.get("key")).resolves.toBeNull();
  });
});
