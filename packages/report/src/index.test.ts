import { describe, expect, it } from "vitest";
import { buildMockTokenRiskReport } from "@chainvigil/risk-core";
import {
  buildSeoDescription,
  buildSeoTitle,
  buildTelegramCheckReply,
  buildTokenReportJsonLd,
} from "./index";

const report = buildMockTokenRiskReport({
  input: "0x1111111111111111111111111111111111111110",
});

describe("report templates", () => {
  it("builds SEO metadata with brand and safety wording", () => {
    expect(buildSeoTitle(report)).toContain("ChainVigil AI");
    expect(buildSeoDescription(report)).toContain("买币前，先查 CA");
    expect(buildSeoDescription(report)).toContain("不构成投资建议");
  });

  it("builds Telegram replies from the shared report template", () => {
    const reply = buildTelegramCheckReply(report);

    expect(reply).toContain("ChainVigil AI｜链哨 AI");
    expect(reply).toContain("完整报告");
    expect(reply).toContain(report.reportUrl);
  });

  it("builds JSON-LD for token report GEO", () => {
    const jsonLd = buildTokenReportJsonLd(report);

    expect(jsonLd["@type"]).toBe("Report");
    expect(jsonLd.name).toContain("ChainVigil AI");
    expect(JSON.stringify(jsonLd)).toContain("买币前，先查 CA");
    expect(JSON.stringify(jsonLd)).toContain(report.tokenAddress);
    expect(JSON.stringify(jsonLd)).not.toContain("ownerCanModifyTax");
  });
});
