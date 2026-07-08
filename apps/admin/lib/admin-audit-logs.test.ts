import { describe, expect, it } from "vitest";
import { getAdminAuditLogs } from "./admin-audit-logs";

describe("getAdminAuditLogs", () => {
  it("reads logs from the API when available", async () => {
    const result = await getAdminAuditLogs({
      apiBaseUrl: "http://api.test",
      fetcher: (async () =>
        new Response(
          JSON.stringify({
            logs: [
              {
                id: "audit-1",
                actorId: "admin-local",
                action: "risk_report.reviewed",
                target: "token:base:0x1111111111111111111111111111111111111110",
                reason: "V0 mock",
                metadata: { apiKey: "[redacted]" },
                createdAt: "2026-07-08T00:00:00.000Z",
              },
            ],
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        )) as typeof fetch,
    });

    expect(result.source).toBe("api");
    expect(result.logs[0]?.metadata?.apiKey).toBe("[redacted]");
  });

  it("falls back to local mock logs when the API is unavailable", async () => {
    const result = await getAdminAuditLogs({
      apiBaseUrl: "http://api.test",
      fetcher: (async () => new Response("nope", { status: 503 })) as typeof fetch,
    });

    expect(result.source).toBe("mock-fallback");
    expect(result.logs[0]?.target).toBe("token:base:0x1111111111111111111111111111111111111110");
    expect(JSON.stringify(result.logs)).toContain("[redacted]");
  });
});
