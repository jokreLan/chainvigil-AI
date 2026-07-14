import { describe, expect, it } from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";

describe("public discovery contracts", () => {
  it("publishes the SOL and BNB topic guides in the sitemap", () => {
    const entries = sitemap();

    expect(entries.map((entry) => entry.url)).toEqual(
      expect.arrayContaining(["http://localhost:3000/solana", "http://localhost:3000/bnb"]),
    );
  });

  it("allows topic guide crawling while keeping personal workspaces private", () => {
    const rules = robots().rules;
    const rule = Array.isArray(rules) ? rules[0] : rules;

    expect(rule?.allow).toEqual(expect.arrayContaining(["/solana", "/bnb"]));
    expect(rule?.disallow).toEqual(expect.arrayContaining(["/app/"]));
  });
});
