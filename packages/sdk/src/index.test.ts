import { describe, expect, it } from "vitest";
import { ChainVigilApiError, ChainVigilClient } from "./index";

function mockFetch(responseBody: unknown): typeof fetch {
  return (async () =>
    new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    })) as typeof fetch;
}

function recordingFetch(responseBody: unknown, calls: string[]): typeof fetch {
  return (async (input: RequestInfo | URL) => {
    calls.push(String(input));

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }) as typeof fetch;
}

describe("ChainVigilClient", () => {
  it("checks tokens through the SDK client", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        report: {
          label: "禁买",
        },
      }),
    });

    const response = await client.checkToken({
      input: "0x1111111111111111111111111111111111111110",
    });

    expect(response.report.label).toBe("禁买");
  });

  it("reads raw token risk data bundles", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        data: {
          chain: "base",
          address: "0x1111111111111111111111111111111111111110",
          snapshots: [{ source: "goplus" }],
          missingLiveConfig: ["HONEYPOT_API_KEY"],
        },
      }),
    });

    const response = await client.getTokenRiskData(
      "base",
      "0x1111111111111111111111111111111111111110",
    );

    expect(response.data.snapshots[0]?.source).toBe("goplus");
    expect(response.data.missingLiveConfig).toContain("HONEYPOT_API_KEY");
  });

  it("reads non-secret system readiness", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        service: "chainvigil-api",
        readiness: {
          current: { mode: "mock", ok: false, missing: ["APP_BASE_URL"] },
          mock: { mode: "mock", ok: false, missing: ["APP_BASE_URL"] },
          production: { mode: "production", ok: false, missing: ["DATABASE_URL"] },
        },
        adapters: [{ name: "GoPlus", mode: "mock", ready: false, requiredEnv: "GOPLUS_API_KEY" }],
        cache: { name: "memory", mode: "mock", ready: true, requiredEnv: "REDIS_URL" },
      }),
    });

    const response = await client.getSystemReadiness();

    expect(response.readiness.current.mode).toBe("mock");
    expect(response.readiness.current.missing).toContain("APP_BASE_URL");
    expect(JSON.stringify(response)).not.toContain("postgresql://");
  });

  it("reads service metadata", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        service: "chainvigil-api",
        brand: "ChainVigil AI",
        chineseName: "链哨 AI",
        slogan: "买币前，先查 CA。",
        version: "v0",
        mode: "mock",
        supportedChains: ["base"],
        generatedAt: "2026-07-08T00:00:00.000Z",
      }),
    });

    const response = await client.getServiceMeta();

    expect(response.version).toBe("v0");
    expect(response.supportedChains).toContain("base");
  });

  it("reads mock admin audit logs", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        logs: [
          {
            id: "audit-1",
            actorId: "admin-local",
            action: "risk_report.reviewed",
            target: "token:base:0x1111111111111111111111111111111111111110",
            reason: "V0 mock",
            metadata: { goplusApiKey: "[redacted]" },
            createdAt: "2026-07-08T00:00:00.000Z",
          },
        ],
      }),
    });

    const response = await client.getAdminAuditLogs();

    expect(response.mode).toBe("mock");
    expect(response.logs[0]?.metadata?.goplusApiKey).toBe("[redacted]");
  });

  it("reads mock admin risk review queue", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        items: [
          {
            id: "risk-review-base-1110",
            chain: "base",
            tokenAddress: "0x1111111111111111111111111111111111111110",
            tokenSymbol: "MVP",
            riskLevel: "BLOCK",
            label: "禁买",
            score: 12,
            submittedBy: "system",
            status: "pending",
            reason: "卖出仿真失败。",
            signals: ["honeypotDetected"],
            reportUrl: "http://localhost:3000/token/base/0x1111111111111111111111111111111111111110",
            createdAt: "2026-07-08T00:20:00.000Z",
          },
        ],
      }),
    });

    const response = await client.getAdminRiskReviewQueue();

    expect(response.mode).toBe("mock");
    expect(response.items[0]?.riskLevel).toBe("BLOCK");
    expect(response.items[0]?.signals).toContain("honeypotDetected");
  });

  it("reads mock VP ledger summaries", async () => {
    const calls: string[] = [];
    const client = new ChainVigilClient({
      fetcher: recordingFetch(
        {
          mode: "mock",
          ledger: {
            subjectId: "visitor:test user",
            pointsName: "哨点",
            englishName: "Vigil Points",
            shortName: "VP",
            totalPending: 35,
            totalConfirmed: 20,
            totalRejected: 0,
            balances: [],
            recentEvents: [],
            disclaimer: "VP 用于产品权益和生态贡献记录，不承诺固定兑换平台币。",
          },
        },
        calls,
      ),
    });

    const response = await client.getPointLedger("visitor:test user");

    expect(calls[0]).toBe("http://localhost:4000/api/v1/points/ledger?subjectId=visitor%3Atest%20user");
    expect(response.ledger.totalPending).toBe(35);
    expect(response.ledger.shortName).toBe("VP");
  });

  it("reads mock Telegram group settings", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        groups: [
          {
            id: "tg-base-alpha",
            telegramChatId: "-1001000000001",
            title: "Base Alpha Group",
            autoDetectEnabled: false,
            highRiskAlerts: true,
            dailyCheckLimit: 100,
            language: "zh",
            checksToday: 128,
            highRiskAlertsToday: 12,
            lastCheckedAt: "2026-07-08T00:30:00.000Z",
          },
        ],
      }),
    });

    const response = await client.getTelegramGroups();

    expect(response.mode).toBe("mock");
    expect(response.groups[0]?.title).toBe("Base Alpha Group");
    expect(response.groups[0]?.highRiskAlerts).toBe(true);
  });

  it("reads Telegram command list", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        commands: [
          {
            command: "/check 0x...",
            description: "提交 EVM 合约地址，生成 mock 风险报告。",
          },
        ],
      }),
    });

    const response = await client.getTelegramCommands();

    expect(response.mode).toBe("mock");
    expect(response.commands[0]?.command).toBe("/check 0x...");
  });

  it("reads wallet reports by address", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        report: {
          walletAddress: "0x1111111111111111111111111111111111111110",
          summary: {
            highRiskApprovals: 1,
          },
        },
      }),
    });

    const response = await client.getWalletReport("0x1111111111111111111111111111111111111110");

    expect(response.report.summary.highRiskApprovals).toBe(1);
  });

  it("preserves rate-limit errors", async () => {
    const client = new ChainVigilClient({
      fetcher: (async () =>
        new Response(
          JSON.stringify({
            error: {
              code: "RATE_LIMITED",
              message: "请求过于频繁，请稍后再试。",
              retryAfter: "2026-07-08T08:00:00.000Z",
            },
          }),
          { status: 429 },
        )) as typeof fetch,
    });

    await expect(client.checkToken({ input: "bad" })).rejects.toMatchObject({
      status: 429,
      code: "RATE_LIMITED",
      message: "请求过于频繁，请稍后再试。",
    } satisfies Partial<ChainVigilApiError>);
  });

  it("throws on non-2xx responses", async () => {
    const client = new ChainVigilClient({
      fetcher: (async () => new Response("bad", { status: 500 })) as typeof fetch,
    });

    await expect(client.getPointsRules()).rejects.toThrow("ChainVigil API request failed");
  });

  it("preserves structured API error details", async () => {
    const client = new ChainVigilClient({
      fetcher: (async () =>
        new Response(
          JSON.stringify({
            error: {
              code: "BAD_REQUEST",
              message: "请输入有效的 EVM 合约地址。",
              field: "input",
            },
          }),
          { status: 400 },
        )) as typeof fetch,
    });

    await expect(client.checkToken({ input: "bad" })).rejects.toMatchObject({
      name: "ChainVigilApiError",
      status: 400,
      code: "BAD_REQUEST",
      field: "input",
      message: "请输入有效的 EVM 合约地址。",
    } satisfies Partial<ChainVigilApiError>);
  });
});
