import { describe, expect, it } from "vitest";
import { ApiRateLimitError, createRateLimiter } from "./rate-limit.js";

describe("createRateLimiter", () => {
  it("allows requests under the limit", async () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowSeconds: 60, now: () => 1_000 });

    await expect(limiter("ip:127.0.0.1")).resolves.toMatchObject({
      allowed: true,
      remaining: 1,
    });
  });

  it("throws a typed 429 error over the limit", async () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowSeconds: 60, now: () => 1_000 });

    await limiter("ip:127.0.0.1");
    await expect(limiter("ip:127.0.0.1")).rejects.toMatchObject({
      statusCode: 429,
      message: "请求过于频繁，请稍后再试。",
    } satisfies Partial<ApiRateLimitError>);
  });

  it("opens a new window after reset", async () => {
    let currentTime = 1_000;
    const limiter = createRateLimiter({ maxRequests: 1, windowSeconds: 1, now: () => currentTime });

    await limiter("ip:127.0.0.1");
    currentTime = 2_001;

    await expect(limiter("ip:127.0.0.1")).resolves.toMatchObject({
      allowed: true,
      remaining: 0,
    });
  });
});
