import { describe, expect, it } from "vitest";
import { parseTokenInput } from "./index";

describe("parseTokenInput", () => {
  it("extracts an EVM address and defaults to Base", () => {
    const parsed = parseTokenInput("0x1111111111111111111111111111111111111111");

    expect(parsed.chain).toBe("base");
    expect(parsed.address).toBe("0x1111111111111111111111111111111111111111");
  });

  it("detects a chain alias from URLs or text", () => {
    const parsed = parseTokenInput(
      "https://dexscreener.com/bsc/0x2222222222222222222222222222222222222222",
    );

    expect(parsed.chain).toBe("bsc");
  });
});
