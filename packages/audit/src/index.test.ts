import { describe, expect, it } from "vitest";
import {
  createAdminAuditLog,
  listMockAdminAuditLogs,
  redactAuditMetadata,
  telegramGroupTarget,
  tokenRiskTarget,
} from "./index";

describe("audit contract", () => {
  it("creates admin audit logs with stable fields", () => {
    const log = createAdminAuditLog({
      actorId: "admin-local",
      action: "risk_report.reviewed",
      target: tokenRiskTarget("base", "0xABCDEF0000000000000000000000000000000000"),
      reason: "V0 mock review",
      createdAt: new Date("2026-07-08T00:00:00.000Z"),
    });

    expect(log.id).toBeTruthy();
    expect(log.action).toBe("risk_report.reviewed");
    expect(log.target).toBe("token:base:0xabcdef0000000000000000000000000000000000");
    expect(log.createdAt).toBe("2026-07-08T00:00:00.000Z");
  });

  it("redacts secret-like metadata keys", () => {
    expect(
      redactAuditMetadata({
        provider: "goplus",
        apiKey: "live-key",
        TELEGRAM_BOT_TOKEN: "bot-token",
        password: "secret",
        checks: 3,
      }),
    ).toEqual({
      provider: "goplus",
      apiKey: "[redacted]",
      TELEGRAM_BOT_TOKEN: "[redacted]",
      password: "[redacted]",
      checks: 3,
    });
  });

  it("formats telegram group audit targets", () => {
    expect(telegramGroupTarget(-100123)).toBe("telegram-group:-100123");
  });

  it("lists mock admin audit logs with redacted metadata", () => {
    const logs = listMockAdminAuditLogs();

    expect(logs).toHaveLength(3);
    expect(logs[0]?.target).toBe("token:base:0x1111111111111111111111111111111111111110");
    expect(JSON.stringify(logs)).toContain("[redacted]");
    expect(JSON.stringify(logs)).not.toContain("mock-secret");
    expect(JSON.stringify(logs)).not.toContain("mock-token");
  });
});
