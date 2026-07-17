import { describe, expect, it } from "vitest";
import { geoArticleSlugs, getGeoArticle, listGeoArticles } from "./geo-articles";
import {
  buildDevelopersJsonLd,
  buildRiskDatasetJsonLd,
  buildWebsiteJsonLd,
  getSiteUrl,
} from "./seo";

describe("SEO helpers", () => {
  it("builds site Organization/WebSite JSON-LD", () => {
    const graph = buildWebsiteJsonLd("zh");
    expect(JSON.stringify(graph)).toContain("Organization");
    expect(JSON.stringify(graph)).toContain("WebSite");
    expect(JSON.stringify(graph)).toContain("买币前，先查 CA");
    expect(getSiteUrl()).toMatch(/^https?:\/\//);
  });

  it("builds developers TechArticle/APIReference and risk Dataset JSON-LD", () => {
    const dev = JSON.stringify(buildDevelopersJsonLd("en"));
    expect(dev).toContain("TechArticle");
    expect(dev).toContain("APIReference");
    expect(dev).toContain("token/check");
    const dataset = JSON.stringify(buildRiskDatasetJsonLd("zh"));
    expect(dataset).toContain("Dataset");
    expect(dataset).toContain("mock");
  });
});

describe("GEO articles", () => {
  it("ships bilingual core GEO slugs for weekend launch", () => {
    expect(geoArticleSlugs.length).toBeGreaterThanOrEqual(20);
    expect(geoArticleSlugs).toEqual(
      expect.arrayContaining([
        "honeypot",
        "how-to-check-ca",
        "fake-usdt",
        "lp-unlocked",
        "how-to-reclaim-solana-rent",
        "is-it-safe-to-revoke-approvals",
        "pump-fun-dev-dump-check",
        "close-empty-token-accounts-solana",
        "free-solana-rug-check",
        "bsc-honeypot-sell-fail",
        "check-wallet-compromised",
      ]),
    );

    const zh = getGeoArticle("honeypot", "zh");
    const en = getGeoArticle("honeypot", "en");
    expect(zh?.title).toMatch(/貔貅|Honeypot/i);
    expect(en?.title).toMatch(/honeypot/i);
    expect(zh?.assertion.length).toBeGreaterThan(20);
    expect(zh?.signalTable.length).toBeGreaterThanOrEqual(3);
    expect(listGeoArticles("en").every((a) => a.faq.length > 0 && a.signalTable.length > 0)).toBe(
      true,
    );
  });
});

describe("long-tail keyword matrix", () => {
  it("covers 34 intents with durable non-CA URLs", async () => {
    const { longTailKeywords, countLongTailByStatus } = await import("./long-tail-keywords");
    expect(longTailKeywords).toHaveLength(34);
    expect(longTailKeywords.every((k) => !k.href.includes("/token/"))).toBe(true);
    const counts = countLongTailByStatus();
    expect(counts.deferred).toBeGreaterThanOrEqual(1);
    expect(counts.live + counts.mapped).toBeGreaterThanOrEqual(30);
  });
});
