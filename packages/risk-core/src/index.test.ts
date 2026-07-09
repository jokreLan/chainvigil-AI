import { describe, expect, it } from "vitest";
import {
  buildMockTokenRiskReport,
  buildMockWalletHealthReport,
  listMockAssetCleanupPolicies,
  listMockFakeTokenExamples,
  listMockHighRiskTokens,
  listMockWalletWatchlist,
  listMockRiskDatabaseEntries,
  listMockRiskMonitorRules,
  listMockRiskLabels,
  listMockRiskReviewQueue,
  listMockTokenReportIndex,
} from "./index";

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

describe("listMockWalletWatchlist", () => {
  it("returns defensive copies of wallet watchlist items", () => {
    const wallets = listMockWalletWatchlist("https://chainvigil.example");
    wallets[0]!.label = "mutated";

    expect(wallets[0]).toMatchObject({
      status: "checked",
      reportUrl: "https://chainvigil.example/wallet/0x1111111111111111111111111111111111111110/health",
    });
    expect(listMockWalletWatchlist()[0]?.label).toBe("主钱包");
  });
});

describe("listMockRiskDatabaseEntries", () => {
  it("returns human-readable risk database entries as defensive copies", () => {
    const entries = listMockRiskDatabaseEntries();
    entries[0]!.signals.push("mutated");

    expect(entries[0]).toMatchObject({
      id: "risk-honeypot",
      severity: "BLOCK",
    });
    expect(listMockRiskDatabaseEntries()[0]?.signals).not.toContain("mutated");
  });
});

describe("listMockRiskMonitorRules", () => {
  it("returns defensive copies of risk monitor rules", () => {
    const rules = listMockRiskMonitorRules();
    rules[0]!.signals.push("mutated");

    expect(rules[0]).toMatchObject({
      id: "monitor-high-risk-token",
      status: "needs_review",
    });
    expect(listMockRiskMonitorRules()[0]?.signals).not.toContain("mutated");
  });
});

describe("listMockAssetCleanupPolicies", () => {
  it("returns defensive copies of asset cleanup policies", () => {
    const policies = listMockAssetCleanupPolicies();
    policies[0]!.requiredChecks.push("mutated");

    expect(policies[0]).toMatchObject({
      flow: "approval_cleaner",
      decision: "manual_confirm",
    });
    expect(listMockAssetCleanupPolicies()[0]?.requiredChecks).not.toContain("mutated");
  });
});

describe("listMockHighRiskTokens", () => {
  it("returns defensive copies of public high-risk token rows", () => {
    const tokens = listMockHighRiskTokens("https://chainvigil.example");
    tokens[0]!.evidenceTags.push("mutated");

    expect(tokens[0]).toMatchObject({
      riskLevel: "BLOCK",
      reportUrl: "https://chainvigil.example/token/base/0x1111111111111111111111111111111111111110",
    });
    expect(listMockHighRiskTokens()[0]?.evidenceTags).not.toContain("mutated");
  });
});

describe("listMockFakeTokenExamples", () => {
  it("returns defensive copies of fake token examples", () => {
    const examples = listMockFakeTokenExamples();
    examples[0]!.signals.push("mutated");

    expect(examples[0]).toMatchObject({
      id: "fake-usdt",
      impersonates: "USDT",
    });
    expect(listMockFakeTokenExamples()[0]?.signals).not.toContain("mutated");
  });
});

describe("listMockTokenReportIndex", () => {
  it("returns defensive copies of token report index rows", () => {
    const reports = listMockTokenReportIndex("https://chainvigil.example");
    reports[0]!.label = "mutated";

    expect(reports[0]).toMatchObject({
      riskLevel: "BLOCK",
      reportUrl: "https://chainvigil.example/token/base/0x1111111111111111111111111111111111111110",
    });
    expect(listMockTokenReportIndex()[0]?.label).toBe("禁买");
  });
});

describe("listMockRiskReviewQueue", () => {
  it("returns defensive copies of admin risk review items", () => {
    const queue = listMockRiskReviewQueue("https://chainvigil.example");
    queue[0]!.signals.push("mutated");

    expect(queue[0]).toMatchObject({
      riskLevel: "BLOCK",
      status: "pending",
      reportUrl: "https://chainvigil.example/token/base/0x1111111111111111111111111111111111111110",
    });
    expect(listMockRiskReviewQueue()[0]?.signals).not.toContain("mutated");
  });
});

describe("listMockRiskLabels", () => {
  it("returns defensive copies of risk label catalog items", () => {
    const labels = listMockRiskLabels();
    labels[0]!.evidenceTags.push("mutated");

    expect(labels[0]).toMatchObject({
      targetType: "token",
      riskLevel: "BLOCK",
      status: "active",
    });
    expect(listMockRiskLabels()[0]?.evidenceTags).not.toContain("mutated");
  });
});
