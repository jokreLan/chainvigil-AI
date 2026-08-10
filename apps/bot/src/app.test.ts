import { describe, expect, it } from "vitest";
import { buildBotApp } from "./app.js";

describe("bot app", () => {
  it("returns security headers", async () => {
    const app = await buildBotApp();
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.headers["content-security-policy"]).toContain("default-src");

    await app.close();
  });

  it("returns a helpful reply without a /check command", async () => {
    const app = await buildBotApp();
    const response = await app.inject({
      method: "POST",
      url: "/telegram/webhook",
      payload: {
        message: {
          text: "/help",
        },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().reply).toContain("/check <CA>");

    await app.close();
  });

  it("handles /start with brand and check guidance", async () => {
    const app = await buildBotApp();
    const response = await app.inject({
      method: "POST",
      url: "/telegram/webhook",
      payload: {
        message: {
          text: "/start",
        },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().reply).toContain("ChainVigil");
    expect(response.json().reply).toContain("买币前，先查 CA。");
    expect(response.json().reply).toContain("/check <CA>");

    await app.close();
  });

  it("handles /check and returns a report link", async () => {
    const app = await buildBotApp();
    const response = await app.inject({
      method: "POST",
      url: "/telegram/webhook",
      payload: {
        message: {
          text: "/check 0x1111111111111111111111111111111111111110",
          chat: {
            id: 1,
          },
        },
      },
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.method).toBe("sendMessage");
    expect(body.chat_id).toBe(1);
    expect(body.text).toContain("ChainVigil 检测结果：高危");
    expect(body.text).toContain("模式：MOCK · 置信：UNASSESSED");
    expect(body.text).toContain("/token/bsc/0x1111111111111111111111111111111111111110");

    await app.close();
  });

  it("handles /check for a Solana CA", async () => {
    const app = await buildBotApp();
    const response = await app.inject({
      method: "POST",
      url: "/telegram/webhook",
      payload: {
        message: {
          text: "/check So11111111111111111111111111111111111111112",
          chat: {
            id: 1,
          },
        },
      },
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.method).toBe("sendMessage");
    expect(body.text).toContain("/token/solana/So11111111111111111111111111111111111111112");

    await app.close();
  });

  it("returns a helpful reply for invalid /check input", async () => {
    const app = await buildBotApp();
    const response = await app.inject({
      method: "POST",
      url: "/telegram/webhook",
      payload: {
        message: {
          text: "/check not-a-ca",
        },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().reply).toContain("请输入有效的 SOL 或 BNB Token 合约地址");

    await app.close();
  });

  it("handles /top and /settings skeleton commands", async () => {
    const app = await buildBotApp();
    const topResponse = await app.inject({
      method: "POST",
      url: "/telegram/webhook",
      payload: {
        message: { text: "/top" },
      },
    });
    const settingsResponse = await app.inject({
      method: "POST",
      url: "/telegram/webhook",
      payload: {
        message: { text: "/settings", chat: { id: "-1001000000002" } },
      },
    });

    expect(topResponse.json().reply).toContain("高危 CA 榜单");
    expect(topResponse.json().reply).toContain("SOL So111");
    expect(topResponse.json().reply).toContain("BNB 0x2222");
    expect(settingsResponse.json().text).toContain("群设置 skeleton");
    expect(settingsResponse.json().text).toContain("Meme Watch CN");

    await app.close();
  });

  it("rejects webhook calls with the wrong secret when configured", async () => {
    const app = await buildBotApp({
      env: {
        TELEGRAM_WEBHOOK_SECRET: "telegram-webhook-32-random",
      },
    });

    const unauthorized = await app.inject({
      method: "POST",
      url: "/telegram/webhook",
      payload: { message: { text: "/start" } },
    });
    const authorized = await app.inject({
      method: "POST",
      url: "/telegram/webhook",
      headers: {
        "x-telegram-bot-api-secret-token": "telegram-webhook-32-random",
      },
      payload: { message: { text: "/start" } },
    });

    expect(unauthorized.statusCode).toBe(401);
    expect(authorized.statusCode).toBe(200);

    await app.close();
  });
});
