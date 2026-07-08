import { describe, expect, it } from "vitest";
import { buildMockTokenRiskReport, buildMockWalletHealthReport } from "./index";

describe("buildMockTokenRiskReport", () => {
  it("returns a human-readable mock report", () => {
    const report = buildMockTokenRiskReport({
      input: "0x1111111111111111111111111111111111111110",
    });

    expect(report.riskLevel).toBe("BLOCK");
    expect(report.label).toBe("禁买");
    expect(report.reasons.length).toBeGreaterThan(0);
  });
});

describe("buildMockWalletHealthReport", () => {
  it("returns a read-only wallet health report with approval risks", () => {
    const report = buildMockWalletHealthReport({
      address: "0x1111111111111111111111111111111111111110",
    });

    expect(report.summary.highRiskApprovals).toBeGreaterThan(0);
    expect(report.approvals.length).toBeGreaterThan(0);
    expect(report.disclaimer).toContain("只读风险提示");
  });
});
