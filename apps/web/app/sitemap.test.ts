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
        "http://localhost:3000/zh/solana",
        "http://localhost:3000/en/solana",
        "http://localhost:3000/zh/bnb",
        "http://localhost:3000/en/check",
        "http://localhost:3000/zh/learn",
        "http://localhost:3000/en/learn/honeypot",
        "http://localhost:3000/zh/learn/how-to-check-ca",
        "http://localhost:3000/en/learn/how-to-reclaim-solana-rent",
        "http://localhost:3000/zh/learn/is-it-safe-to-revoke-approvals",
        "http://localhost:3000/en/learn/pump-fun-dev-dump-check",
        "http://localhost:3000/zh/learn/close-empty-token-accounts-solana",
        "http://localhost:3000/en/learn/free-solana-rug-check",
        "http://localhost:3000/zh/learn/bsc-honeypot-sell-fail",
        "http://localhost:3000/en/intel",
        "http://localhost:3000/zh/leaderboard/high-risk-tokens",
        "http://localhost:3000/en/fake-token-database",
        "http://localhost:3000/zh/methodology",
        "http://localhost:3000/en/risk-disclosure",
      ]),
    );
    // Per-CA and per-wallet pages must never become sitemap SEO assets.
    expect(urls.every((url) => !url.includes("/token/"))).toBe(true);
    expect(
      urls.every(
        (url) =>
          !url.includes("/wallet/0x") && !/\/wallet\/[^/]+\/health/.test(url),
      ),
    ).toBe(true);
  });

  it("allows share-preview crawl of token paths while keeping workspaces private", () => {
    const rules = robots().rules;
    const rule = Array.isArray(rules) ? rules[0] : rules;

    expect(rule?.allow).toEqual(
      expect.arrayContaining(["/solana", "/bnb", "/token/", "/check"]),
    );
    expect(rule?.disallow).toEqual(
      expect.arrayContaining(["/zh/app/", "/en/app/"]),
    );
  });

  it("marks token and wallet report pages as noindex in metadata", () => {
    const tokenPage = readFileSync(
      resolve(webRoot, "token/[chain]/[address]/page.tsx"),
      "utf8",
    );
    const walletPage = readFileSync(
      resolve(webRoot, "wallet/[address]/health/page.tsx"),
      "utf8",
    );

    expect(tokenPage).toContain("index: false");
    expect(walletPage).toContain("index: false");
  });
});
