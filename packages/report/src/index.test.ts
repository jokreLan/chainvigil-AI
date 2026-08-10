import { describe, expect, it } from "vitest";
import { buildMockTokenRiskReport } from "@chainvigil/risk-core";
import {
  buildSeoDescription,
  buildSeoTitle,
  buildSharePrefix,
  buildTelegramCheckReply,
  buildTokenReportJsonLd,
  describeReportMode,
} from "./index";

const report = buildMockTokenRiskReport({
  input: "0x1111111111111111111111111111111111111110",
});

describe("report templates", () => {
  it("builds SEO metadata with brand and safety wording", () => {
    expect(buildSeoTitle(report)).toContain("ChainVigil");
    expect(buildSeoTitle(report)).not.toContain("ChainVigil AI");
    expect(buildSeoDescription(report)).toContain("买币前，先查 CA");
    expect(buildSeoDescription(report)).toContain("不构成投资建议");
  });

  it("builds Telegram replies from the shared report template", () => {
    const reply = buildTelegramCheckReply(report);

    expect(reply).toContain("ChainVigil");
    expect(reply).not.toContain("ChainVigil AI");
    expect(reply).toContain("完整报告");
    expect(reply).toContain(report.reportUrl);
    expect(reply).toContain("模式：");
    expect(reply).toContain("MOCK");
  });

  it("builds English Telegram replies when locale is en", () => {
    const reply = buildTelegramCheckReply(report, "en");
    expect(reply).toContain("Full report:");
    expect(reply).toContain("Not investment advice");
    expect(buildSeoTitle(report, "en")).toMatch(/risk report/i);
    expect(buildSharePrefix(report, "en")).toMatch(/sample report|buy-before/i);
  });

  it("describes mock vs live modes for launch UI", () => {
    expect(describeReportMode("mock", "UNASSESSED").tone).toBe("mock");
    expect(describeReportMode("live", "HIGH").tone).toBe("live");
    expect(describeReportMode("mock", "UNASSESSED", "en").title).toMatch(/demo/i);
    expect(buildSharePrefix(report)).toContain("非实时");
  });

  it("builds JSON-LD for token report GEO", () => {
    const jsonLd = buildTokenReportJsonLd(report);

    expect(jsonLd["@type"]).toBe("Report");
    expect(jsonLd.name).toContain("ChainVigil");
    expect(jsonLd.name).not.toContain("ChainVigil AI");
    expect(JSON.stringify(jsonLd)).toContain("买币前，先查 CA");
    expect(JSON.stringify(jsonLd)).toContain(report.tokenAddress);
    expect(JSON.stringify(jsonLd)).not.toContain("ownerCanModifyTax");
  });
});
