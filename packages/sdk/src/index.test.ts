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

  it("encodes token report paths against the configured API base URL", async () => {
    const calls: string[] = [];
    const client = new ChainVigilClient({
      baseUrl: "https://api.example.test",
      fetcher: recordingFetch({ report: { label: "观察" } }, calls),
    });

    await client.getTokenReport("solana", "So11111111111111111111111111111111111111112");

    expect(calls).toEqual([
      "https://api.example.test/api/v1/token/solana/So11111111111111111111111111111111111111112",
    ]);
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

  it("reads data source adapter readiness", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        adapters: [
          { name: "GoPlus", mode: "mock", ready: false, requiredEnv: "GOPLUS_API_KEY" },
          { name: "InternalRiskDB", mode: "mock", ready: true },
        ],
      }),
    });

    const response = await client.getDataSourceAdapters();

    expect(response.mode).toBe("mock");
    expect(response.adapters[0]?.requiredEnv).toBe("GOPLUS_API_KEY");
    expect(response.adapters[1]?.ready).toBe(true);
  });

  it("reads SOL and BNB risk evidence provider contracts", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        primaryChains: ["solana", "bsc"],
        providers: [
          {
            id: "solana-rpc",
            name: "Solana RPC",
            source: "rpc",
            chains: ["solana"],
            evidenceTypes: ["token_authority"],
            mode: "mock",
            ready: false,
            requiredEnv: "RPC_SOLANA_URL",
            fallback: "mock_snapshot",
            note: "mock",
          },
        ],
      }),
    });

    const response = await client.getRiskEvidenceProviders();

    expect(response.primaryChains).toEqual(["solana", "bsc"]);
    expect(response.providers[0]).toMatchObject({
      id: "solana-rpc",
      requiredEnv: "RPC_SOLANA_URL",
      fallback: "mock_snapshot",
    });
  });

  it("reads worker job contract", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        worker: {
          ok: true,
          service: "chainvigil-worker",
          mode: "mock",
          cache: { name: "memory", mode: "mock", ready: true },
          jobs: [
            {
              name: "risk.refresh",
              cadenceSeconds: 300,
              enabled: false,
              mode: "mock",
              description: "Refresh token risk snapshots.",
            },
          ],
        },
      }),
    });

    const response = await client.getWorkerJobs();

    expect(response.mode).toBe("mock");
    expect(response.worker.service).toBe("chainvigil-worker");
    expect(response.worker.jobs[0]?.enabled).toBe(false);
  });

  it("reads risk database glossary", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        entries: [
          {
            id: "risk-honeypot",
            title: "貔貅盘 / Honeypot",
            severity: "BLOCK",
            plainLanguage: "买得进但卖不出。",
          },
        ],
      }),
    });

    const response = await client.getRiskDatabase();

    expect(response.mode).toBe("mock");
    expect(response.entries[0]?.id).toBe("risk-honeypot");
  });

  it("reads risk monitor rules", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        rules: [
          {
            id: "monitor-high-risk-token",
            status: "needs_review",
            explanation: "不自动阻断交易。",
          },
        ],
      }),
    });

    const response = await client.getRiskMonitorRules();

    expect(response.mode).toBe("mock");
    expect(response.rules[0]?.id).toBe("monitor-high-risk-token");
  });

  it("reads asset cleanup policies", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        policies: [
          {
            id: "cleanup-approval-manual-confirm",
            flow: "approval_cleaner",
            decision: "manual_confirm",
          },
        ],
      }),
    });

    const response = await client.getAssetCleanupPolicies();

    expect(response.mode).toBe("mock");
    expect(response.policies[0]?.flow).toBe("approval_cleaner");
  });

  it("reads public high-risk tokens", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        tokens: [{ tokenSymbol: "MVP", label: "禁买", riskLevel: "BLOCK" }],
      }),
    });

    const response = await client.getHighRiskTokens();

    expect(response.mode).toBe("mock");
    expect(response.tokens[0]?.label).toBe("禁买");
  });

  it("reads fake token examples", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        examples: [{ id: "fake-usdt", impersonates: "USDT" }],
      }),
    });

    const response = await client.getFakeTokenExamples();

    expect(response.mode).toBe("mock");
    expect(response.examples[0]?.impersonates).toBe("USDT");
  });

  it("reads risk education lessons", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        lessons: [{ id: "lesson-honeypot-basics", title: "什么是貔貅盘？" }],
      }),
    });

    const response = await client.getRiskEducationLessons();

    expect(response.mode).toBe("mock");
    expect(response.lessons[0]?.id).toBe("lesson-honeypot-basics");
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
        supportedChains: ["solana", "bsc"],
        generatedAt: "2026-07-08T00:00:00.000Z",
      }),
    });

    const response = await client.getServiceMeta();

    expect(response.version).toBe("v0");
    expect(response.supportedChains).toContain("solana");
    expect(response.supportedChains).toContain("bsc");
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
            id: "risk-review-bsc-1113",
            chain: "bsc",
            tokenAddress: "0x1111111111111111111111111111111111111113",
            tokenSymbol: "BNB-MVP",
            riskLevel: "BLOCK",
            label: "禁买",
            score: 12,
            submittedBy: "system",
            status: "pending",
            reason: "卖出仿真失败。",
            signals: ["honeypotDetected"],
            reportUrl: "http://localhost:3000/token/bsc/0x1111111111111111111111111111111111111113",
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

  it("reads mock admin risk labels", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        labels: [
          {
            id: "risk-label-token-1110",
            targetType: "token",
            chain: "base",
            target: "0x1111111111111111111111111111111111111110",
            label: "疑似貔貅盘",
            riskLevel: "BLOCK",
            status: "active",
            source: "system",
            confidence: 92,
            reason: "卖出仿真失败。",
            evidenceTags: ["honeypotDetected"],
            createdAt: "2026-07-08T01:00:00.000Z",
          },
        ],
      }),
    });

    const response = await client.getAdminRiskLabels();

    expect(response.mode).toBe("mock");
    expect(response.labels[0]?.label).toBe("疑似貔貅盘");
    expect(response.labels[0]?.evidenceTags).toContain("honeypotDetected");
  });

  it("reads mock admin token report index", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        reports: [
          {
            id: "report-bsc-1113",
            chain: "bsc",
            tokenAddress: "0x1111111111111111111111111111111111111113",
            tokenSymbol: "BNB-MVP",
            tokenName: "Mock BNB Vigil Token",
            riskLevel: "BLOCK",
            label: "禁买",
            score: 12,
            summary: "疑似貔貅盘。",
            checkedAt: "2026-07-08T00:20:00.000Z",
            reportUrl: "http://localhost:3000/token/bsc/0x1111111111111111111111111111111111111113",
            source: "web",
          },
        ],
      }),
    });

    const response = await client.getAdminTokenReports();

    expect(response.mode).toBe("mock");
    expect(response.reports[0]?.label).toBe("禁买");
    expect(response.reports[0]?.source).toBe("web");
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

  it("reads mock growth channels", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        channels: [
          {
            id: "channel-kol-001",
            type: "kol",
            name: "KOL-001",
            status: "active",
            owner: "growth-local",
            referralCode: "KOL001",
            visits: 1280,
            effectiveVisits: 318,
            effectiveCaChecks: 96,
            pendingVp: 420,
            confirmedVp: 860,
            conversionRate: 0.25,
            note: "按有效访问和有效 CA 检测结算。",
            updatedAt: "2026-07-08T02:00:00.000Z",
          },
        ],
      }),
    });

    const response = await client.getGrowthChannels();

    expect(response.mode).toBe("mock");
    expect(response.channels[0]?.referralCode).toBe("KOL001");
    expect(response.channels[0]?.effectiveCaChecks).toBe(96);
  });

  it("reads mock Telegram group settings", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        groups: [
          {
            id: "tg-sol-bnb-alpha",
            telegramChatId: "-1001000000001",
            title: "SOL / BNB Alpha Group",
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
    expect(response.groups[0]?.title).toBe("SOL / BNB Alpha Group");
    expect(response.groups[0]?.highRiskAlerts).toBe(true);
  });

  it("reads Telegram command list", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        commands: [
          {
            command: "/check <CA>",
            description: "提交 SOL 或 BNB Token 合约地址，生成 mock 风险报告。",
          },
        ],
      }),
    });

    const response = await client.getTelegramCommands();

    expect(response.mode).toBe("mock");
    expect(response.commands[0]?.command).toBe("/check <CA>");
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

  it("reads wallet watchlist", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        wallets: [
          {
            label: "主钱包",
            status: "checked",
            summaryLabel: "高风险",
          },
        ],
      }),
    });

    const response = await client.getWalletWatchlist();

    expect(response.mode).toBe("mock");
    expect(response.wallets[0]?.label).toBe("主钱包");
  });

  it("reads wallet check capabilities", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        capabilities: [
          {
            id: "wallet-check-high-risk-approvals",
            requiresSignature: false,
          },
        ],
      }),
    });

    const response = await client.getWalletCheckCapabilities();

    expect(response.mode).toBe("mock");
    expect(response.capabilities[0]?.requiresSignature).toBe(false);
  });

  it("reads user preference settings", async () => {
    const client = new ChainVigilClient({
      fetcher: mockFetch({
        mode: "mock",
        settings: [
          {
            id: "setting-language",
            editableInV0: false,
          },
        ],
      }),
    });

    const response = await client.getUserSettings();

    expect(response.mode).toBe("mock");
    expect(response.settings[0]?.editableInV0).toBe(false);
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
