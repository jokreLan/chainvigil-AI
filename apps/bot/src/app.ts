import Fastify from "fastify";
import { parseTokenInput } from "@chainvigil/chain";
import { readEnv } from "@chainvigil/config";
import { buildTelegramCheckReply } from "@chainvigil/report";
import { buildMockTokenRiskReport } from "@chainvigil/risk-core";
import {
  buildTelegramHelpReply,
  buildTelegramSettingsReply,
  buildTelegramStartReply,
} from "@chainvigil/telegram";

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
        reply: buildTelegramStartReply(),
      };
    }

    if (normalizedText.startsWith("/help")) {
      return {
        ok: true,
        mode: "mock",
        reply: buildTelegramHelpReply(),
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
        reply: buildTelegramSettingsReply(request.body.message?.chat?.id),
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
