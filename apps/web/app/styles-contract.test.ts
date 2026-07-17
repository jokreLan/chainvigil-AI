import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const webRoot = resolve(import.meta.dirname, "..");

describe("Web style build contract", () => {
  it("keeps Tailwind import and PostCSS compiler configured together", () => {
    const globals = readFileSync(resolve(webRoot, "app/globals.css"), "utf8");
    const postcss = readFileSync(resolve(webRoot, "postcss.config.mjs"), "utf8");

    expect(globals).toContain('@import "tailwindcss"');
    expect(postcss).toContain("@tailwindcss/postcss");
  });

  it("keeps keyboard focus visible across the dark UI", () => {
    const globals = readFileSync(resolve(webRoot, "app/globals.css"), "utf8");

    expect(globals).toContain(":focus-visible");
    expect(globals).toMatch(/outline:\s*2px solid (var\(--cv-primary\)|#c0c1ff)/);
  });

  it("does not present static V0 examples as a live scan", () => {
    const home = readFileSync(resolve(webRoot, "app/page.tsx"), "utf8");
    const messages = readFileSync(resolve(webRoot, "app/i18n/messages.ts"), "utf8");
    const fakeTokenDatabase = readFileSync(resolve(webRoot, "app/fake-token-database/page.tsx"), "utf8");

    expect(home).toContain("home.alertMock");
    expect(messages).toContain("V0 MOCK");
    expect(home.toUpperCase()).not.toContain("LIVE SCAN");
    expect(fakeTokenDatabase).toMatch(/V0 mock/i);
    expect(fakeTokenDatabase).not.toContain("Token 名称或 Symbol 开始核验");
  });

  it("wires bilingual shell on layout and header", () => {
    const layout = readFileSync(resolve(webRoot, "app/layout.tsx"), "utf8");
    const header = readFileSync(resolve(webRoot, "app/ui/site-header.tsx"), "utf8");
    expect(layout).toContain("LocaleProvider");
    expect(header).toContain("LanguageSwitcher");
  });

  it("keeps Stitch design tokens in globals", () => {
    const globals = readFileSync(resolve(webRoot, "app/globals.css"), "utf8");
    expect(globals).toContain("--cv-primary-container");
    expect(globals).toContain("ai-gradient-text");
    expect(globals).toContain("cv-scan-line");
  });
});
