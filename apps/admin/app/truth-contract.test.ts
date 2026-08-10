import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appRoot = import.meta.dirname;

function read(relativePath: string) {
  return readFileSync(resolve(appRoot, relativePath), "utf8");
}

describe("Admin truth contract", () => {
  it("uses the public ChainVigil brand and does not call registrations online clients", () => {
    const home = read("page.tsx");
    const readiness = read("system-readiness/page.tsx");

    expect(home).toContain("ChainVigil Admin");
    expect(home).not.toContain("ChainVigil AI");
    expect(home).toContain("非在线数量或可用率");
    expect(readiness).toContain("代码注册数，非在线状态或可用率");
  });

  it("labels mock operational datasets as read-only samples", () => {
    const riskReview = read("risk-review/page.tsx");
    const reports = read("reports/page.tsx");
    const channels = read("channels/page.tsx");
    const telegram = read("telegram/page.tsx");
    const riskLabels = read("risk-labels/page.tsx");

    for (const page of [riskReview, channels, telegram, riskLabels]) {
      expect(page).toMatch(/MOCK FALLBACK ·\s+READ-ONLY/);
    }
    expect(riskReview).not.toContain("item.score");
    expect(riskReview).toContain("SAMPLE LABEL");
    expect(riskLabels).not.toContain("item.confidence");
    expect(riskLabels).toContain("SAMPLE CONFIDENCE · UNVERIFIED");
    expect(reports).toContain("<caption");
  });

  it("keeps all Admin routes on the independent control-room shell", () => {
    const layout = read("layout.tsx");
    const shell = read("admin-shell.tsx");
    const globals = read("globals.css");
    const routes = [
      "page.tsx",
      "system-readiness/page.tsx",
      "data-sources/page.tsx",
      "risk-review/page.tsx",
      "reports/page.tsx",
      "risk-labels/page.tsx",
      "audit/page.tsx",
      "points/page.tsx",
      "channels/page.tsx",
      "telegram/page.tsx",
    ].map(read);

    expect(layout).toContain("AdminShell");
    expect(shell).toContain("WRITE DISABLED");
    expect(shell).toContain("MOCK / READINESS");
    expect(shell).toContain("Admin 主导航");
    expect(shell).toContain('href="#main-content"');
    expect(shell).toContain('id="main-content"');
    expect(globals).toContain("grid-template-columns: 15.5rem minmax(0, 1fr)");
    expect(globals).toContain(
      ":where(a, button, input, summary):focus-visible",
    );
    expect(globals).toContain("prefers-reduced-motion: reduce");
    for (const route of routes) {
      expect(route).toContain("admin-page");
      expect(route).toContain("admin-kicker");
      expect(route).toContain("export const metadata");
    }
  });
});
