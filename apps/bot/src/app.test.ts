import { describe, expect, it } from "vitest";
import { buildBotApp } from "./app.js";

describe("bot app", () => {
  it("returns security headers", async () => {
    const app = buildBotApp();
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");

    await app.close();
  });

  it("returns a helpful reply without a /check command", async () => {
    const app = buildBotApp();
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
    expect(response.json().reply).toContain("/check 0x");

    await app.close();
  });

  it("handles /start with brand and check guidance", async () => {
    const app = buildBotApp();
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
    expect(response.json().reply).toContain("ChainVigil AI｜链哨 AI");
    expect(response.json().reply).toContain("买币前，先查 CA。");
    expect(response.json().reply).toContain("/check 0x");

    await app.close();
  });

  it("handles /check and returns a report link", async () => {
    const app = buildBotApp();
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
    expect(body.reply).toContain("ChainVigil AI｜链哨 AI 检测结果：高危");
    expect(body.reply).toContain("/token/bsc/0x1111111111111111111111111111111111111110");

    await app.close();
  });

  it("returns a helpful reply for invalid /check input", async () => {
    const app = buildBotApp();
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
    expect(response.json().reply).toContain("请输入有效的 EVM 合约地址");

    await app.close();
  });

  it("handles /top and /settings skeleton commands", async () => {
    const app = buildBotApp();
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
    expect(settingsResponse.json().reply).toContain("群设置 skeleton");
    expect(settingsResponse.json().reply).toContain("Meme Watch CN");

    await app.close();
  });
});
