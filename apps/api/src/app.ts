import cors from "@fastify/cors";
import Fastify from "fastify";
import { listMockAdminAuditLogs } from "@chainvigil/audit";
import { createCacheStore } from "@chainvigil/cache";
import { parseTokenInput, supportedChains } from "@chainvigil/chain";
import { getCacheHealth } from "@chainvigil/cache";
import {
  allowsUnauthenticatedServiceWrites,
  defaultApiContentSecurityPolicy,
  getAllowedCorsOrigins,
  getSecurityHeaders,
  getSystemReadiness,
  readEnv,
  resolveRuntimeMode,
  resolveTrustProxy,
  verifyBasicAuth,
  verifyWriteSecret,
} from "@chainvigil/config";
import {
  collectTokenRiskData,
  getAdapterHealth,
  getRiskEvidenceProviderStatus,
} from "@chainvigil/data-adapters";
import { getWorkerHealth } from "@chainvigil/worker";
import {
  createPendingPointEvent,
  getMockPointLedgerSummary,
  getPointProgram,
  listMockGrowthChannels,
  listPointRules,
} from "@chainvigil/points";
import {
  buildMockTokenRiskReport,
  buildMockWalletHealthReport,
  type ContentLocale,
  listMockAssetCleanupPolicies,
  listMockFakeTokenExamples,
  listMockHighRiskTokens,
  listMockRiskDatabaseEntries,
  listMockRiskEducationLessons,
  listMockRiskLabels,
  listMockRiskMonitorRules,
  listMockRiskReviewQueue,
  listMockTokenReportIndex,
  listMockUserPreferenceSettings,
  listMockWalletCheckCapabilities,
  listMockWalletWatchlist,
} from "@chainvigil/risk-core";
import { listMockTelegramGroups, listTelegramCommands } from "@chainvigil/telegram";
import type {
  ChainId,
  PointEventType,
  ServiceMeta,
  TokenCheckRequest,
  WalletHealthRequest,
} from "@chainvigil/types";
import { openApiDocument } from "./openapi.js";
import { ApiRateLimitError, createRateLimiter, type RateLimitOptions } from "./rate-limit.js";

class ApiInputError extends Error {
  statusCode = 400;

  constructor(
    message: string,
    readonly field: string,
  ) {
    super(message);
  }
}

class ApiAuthError extends Error {
  statusCode = 401;

  constructor(message = "需要管理员认证。") {
    super(message);
  }
}

class ApiForbiddenError extends Error {
  statusCode = 403;

  constructor(message = "缺少有效的服务写密钥。") {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSupportedChain(value: unknown): value is ChainId {
  return typeof value === "string" && value in supportedChains;
}

function optionalChain(value: unknown): ChainId | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (!isSupportedChain(value)) {
    throw new ApiInputError("暂不支持该链。", "chain");
  }

  return value;
}

function requiredString(body: Record<string, unknown>, field: string, maxLength = 256): string {
  const value = body[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiInputError(`缺少 ${field}。`, field);
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    throw new ApiInputError(`${field} 过长。`, field);
  }

  return trimmed;
}

function optionalString(
  body: Record<string, unknown>,
  field: string,
  maxLength = 256,
): string | undefined {
  const value = body[field];

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiInputError(`${field} 必须是字符串。`, field);
  }

  const trimmed = value.trim();

  if (trimmed.length > maxLength) {
    throw new ApiInputError(`${field} 过长。`, field);
  }

  return trimmed;
}

function requireBody(body: unknown): Record<string, unknown> {
  if (!isRecord(body)) {
    throw new ApiInputError("请求体必须是 JSON object。", "body");
  }

  return body;
}

function resolveRequestLocale(
  request: { headers: Record<string, string | string[] | undefined> },
  bodyLocale?: unknown,
): ContentLocale {
  if (bodyLocale === "en" || bodyLocale === "zh") {
    return bodyLocale;
  }
  const raw = request.headers["accept-language"];
  const header = Array.isArray(raw) ? raw[0] : raw;
  if (typeof header === "string" && header.toLowerCase().startsWith("en")) {
    return "en";
  }
  return "zh";
}

function parseTokenCheckBody(body: unknown): TokenCheckRequest {
  const record = requireBody(body);
  const input = requiredString(record, "input", 512);
  const chain = optionalChain(record.chain);

  try {
    parseTokenInput(input, chain ?? "bsc");
  } catch {
    throw new ApiInputError("请输入有效的 SOL 或 BNB Token 合约地址。", "input");
  }

  const parsed: TokenCheckRequest = {
    input,
  };

  if (chain) {
    parsed.chain = chain;
  }

  if (record.locale === "en" || record.locale === "zh") {
    parsed.locale = record.locale;
  }

  return parsed;
}

function parseTokenPathParams(
  params: { chain: string; address: string },
): Required<Pick<TokenCheckRequest, "chain" | "input">> {
  const chain = optionalChain(params.chain);

  if (!chain) {
    throw new ApiInputError("缺少 chain。", "chain");
  }

  try {
    parseTokenInput(params.address, chain);
  } catch {
    throw new ApiInputError("请输入有效的 SOL 或 BNB Token 合约地址。", "address");
  }

  return {
    chain,
    input: params.address,
  };
}

function parseWalletHealthBody(body: unknown): WalletHealthRequest {
  const record = requireBody(body);
  const address = requiredString(record, "address", 128);
  const chain = optionalChain(record.chain);

  try {
    parseTokenInput(address, chain ?? "bsc");
  } catch {
    throw new ApiInputError("请输入有效的钱包地址。", "address");
  }

  const parsed: WalletHealthRequest = {
    address,
  };

  if (chain) {
    parsed.chain = chain;
  }

  if (record.locale === "en" || record.locale === "zh") {
    parsed.locale = record.locale;
  }

  return parsed;
}

function parsePointEventBody(body: unknown): {
  type: PointEventType;
  subjectId?: string;
  actorId?: string;
  idempotencyKey: string;
} {
  const record = requireBody(body);
  const type = requiredString(record, "type", 64) as PointEventType;

  if (!(type in listPointRules())) {
    throw new ApiInputError("未知 VP 事件类型。", "type");
  }

  const parsed = {
    type,
    idempotencyKey: requiredString(record, "idempotencyKey", 200),
  };
  const subjectId = optionalString(record, "subjectId", 200);
  const actorId = optionalString(record, "actorId", 200);

  return {
    ...parsed,
    ...(subjectId ? { subjectId } : {}),
    ...(actorId ? { actorId } : {}),
  };
}

function parseReferralEventBody(body: unknown): {
  referralCode: string;
  source: string;
  action: string;
  subjectId?: string;
} {
  const record = requireBody(body);
  const referralCode = requiredString(record, "referralCode", 64);
  const source = requiredString(record, "source", 64);
  const action = requiredString(record, "action", 64);
  const subjectId = optionalString(record, "subjectId", 200);

  if (!/^[a-zA-Z0-9_.:-]{1,64}$/.test(referralCode)) {
    throw new ApiInputError("referralCode 格式无效。", "referralCode");
  }

  if (!/^[a-zA-Z0-9_.:-]{1,64}$/.test(source)) {
    throw new ApiInputError("source 格式无效。", "source");
  }

  if (!/^[a-zA-Z0-9_.:-]{1,64}$/.test(action)) {
    throw new ApiInputError("action 格式无效。", "action");
  }

  return {
    referralCode,
    source,
    action,
    ...(subjectId ? { subjectId } : {}),
  };
}

function buildServiceMeta(): ServiceMeta {
  const mode = readEnv("CHAINVIGIL_RUNTIME_MODE", "mock") === "production" ? "production" : "mock";
  const meta: ServiceMeta = {
    service: "chainvigil-api",
    brand: "ChainVigil AI",
    chineseName: "链哨 AI",
    slogan: "买币前，先查 CA。",
    version: "v0",
    mode,
    supportedChains: Object.keys(supportedChains) as ChainId[],
    generatedAt: new Date().toISOString(),
  };
  const commitSha = process.env.CHAINVIGIL_COMMIT_SHA?.trim();

  if (commitSha) {
    meta.commitSha = commitSha;
  }

  return meta;
}

export interface BuildApiAppOptions {
  rateLimit?: RateLimitOptions;
  env?: Record<string, string | undefined>;
}

export async function buildApiApp(options: BuildApiAppOptions = {}) {
  const env = options.env ?? process.env;
  const trustProxy = resolveTrustProxy(env);
  const app = Fastify({
    logger: false,
    trustProxy,
    bodyLimit: 32 * 1024,
    requestTimeout: 30_000,
  });
  const cache =
    options.rateLimit?.cache ??
    (await createCacheStore(env)).store;
  const checkRateLimit = createRateLimiter({
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

  const corsOrigins = getAllowedCorsOrigins(env);

  await app.register(cors, {
    origin: corsOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "content-type",
      "authorization",
      "x-chainvigil-write-secret",
      "x-request-id",
    ],
    maxAge: 600,
  });

  function headerValue(
    value: string | string[] | undefined,
  ): string | undefined {
    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  }

  function requireAdmin(request: {
    headers: Record<string, string | string[] | undefined>;
  }) {
    const result = verifyBasicAuth(headerValue(request.headers.authorization), {
      username: env.ADMIN_BASIC_AUTH_USERNAME,
      password: env.ADMIN_BASIC_AUTH_PASSWORD,
    });

    if (!result.ok) {
      throw new ApiAuthError();
    }
  }

  function requireServiceWrite(request: {
    headers: Record<string, string | string[] | undefined>;
  }) {
    if (allowsUnauthenticatedServiceWrites(env)) {
      return;
    }

    const writeSecret = env.INTERNAL_WRITE_SECRET;
    const authorization = headerValue(request.headers.authorization);
    const provided =
      headerValue(request.headers["x-chainvigil-write-secret"]) ??
      (authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length)
        : undefined);

    if (verifyWriteSecret(provided, writeSecret)) {
      return;
    }

    const admin = verifyBasicAuth(authorization, {
      username: env.ADMIN_BASIC_AUTH_USERNAME,
      password: env.ADMIN_BASIC_AUTH_PASSWORD,
    });

    if (admin.enabled && admin.ok) {
      return;
    }

    throw new ApiForbiddenError("缺少有效的服务写密钥或管理员认证。");
  }

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ApiInputError) {
      return reply.status(error.statusCode).send({
        error: {
          code: "BAD_REQUEST",
          message: error.message,
          field: error.field,
        },
      });
    }

    if (error instanceof ApiAuthError) {
      return reply
        .status(error.statusCode)
        .header("www-authenticate", 'Basic realm="ChainVigil Admin API", charset="UTF-8"')
        .send({
          error: {
            code: "UNAUTHORIZED",
            message: error.message,
          },
        });
    }

    if (error instanceof ApiForbiddenError) {
      return reply.status(error.statusCode).send({
        error: {
          code: "FORBIDDEN",
          message: error.message,
        },
      });
    }

    if (error instanceof ApiRateLimitError) {
      return reply.status(error.statusCode).send({
        error: {
          code: "RATE_LIMITED",
          message: error.message,
          retryAfter: error.resetAt,
        },
      });
    }

    throw error;
  });

  app.get("/health", async () => ({
    ok: true,
    service: "chainvigil-api",
    adapters: getAdapterHealth(env),
    cache: getCacheHealth(env),
  }));

  app.get("/api/v1/system/readiness", async () => ({
    service: "chainvigil-api",
    readiness: getSystemReadiness(env),
    adapters: getAdapterHealth(env),
    cache: getCacheHealth(env),
  }));

  app.get("/api/v1/data-sources/adapters", async (request) => {
    await checkRateLimit(`read:adapters:${request.ip}`);
    return {
      adapters: getAdapterHealth(env),
      mode: "mock",
    };
  });

  app.get("/api/v1/risk/evidence-providers", async (request) => {
    await checkRateLimit(`read:evidence:${request.ip}`);
    return {
      primaryChains: ["solana", "bsc"],
      providers: getRiskEvidenceProviderStatus(env),
      mode: "mock",
    };
  });

  app.get("/api/v1/worker/jobs", async (request) => {
    await checkRateLimit(`read:worker:${request.ip}`);
    return {
      worker: getWorkerHealth(),
      mode: "mock",
    };
  });

  app.get("/api/v1/risk/database", async (request) => {
    await checkRateLimit(`read:risk-db:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      entries: listMockRiskDatabaseEntries(locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/risk/monitor-rules", async (request) => {
    await checkRateLimit(`read:monitor:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      rules: listMockRiskMonitorRules(locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/asset-cleanup/policies", async (request) => {
    await checkRateLimit(`read:cleanup:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      policies: listMockAssetCleanupPolicies(locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/risk/high-risk-tokens", async (request) => {
    await checkRateLimit(`read:high-risk:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      tokens: listMockHighRiskTokens(readEnv("APP_BASE_URL", "http://localhost:3000"), locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/risk/fake-token-examples", async (request) => {
    await checkRateLimit(`read:fake-tokens:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      examples: listMockFakeTokenExamples(locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/risk/education-lessons", async (request) => {
    await checkRateLimit(`read:lessons:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      lessons: listMockRiskEducationLessons(locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/meta", async () => buildServiceMeta());

  app.get("/api/v1/admin/audit/logs", async (request) => {
    requireAdmin(request);
    await checkRateLimit(`admin:audit:${request.ip}`);
    return {
      logs: listMockAdminAuditLogs(),
      mode: "mock",
    };
  });

  app.get("/api/v1/admin/risk-review/queue", async (request) => {
    requireAdmin(request);
    await checkRateLimit(`admin:review:${request.ip}`);
    return {
      items: listMockRiskReviewQueue(readEnv("APP_BASE_URL", "http://localhost:3000")),
      mode: "mock",
    };
  });

  app.get("/api/v1/admin/risk-labels", async (request) => {
    requireAdmin(request);
    await checkRateLimit(`admin:labels:${request.ip}`);
    return {
      labels: listMockRiskLabels(),
      mode: "mock",
    };
  });

  app.get("/api/v1/admin/token-reports", async (request) => {
    requireAdmin(request);
    await checkRateLimit(`admin:reports:${request.ip}`);
    return {
      reports: listMockTokenReportIndex(readEnv("APP_BASE_URL", "http://localhost:3000")),
      mode: "mock",
    };
  });

  app.get("/api/v1/telegram/groups", async (request) => {
    await checkRateLimit(`read:tg-groups:${request.ip}`);
    return {
      groups: listMockTelegramGroups(),
      mode: "mock",
    };
  });

  app.get("/api/v1/telegram/commands", async (request) => {
    await checkRateLimit(`read:tg-commands:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      commands: listTelegramCommands(locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/openapi.json", async () => openApiDocument);

  app.post<{ Body: TokenCheckRequest }>("/api/v1/token/check", async (request) => {
    await checkRateLimit(`token-check:${request.ip}`);
    const body = parseTokenCheckBody(request.body);
    const locale = resolveRequestLocale(request, body.locale);
    const appBaseUrl = readEnv("APP_BASE_URL", "http://localhost:3000");
    const report = buildMockTokenRiskReport({
      input: body.input,
      chain: body.chain,
      appBaseUrl,
      locale,
    });
    const pointEvent = createPendingPointEvent({
      type: "FIRST_CA_CHECK",
      subjectId: `${report.chain}:${report.tokenAddress}`,
      idempotencyKey: `mock:first-ca-check:${report.chain}:${report.tokenAddress}`,
    });

    return {
      report,
      pointEvent,
      mode: report.mode,
      confidence: report.confidence,
      locale,
    };
  });

  app.get<{ Params: { chain: string; address: string } }>(
    "/api/v1/token/:chain/:address",
    async (request) => {
      await checkRateLimit(`token-get:${request.ip}`);
      const params = parseTokenPathParams(request.params);
      const locale = resolveRequestLocale(request);
      const appBaseUrl = readEnv("APP_BASE_URL", "http://localhost:3000");
      const report = buildMockTokenRiskReport({
        input: params.input,
        chain: params.chain,
        appBaseUrl,
        locale,
      });

      return { report, mode: report.mode, confidence: report.confidence, locale };
    },
  );

  app.get<{ Params: { chain: string; address: string } }>(
    "/api/v1/token/:chain/:address/data",
    async (request) => {
      await checkRateLimit(`token-data:${request.ip}`);
      const params = parseTokenPathParams(request.params);
      const data = await collectTokenRiskData(
        {
          chain: params.chain,
          address: params.input,
        },
        env,
      );

      return { data, mode: "mock", confidence: data.coverage.confidence };
    },
  );

  app.post<{ Body: WalletHealthRequest }>("/api/v1/wallet/health", async (request) => {
    await checkRateLimit(`wallet-health:${request.ip}`);
    const body = parseWalletHealthBody(request.body);
    const locale = resolveRequestLocale(request, body.locale);
    const appBaseUrl = readEnv("APP_BASE_URL", "http://localhost:3000");
    const report = buildMockWalletHealthReport({
      address: body.address,
      chain: body.chain,
      appBaseUrl,
      locale,
    });

    return { report, mode: report.mode, confidence: report.confidence, locale };
  });

  app.get<{ Params: { address: string } }>("/api/v1/wallet/:address/health", async (request) => {
    await checkRateLimit(`wallet-get:${request.ip}`);

    try {
      parseTokenInput(request.params.address, "bsc");
    } catch {
      throw new ApiInputError("请输入有效的 EVM 钱包地址。", "address");
    }

    const locale = resolveRequestLocale(request);
    const appBaseUrl = readEnv("APP_BASE_URL", "http://localhost:3000");
    const report = buildMockWalletHealthReport({
      address: request.params.address,
      appBaseUrl,
      locale,
    });

    return { report, mode: report.mode, confidence: report.confidence, locale };
  });

  app.get("/api/v1/wallet/watchlist", async (request) => {
    await checkRateLimit(`read:watchlist:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      wallets: listMockWalletWatchlist(readEnv("APP_BASE_URL", "http://localhost:3000"), locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/wallet/check-capabilities", async (request) => {
    await checkRateLimit(`read:capabilities:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      capabilities: listMockWalletCheckCapabilities(locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/user/settings", async (request) => {
    await checkRateLimit(`read:settings:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      settings: listMockUserPreferenceSettings(locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/points/rules", async (request) => {
    await checkRateLimit(`read:points-rules:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return { ...getPointProgram(locale), locale };
  });

  app.get<{ Querystring: { subjectId?: string } }>("/api/v1/points/ledger", async (request) => {
    await checkRateLimit(`read:points-ledger:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      ledger: getMockPointLedgerSummary(request.query.subjectId?.trim() || "visitor:mock", locale),
      mode: "mock",
      locale,
    };
  });

  app.get("/api/v1/growth/channels", async (request) => {
    await checkRateLimit(`read:growth:${request.ip}`);
    const locale = resolveRequestLocale(request);
    return {
      channels: listMockGrowthChannels(locale),
      mode: "mock",
      locale,
    };
  });

  app.post<{
    Body: {
      type: Parameters<typeof createPendingPointEvent>[0]["type"];
      subjectId?: string;
      actorId?: string;
      idempotencyKey: string;
    };
  }>("/api/v1/points/event", async (request) => {
    await checkRateLimit(`points-event:${request.ip}`);
    requireServiceWrite(request);
    const body = parsePointEventBody(request.body);
    const pointEventInput: Parameters<typeof createPendingPointEvent>[0] = {
      type: body.type,
      idempotencyKey: body.idempotencyKey,
    };

    if (body.subjectId) {
      pointEventInput.subjectId = body.subjectId;
    }

    if (body.actorId) {
      pointEventInput.actorId = body.actorId;
    }

    const event = createPendingPointEvent(pointEventInput);

    return { event, mode: "mock" };
  });

  app.post<{
    Body: {
      referralCode: string;
      source: string;
      action: string;
      subjectId?: string;
    };
  }>("/api/v1/referral/event", async (request) => {
    await checkRateLimit(`referral-event:${request.ip}`);
    requireServiceWrite(request);
    const body = parseReferralEventBody(request.body);

    return {
      event: {
        id: crypto.randomUUID(),
        referralCode: body.referralCode,
        source: body.source,
        action: body.action,
        subjectId: body.subjectId ?? null,
        status: "recorded",
        createdAt: new Date().toISOString(),
      },
      mode: "mock",
    };
  });

  return app;
}
