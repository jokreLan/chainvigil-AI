import { describe, expect, it } from "vitest";
import { geoArticleSlugs, getGeoArticle, listGeoArticles } from "./geo-articles";
import { buildWebsiteJsonLd, getSiteUrl } from "./seo";

describe("SEO helpers", () => {
  it("builds site Organization/WebSite JSON-LD", () => {
    const graph = buildWebsiteJsonLd("zh");
    expect(JSON.stringify(graph)).toContain("Organization");
    expect(JSON.stringify(graph)).toContain("WebSite");
    expect(JSON.stringify(graph)).toContain("买币前，先查 CA");
    expect(getSiteUrl()).toMatch(/^https?:\/\//);
  });
});

describe("GEO articles", () => {
  it("ships bilingual core GEO slugs for weekend launch", () => {
    expect(geoArticleSlugs.length).toBeGreaterThanOrEqual(8);
    expect(geoArticleSlugs).toEqual(
      expect.arrayContaining(["honeypot", "how-to-check-ca", "fake-usdt", "lp-unlocked"]),
    );

    const zh = getGeoArticle("honeypot", "zh");
    const en = getGeoArticle("honeypot", "en");
    expect(zh?.title).toMatch(/貔貅|Honeypot/i);
    expect(en?.title).toMatch(/honeypot/i);
    expect(listGeoArticles("en").every((a) => a.faq.length > 0)).toBe(true);
  });
});
