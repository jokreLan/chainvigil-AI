import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";

const webRoot = resolve(import.meta.dirname);

describe("public discovery contracts", () => {
  it("publishes durable SOL/BNB guides and tool pages in the sitemap", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        "http://localhost:3000/solana",
        "http://localhost:3000/bnb",
        "http://localhost:3000/check",
        "http://localhost:3000/learn",
        "http://localhost:3000/learn/honeypot",
        "http://localhost:3000/learn/how-to-check-ca",
        "http://localhost:3000/intel",
      ]),
    );
    // Per-CA and per-wallet pages must never become sitemap SEO assets.
    expect(urls.every((url) => !url.includes("/token/"))).toBe(true);
    expect(urls.every((url) => !url.includes("/wallet/0x") && !/\/wallet\/[^/]+\/health/.test(url))).toBe(
      true,
    );
  });

  it("allows share-preview crawl of token paths while keeping workspaces private", () => {
    const rules = robots().rules;
    const rule = Array.isArray(rules) ? rules[0] : rules;

    expect(rule?.allow).toEqual(expect.arrayContaining(["/solana", "/bnb", "/token/", "/check"]));
    expect(rule?.disallow).toEqual(expect.arrayContaining(["/app/"]));
  });

  it("marks token and wallet report pages as noindex in metadata", () => {
    const tokenPage = readFileSync(resolve(webRoot, "token/[chain]/[address]/page.tsx"), "utf8");
    const walletPage = readFileSync(resolve(webRoot, "wallet/[address]/health/page.tsx"), "utf8");

    expect(tokenPage).toContain("index: false");
    expect(walletPage).toContain("index: false");
  });
});
