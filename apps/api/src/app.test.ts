import { describe, expect, it } from "vitest";
import { buildApiApp } from "./app.js";

describe("api app", () => {
  it("returns health and adapter skeleton state", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.json()).toMatchObject({
      ok: true,
      service: "chainvigil-api",
      cache: {
        name: "memory",
        mode: "mock",
        ready: true,
      },
    });

    await app.close();
  });

  it("serves an OpenAPI document", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/openapi.json" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      openapi: "3.1.0",
      info: {
        title: "ChainVigil AI API",
      },
    });

    await app.close();
  });

  it("returns system readiness without secret values", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/system/readiness" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body).toMatchObject({
      service: "chainvigil-api",
      readiness: {
        current: {
          mode: "mock",
        },
        productionSecurity: {
          ok: false,
        },
      },
      cache: {
        name: "memory",
      },
    });
    expect(body.readiness.productionSecurity.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "ADMIN_SECRET",
        }),
      ]),
    );
    expect(JSON.stringify(body)).not.toContain("postgresql://");
    expect(JSON.stringify(body)).not.toContain("replace-me");

    await app.close();
  });

  it("returns data source adapter readiness", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/data-sources/adapters" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.adapters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "GoPlus", mode: "mock", ready: false }),
        expect.objectContaining({ name: "InternalRiskDB", mode: "mock", ready: true }),
      ]),
    );
    expect(JSON.stringify(body)).not.toContain("postgresql://");

    await app.close();
  });

  it("returns worker job contract", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/worker/jobs" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.worker).toMatchObject({
      service: "chainvigil-worker",
      ok: true,
    });
    expect(body.worker.jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "risk.refresh", enabled: false, mode: "mock" }),
        expect.objectContaining({ name: "points.settle", enabled: false, mode: "mock" }),
      ]),
    );
    expect(JSON.stringify(body)).not.toContain("postgresql://");

    await app.close();
  });

  it("returns mock risk database entries", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/risk/database" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.entries[0]).toMatchObject({
      id: "risk-honeypot",
      severity: "BLOCK",
    });
    expect(body.entries[0].plainLanguage).toContain("买得进但卖不出");

    await app.close();
  });

  it("returns mock risk monitor rules", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/risk/monitor-rules" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.rules[0]).toMatchObject({
      id: "monitor-high-risk-token",
      status: "needs_review",
    });
    expect(body.rules[0].explanation).toContain("不自动阻断交易");

    await app.close();
  });

  it("returns mock asset cleanup policies", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/asset-cleanup/policies" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.policies[0]).toMatchObject({
      flow: "approval_cleaner",
      decision: "manual_confirm",
    });
    expect(JSON.stringify(body)).not.toContain("privateKey");

    await app.close();
  });

  it("returns mock public high-risk token list", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/risk/high-risk-tokens" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.tokens[0]).toMatchObject({
      label: "禁买",
      riskLevel: "BLOCK",
    });
    expect(body.tokens[0].evidenceTags).toContain("solanaAuthorityRisk");

    await app.close();
  });

  it("returns mock fake token examples", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/risk/fake-token-examples" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.examples[0]).toMatchObject({
      id: "fake-usdt",
      impersonates: "USDT",
    });
    expect(body.examples[0].signals).toContain("symbolImpersonation");

    await app.close();
  });

  it("returns mock risk education lessons", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/risk/education-lessons" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.lessons[0]).toMatchObject({
      id: "lesson-honeypot-basics",
      difficulty: "beginner",
    });
    expect(body.lessons[0].recommendedAction).toContain("不要买入");

    await app.close();
  });

  it("returns non-secret service metadata", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/meta" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body).toMatchObject({
      service: "chainvigil-api",
      brand: "ChainVigil AI",
      chineseName: "链哨 AI",
      slogan: "买币前，先查 CA。",
      version: "v0",
      mode: "mock",
    });
    expect(body.supportedChains).toContain("solana");
    expect(body.supportedChains).toContain("bsc");
    expect(JSON.stringify(body)).not.toContain("postgresql://");

    await app.close();
  });

  it("returns mock admin audit logs with redacted metadata", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/admin/audit/logs" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.logs[0]).toMatchObject({
      action: "risk_report.reviewed",
      target: "token:base:0x1111111111111111111111111111111111111110",
    });
    expect(JSON.stringify(body)).toContain("[redacted]");
    expect(JSON.stringify(body)).not.toContain("mock-secret");

    await app.close();
  });

  it("returns mock admin risk review queue", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/admin/risk-review/queue" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.items[0]).toMatchObject({
      riskLevel: "BLOCK",
      status: "pending",
      tokenAddress: "0x1111111111111111111111111111111111111113",
    });
    expect(body.items[0].signals).toContain("honeypotDetected");

    await app.close();
  });

  it("returns mock admin risk labels", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/admin/risk-labels" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.labels[0]).toMatchObject({
      targetType: "token",
      riskLevel: "BLOCK",
      status: "active",
    });
    expect(body.labels[0].evidenceTags).toContain("honeypotDetected");

    await app.close();
  });

  it("returns mock admin token report index", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/admin/token-reports" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.reports[0]).toMatchObject({
      tokenSymbol: "BNB-MVP",
      riskLevel: "BLOCK",
      label: "禁买",
    });
    expect(body.reports[0].reportUrl).toContain("/token/bsc/0x1111111111111111111111111111111111111113");

    await app.close();
  });

  it("returns mock Telegram group settings", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/telegram/groups" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.groups[0]).toMatchObject({
      title: "SOL / BNB Alpha Group",
      autoDetectEnabled: false,
      highRiskAlerts: true,
      dailyCheckLimit: 100,
    });

    await app.close();
  });

  it("returns Telegram command list", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/telegram/commands" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          command: "/check <CA>",
        }),
      ]),
    );

    await app.close();
  });

  it("checks a mock CA and returns a pending VP event", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/token/check",
      headers: {
        "content-type": "application/json",
      },
      payload: {
        input: "0x1111111111111111111111111111111111111113",
        chain: "bsc",
        source: "web",
      },
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.report.label).toBe("禁买");
    expect(body.pointEvent).toMatchObject({
      type: "FIRST_CA_CHECK",
      status: "pending",
      points: 20,
    });

    await app.close();
  });

  it("checks a mock Solana CA", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/token/check",
      headers: {
        "content-type": "application/json",
      },
      payload: {
        input: "So11111111111111111111111111111111111111112",
        chain: "solana",
        source: "web",
      },
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.report.chain).toBe("solana");
    expect(body.report.tokenAddress).toBe("So11111111111111111111111111111111111111112");

    await app.close();
  });

  it("rate-limits write endpoints with a stable 429 shape", async () => {
    const app = await buildApiApp({
      rateLimit: {
        maxRequests: 1,
        windowSeconds: 60,
        now: () => 1_000,
      },
    });
    const payload = {
      input: "0x1111111111111111111111111111111111111110",
      chain: "base",
      source: "web",
    };

    const firstResponse = await app.inject({
      method: "POST",
      url: "/api/v1/token/check",
      payload,
    });
    const secondResponse = await app.inject({
      method: "POST",
      url: "/api/v1/token/check",
      payload,
    });

    expect(firstResponse.statusCode).toBe(200);
    expect(secondResponse.statusCode).toBe(429);
    expect(secondResponse.json()).toMatchObject({
      error: {
        code: "RATE_LIMITED",
        message: "请求过于频繁，请稍后再试。",
      },
    });

    await app.close();
  });

  it("returns raw adapter data bundle for token risk debugging", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/token/base/0x1111111111111111111111111111111111111110/data",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({
      chain: "base",
      address: "0x1111111111111111111111111111111111111110",
      missingLiveConfig: expect.arrayContaining(["GOPLUS_API_KEY", "HONEYPOT_API_KEY"]),
    });
    expect(response.json().data.snapshots.length).toBeGreaterThanOrEqual(5);

    await app.close();
  });

  it("rejects invalid token check input with a stable 400 shape", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/token/check",
      payload: {
        input: "not-a-ca",
        chain: "base",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: "BAD_REQUEST",
        field: "input",
      },
    });

    await app.close();
  });

  it("rejects invalid token report path params", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/token/solana/not-a-ca",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error.field).toBe("address");

    await app.close();
  });

  it("rejects unsupported chains before building a report", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/token/check",
      payload: {
        input: "0x1111111111111111111111111111111111111110",
        chain: "fantom",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error.field).toBe("chain");

    await app.close();
  });

  it("returns a mock wallet health report", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/wallet/health",
      headers: {
        "content-type": "application/json",
      },
      payload: {
        address: "0x1111111111111111111111111111111111111110",
        chain: "base",
        source: "web",
      },
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.report.summary.highRiskApprovals).toBeGreaterThan(0);
    expect(body.report.approvals.length).toBeGreaterThan(0);

    await app.close();
  });

  it("returns mock wallet watchlist", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/wallet/watchlist",
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.wallets[0]).toMatchObject({
      label: "主钱包",
      status: "checked",
      summaryLabel: "高风险",
    });
    expect(JSON.stringify(body)).not.toContain("privateKey");

    await app.close();
  });

  it("returns mock wallet check capabilities", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/wallet/check-capabilities",
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.capabilities[0]).toMatchObject({
      id: "wallet-check-high-risk-approvals",
      requiresSignature: false,
    });
    expect(JSON.stringify(body)).toContain("自动撤销授权");

    await app.close();
  });

  it("returns mock user preference settings", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/user/settings",
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.settings[0]).toMatchObject({
      id: "setting-language",
      editableInV0: false,
    });
    expect(JSON.stringify(body)).not.toContain("privateKey");

    await app.close();
  });

  it("rejects invalid wallet addresses", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/wallet/health",
      payload: {
        address: "not-a-wallet",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error.field).toBe("address");

    await app.close();
  });

  it("rejects invalid wallet report path params", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/wallet/not-a-wallet/health",
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: "BAD_REQUEST",
        field: "address",
      },
    });

    await app.close();
  });

  it("returns VP rules and accepts pending point events", async () => {
    const app = await buildApiApp();
    const rulesResponse = await app.inject({ method: "GET", url: "/api/v1/points/rules" });
    const ledgerResponse = await app.inject({
      method: "GET",
      url: "/api/v1/points/ledger?subjectId=visitor:test",
    });
    const eventResponse = await app.inject({
      method: "POST",
      url: "/api/v1/points/event",
      payload: {
        type: "REPORT_SHARED",
        subjectId: "base:0x1111111111111111111111111111111111111110",
        idempotencyKey: "test:report-shared",
      },
    });

    expect(rulesResponse.statusCode).toBe(200);
    expect(rulesResponse.json().shortName).toBe("VP");
    expect(ledgerResponse.statusCode).toBe(200);
    expect(ledgerResponse.json()).toMatchObject({
      mode: "mock",
      ledger: {
        subjectId: "visitor:test",
        totalConfirmed: 20,
        totalPending: 35,
      },
    });
    expect(eventResponse.statusCode).toBe(200);
    expect(eventResponse.json().event).toMatchObject({
      type: "REPORT_SHARED",
      status: "pending",
    });

    await app.close();
  });

  it("returns mock growth channels", async () => {
    const app = await buildApiApp();
    const response = await app.inject({ method: "GET", url: "/api/v1/growth/channels" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.mode).toBe("mock");
    expect(body.channels[0]).toMatchObject({
      name: "KOL-001",
      referralCode: "KOL001",
      status: "active",
    });

    await app.close();
  });

  it("rejects unknown VP event types", async () => {
    const app = await buildApiApp();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/points/event",
      payload: {
        type: "CLAIM_PLATFORM_TOKEN",
        idempotencyKey: "test:invalid",
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error.field).toBe("type");

    await app.close();
  });
});
