import { describe, expect, it, vi } from "vitest";
import { resolveTokenRiskReport } from "./resolve-report.js";

describe("resolveTokenRiskReport", () => {
  it("falls back to local mock when API is not configured", async () => {
    const result = await resolveTokenRiskReport({
      input: "0x1111111111111111111111111111111111111110",
      appBaseUrl: "http://localhost:3000",
    });

    expect(result.source).toBe("local-mock");
    expect(result.report.mode).toBe("mock");
    expect(result.report.tokenAddress).toBe("0x1111111111111111111111111111111111111110");
  });

  it("uses API report when upstream succeeds", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          report: {
            id: "api",
            chain: "bsc",
            tokenAddress: "0x1111111111111111111111111111111111111110",
            tokenName: "API",
            tokenSymbol: "API",
            score: 12,
            riskLevel: "BLOCK",
            label: "禁买",
            summary: "from api",
            recommendation: "x",
            reasons: [],
            evidence: {},
            checkedAt: "2026-07-17T00:00:00.000Z",
            reportUrl: "http://localhost:3000/token/bsc/0x1",
            shareText: "share",
            mode: "mock",
            confidence: "UNASSESSED",
            confidenceScore: 0,
          },
        }),
        { status: 200 },
      ),
    ) as unknown as typeof fetch;

    const result = await resolveTokenRiskReport({
      input: "0x1111111111111111111111111111111111111110",
      appBaseUrl: "http://localhost:3000",
      apiBaseUrl: "http://api:4000",
      fetchImpl,
    });

    expect(result.source).toBe("api");
    expect(result.report.summary).toBe("from api");
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("degrades to local mock when API fails", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network");
    }) as unknown as typeof fetch;

    const result = await resolveTokenRiskReport({
      input: "0x1111111111111111111111111111111111111113",
      appBaseUrl: "http://localhost:3000",
      apiBaseUrl: "http://api:4000",
      fetchImpl,
      timeoutMs: 50,
    });

    expect(result.source).toBe("local-mock");
    expect(result.report.mode).toBe("mock");
  });
});
