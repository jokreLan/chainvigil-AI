import Fastify from "fastify";
import { parseTokenInput } from "@chainvigil/chain";
import { readEnv } from "@chainvigil/config";
import { buildTelegramCheckReply } from "@chainvigil/report";
import { buildMockTokenRiskReport } from "@chainvigil/risk-core";

interface TelegramWebhookBody {
  message?: {
    text?: string;
    chat?: {
      id?: number | string;
    };
  };
}

export function buildBotApp() {
  const app = Fastify({ logger: false });

  app.addHook("onRequest", async (_request, reply) => {
    reply
      .header("X-Content-Type-Options", "nosniff")
      .header("Referrer-Policy", "no-referrer")
      .header("X-Frame-Options", "DENY")
      .header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  });

  app.get("/health", async () => ({
    ok: true,
    service: "chainvigil-bot",
  }));

  app.post<{ Body: TelegramWebhookBody }>("/telegram/webhook", async (request) => {
    const text = request.body.message?.text ?? "";
    const normalizedText = text.trim().toLowerCase();

    if (normalizedText.startsWith("/start")) {
      return {
        ok: true,
        mode: "mock",
        reply: [
          "ChainVigil AI｜链哨 AI",
          "买币前，先查 CA。",
          "",
          "发送 /check 0x... 可 mock 查询 Token 风险报告。",
          "发送 /help 查看全部可用命令。",
        ].join("\n"),
      };
    }

    if (normalizedText.startsWith("/help")) {
      return {
        ok: true,
        mode: "mock",
        reply: [
          "ChainVigil AI｜链哨 AI",
          "",
          "可用命令：",
          "/check 0x... - 查 CA 风险",
          "/top - 查看高危 CA 榜单",
          "/settings - 查看群设置骨架",
          "",
          "买币前，先查 CA。",
        ].join("\n"),
      };
    }

    if (normalizedText.startsWith("/top")) {
      return {
        ok: true,
        mode: "mock",
        reply: [
          "高危 CA 榜单（mock）",
          "1. Base 0x1111...1110｜禁买｜卖出失败",
          "2. BSC 0x2222...2220｜禁买｜黑名单权限",
          "",
          "完整榜单：http://localhost:3000/leaderboard/high-risk-tokens",
        ].join("\n"),
      };
    }

    if (normalizedText.startsWith("/settings")) {
      return {
        ok: true,
        mode: "mock",
        reply: [
          "群设置 skeleton",
          "自动检测 CA：关闭",
          "高危提醒：开启",
          "每日检测上限：100",
          "语言：中文",
        ].join("\n"),
      };
    }

    const match = text.match(/\/check\s+(.+)/i);

    if (!match?.[1]) {
      return {
        ok: true,
        mode: "mock",
        reply: "请发送 /check 0x... 来 mock 调用链哨 AI 安检。",
      };
    }

    let input: string;

    try {
      input = parseTokenInput(match[1]).address;
    } catch {
      return {
        ok: true,
        mode: "mock",
        reply: "请输入有效的 EVM 合约地址。例如：/check 0x1111111111111111111111111111111111111110",
      };
    }

    const report = buildMockTokenRiskReport({
      input,
      appBaseUrl: readEnv("APP_BASE_URL", "http://localhost:3000"),
    });

    return {
      ok: true,
      mode: "mock",
      chatId: request.body.message?.chat?.id,
      reply: buildTelegramCheckReply(report),
    };
  });

  return app;
}
