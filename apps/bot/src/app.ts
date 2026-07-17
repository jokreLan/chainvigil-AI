import Fastify from "fastify";
import {
  createCacheStore,
  createRateLimiter,
  RateLimitError,
  type RateLimitOptions,
} from "@chainvigil/cache";
import { parseTokenInput } from "@chainvigil/chain";
import {
  constantTimeEqual,
  defaultApiContentSecurityPolicy,
  getSecurityHeaders,
  readEnv,
  resolveRuntimeMode,
  resolveTrustProxy,
} from "@chainvigil/config";
import { buildTelegramCheckReply } from "@chainvigil/report";
import {
  buildTelegramCheckUsageReply,
  buildTelegramHelpReply,
  buildTelegramSettingsReply,
  buildTelegramStartReply,
  buildTelegramTopReply,
  getMockTelegramGroup,
} from "@chainvigil/telegram";
import { resolveTokenRiskReport } from "./resolve-report.js";

interface TelegramWebhookBody {
  message?: {
    text?: string;
    chat?: {
      id?: number | string;
    };
  };
}

class BotAuthError extends Error {
  statusCode = 401;

  constructor(message = "Invalid Telegram webhook secret.") {
    super(message);
  }
}

export interface BuildBotAppOptions {
  env?: Record<string, string | undefined>;
  rateLimit?: RateLimitOptions;
}

export async function buildBotApp(options: BuildBotAppOptions = {}) {
  const env = options.env ?? process.env;
  const trustProxy = resolveTrustProxy(env);
  const app = Fastify({
    logger: false,
    trustProxy,
    bodyLimit: 64 * 1024,
    requestTimeout: 30_000,
  });
  const cache = options.rateLimit?.cache ?? (await createCacheStore(env)).store;
  const checkRateLimit = createRateLimiter({
    maxRequests: 30,
    windowSeconds: 60,
    ...options.rateLimit,
    cache,
  });
  const securityHeaders = getSecurityHeaders({
    enableHsts: resolveRuntimeMode(env) === "production",
    contentSecurityPolicy: defaultApiContentSecurityPolicy,
  });

  app.addHook("onRequest", async (_request, reply) => {
    for (const [key, value] of Object.entries(securityHeaders)) {
      reply.header(key, value);
    }
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof BotAuthError) {
      return reply.status(error.statusCode).send({
        ok: false,
        error: {
          code: "UNAUTHORIZED",
          message: error.message,
        },
      });
    }

    if (error instanceof RateLimitError) {
      return reply.status(error.statusCode).send({
        ok: false,
        error: {
          code: "RATE_LIMITED",
          message: error.message,
          retryAfter: error.resetAt,
        },
      });
    }

    throw error;
  });

  function requireWebhookSecret(request: {
    headers: Record<string, string | string[] | undefined>;
  }) {
    const expected = env.TELEGRAM_WEBHOOK_SECRET?.trim();

    // Production always requires secret (assertProductionRuntime). Mock without secret keeps local DX.
    if (!expected) {
      if (resolveRuntimeMode(env) === "production") {
        throw new BotAuthError("Telegram webhook secret is required in production.");
      }

      return;
    }

    const providedHeader = request.headers["x-telegram-bot-api-secret-token"];
    const provided = Array.isArray(providedHeader) ? providedHeader[0] : providedHeader;

    if (!provided || !constantTimeEqual(provided, expected)) {
      throw new BotAuthError();
    }
  }

  app.get("/health", async () => ({
    ok: true,
    service: "chainvigil-bot",
  }));

  app.post<{ Body: TelegramWebhookBody }>("/telegram/webhook", async (request) => {
    requireWebhookSecret(request);
    await checkRateLimit(`telegram-webhook:${request.ip}`);

    const text = request.body?.message?.text ?? "";
    const normalizedText = text.trim().toLowerCase();
    const chatId = request.body?.message?.chat?.id;
    const locale = getMockTelegramGroup(chatId).language === "en" ? "en" : "zh";

    if (normalizedText.startsWith("/start")) {
      return {
        ok: true,
        mode: "mock",
        reply: buildTelegramStartReply(locale),
      };
    }

    if (normalizedText.startsWith("/help")) {
      return {
        ok: true,
        mode: "mock",
        reply: buildTelegramHelpReply(locale),
      };
    }

    if (normalizedText.startsWith("/top")) {
      return {
        ok: true,
        mode: "mock",
        reply: buildTelegramTopReply(locale),
      };
    }

    if (normalizedText.startsWith("/settings")) {
      return {
        ok: true,
        mode: "mock",
        reply: buildTelegramSettingsReply(chatId, locale),
      };
    }

    const match = text.match(/\/check\s+(.+)/i);

    if (!match?.[1]) {
      return {
        ok: true,
        mode: "mock",
        reply: buildTelegramCheckUsageReply(locale),
      };
    }

    let input: string;

    try {
      input = parseTokenInput(match[1]).address;
    } catch {
      return {
        ok: true,
        mode: "mock",
        reply:
          locale === "en"
            ? "Enter a valid SOL or BNB token CA. Example: /check So11111111111111111111111111111111111111112"
            : "请输入有效的 SOL 或 BNB Token 合约地址。例如：/check So11111111111111111111111111111111111111112",
      };
    }

    const appBaseUrl = readEnv("APP_BASE_URL", "http://localhost:3000");
    const apiBaseUrl = env.API_BASE_URL?.trim() || undefined;
    const { report, source } = await resolveTokenRiskReport({
      input,
      appBaseUrl,
      ...(apiBaseUrl ? { apiBaseUrl } : {}),
    });

    return {
      ok: true,
      mode: report.mode,
      confidence: report.confidence,
      source,
      chatId: request.body?.message?.chat?.id,
      reply: buildTelegramCheckReply(report, locale),
    };
  });

  return app;
}
