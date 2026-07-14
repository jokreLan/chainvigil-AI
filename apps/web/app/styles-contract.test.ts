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
});
