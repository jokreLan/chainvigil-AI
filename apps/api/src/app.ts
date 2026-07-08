import cors from "@fastify/cors";
import Fastify from "fastify";
import { listMockAdminAuditLogs } from "@chainvigil/audit";
import { parseTokenInput, supportedChains } from "@chainvigil/chain";
import { getCacheHealth } from "@chainvigil/cache";
import { getSystemReadiness, readEnv } from "@chainvigil/config";
import { collectTokenRiskData, getAdapterHealth } from "@chainvigil/data-adapters";
import {
  createPendingPointEvent,
  getMockPointLedgerSummary,
  getPointProgram,
  listPointRules,
} from "@chainvigil/points";
import {
  buildMockTokenRiskReport,
  buildMockWalletHealthReport,
  listMockRiskLabels,
  listMockRiskReviewQueue,
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

function requiredString(body: Record<string, unknown>, field: string): string {
  const value = body[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiInputError(`缺少 ${field}。`, field);
  }

  return value.trim();
}

function optionalString(body: Record<string, unknown>, field: string): string | undefined {
  const value = body[field];

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ApiInputError(`${field} 必须是字符串。`, field);
  }

  return value.trim();
}

function requireBody(body: unknown): Record<string, unknown> {
  if (!isRecord(body)) {
    throw new ApiInputError("请求体必须是 JSON object。", "body");
  }

  return body;
}

function parseTokenCheckBody(body: unknown): TokenCheckRequest {
  const record = requireBody(body);
  const input = requiredString(record, "input");
  const chain = optionalChain(record.chain);

  try {
    parseTokenInput(input, chain ?? "base");
  } catch {
    throw new ApiInputError("请输入有效的 EVM 合约地址。", "input");
  }

  const parsed: TokenCheckRequest = {
    input,
  };

  if (chain) {
    parsed.chain = chain;
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
    throw new ApiInputError("请输入有效的 EVM 合约地址。", "address");
  }

  return {
    chain,
    input: params.address,
  };
}

function parseWalletHealthBody(body: unknown): WalletHealthRequest {
  const record = requireBody(body);
  const address = requiredString(record, "address");
  const chain = optionalChain(record.chain);

  try {
    parseTokenInput(address, chain ?? "base");
  } catch {
    throw new ApiInputError("请输入有效的 EVM 钱包地址。", "address");
  }

  const parsed: WalletHealthRequest = {
    address,
  };

  if (chain) {
    parsed.chain = chain;
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
  const type = requiredString(record, "type") as PointEventType;

  if (!(type in listPointRules())) {
    throw new ApiInputError("未知 VP 事件类型。", "type");
  }

  const parsed = {
    type,
    idempotencyKey: requiredString(record, "idempotencyKey"),
  };
  const subjectId = optionalString(record, "subjectId");
  const actorId = optionalString(record, "actorId");

  return {
    ...parsed,
    ...(subjectId ? { subjectId } : {}),
    ...(actorId ? { actorId } : {}),
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
}

export async function buildApiApp(options: BuildApiAppOptions = {}) {
  const app = Fastify({ logger: false });
  const checkRateLimit = createRateLimiter(options.rateLimit);

  app.addHook("onRequest", async (_request, reply) => {
    reply
      .header("X-Content-Type-Options", "nosniff")
      .header("Referrer-Policy", "no-referrer")
      .header("X-Frame-Options", "DENY")
      .header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  });

  await app.register(cors, {
    origin: true,
  });

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
    adapters: getAdapterHealth(),
    cache: getCacheHealth(),
  }));

  app.get("/api/v1/system/readiness", async () => ({
    service: "chainvigil-api",
    readiness: getSystemReadiness(),
    adapters: getAdapterHealth(),
    cache: getCacheHealth(),
  }));

  app.get("/api/v1/meta", async () => buildServiceMeta());

  app.get("/api/v1/admin/audit/logs", async () => ({
    logs: listMockAdminAuditLogs(),
    mode: "mock",
  }));

  app.get("/api/v1/admin/risk-review/queue", async () => ({
    items: listMockRiskReviewQueue(readEnv("APP_BASE_URL", "http://localhost:3000")),
    mode: "mock",
  }));

  app.get("/api/v1/admin/risk-labels", async () => ({
    labels: listMockRiskLabels(),
    mode: "mock",
  }));

  app.get("/api/v1/telegram/groups", async () => ({
    groups: listMockTelegramGroups(),
    mode: "mock",
  }));

  app.get("/api/v1/telegram/commands", async () => ({
    commands: listTelegramCommands(),
    mode: "mock",
  }));

  app.get("/openapi.json", async () => openApiDocument);

  app.post<{ Body: TokenCheckRequest }>("/api/v1/token/check", async (request) => {
    await checkRateLimit(`token-check:${request.ip}`);
    const body = parseTokenCheckBody(request.body);
    const appBaseUrl = readEnv("APP_BASE_URL", "http://localhost:3000");
    const report = buildMockTokenRiskReport({
      input: body.input,
      chain: body.chain,
      appBaseUrl,
    });
    const pointEvent = createPendingPointEvent({
      type: "FIRST_CA_CHECK",
      subjectId: `${report.chain}:${report.tokenAddress}`,
      idempotencyKey: `mock:first-ca-check:${report.chain}:${report.tokenAddress}`,
    });

    return {
      report,
      pointEvent,
    };
  });

  app.get<{ Params: { chain: string; address: string } }>(
    "/api/v1/token/:chain/:address",
    async (request) => {
      const params = parseTokenPathParams(request.params);
      const appBaseUrl = readEnv("APP_BASE_URL", "http://localhost:3000");
      const report = buildMockTokenRiskReport({
        input: params.input,
        chain: params.chain,
        appBaseUrl,
      });

      return { report };
    },
  );

  app.get<{ Params: { chain: string; address: string } }>(
    "/api/v1/token/:chain/:address/data",
    async (request) => {
      const params = parseTokenPathParams(request.params);
      const data = await collectTokenRiskData({
        chain: params.chain,
        address: params.input,
      });

      return { data };
    },
  );

  app.post<{ Body: WalletHealthRequest }>("/api/v1/wallet/health", async (request) => {
    await checkRateLimit(`wallet-health:${request.ip}`);
    const body = parseWalletHealthBody(request.body);
    const appBaseUrl = readEnv("APP_BASE_URL", "http://localhost:3000");
    const report = buildMockWalletHealthReport({
      address: body.address,
      chain: body.chain,
      appBaseUrl,
    });

    return { report };
  });

  app.get<{ Params: { address: string } }>("/api/v1/wallet/:address/health", async (request) => {
    try {
      parseTokenInput(request.params.address, "base");
    } catch {
      throw new ApiInputError("请输入有效的 EVM 钱包地址。", "address");
    }

    const appBaseUrl = readEnv("APP_BASE_URL", "http://localhost:3000");
    const report = buildMockWalletHealthReport({
      address: request.params.address,
      appBaseUrl,
    });

    return { report };
  });

  app.get("/api/v1/points/rules", async () => getPointProgram());

  app.get<{ Querystring: { subjectId?: string } }>("/api/v1/points/ledger", async (request) => ({
    ledger: getMockPointLedgerSummary(request.query.subjectId?.trim() || "visitor:mock"),
    mode: "mock",
  }));

  app.post<{
    Body: {
      type: Parameters<typeof createPendingPointEvent>[0]["type"];
      subjectId?: string;
      actorId?: string;
      idempotencyKey: string;
    };
  }>("/api/v1/points/event", async (request) => {
    await checkRateLimit(`points-event:${request.ip}`);
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

    return { event };
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

    return {
      event: {
        id: crypto.randomUUID(),
        referralCode: request.body.referralCode,
        source: request.body.source,
        action: request.body.action,
        subjectId: request.body.subjectId ?? null,
        status: "recorded",
        createdAt: new Date().toISOString(),
      },
    };
  });

  return app;
}
