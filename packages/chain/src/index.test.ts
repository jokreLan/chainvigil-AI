import { describe, expect, it } from "vitest";
import { parseTokenInput } from "./index";

describe("parseTokenInput", () => {
  it("extracts an EVM address and defaults to BNB Smart Chain", () => {
    const parsed = parseTokenInput("0x1111111111111111111111111111111111111111");

    expect(parsed.chain).toBe("bsc");
    expect(parsed.address).toBe("0x1111111111111111111111111111111111111111");
  });

  it("detects a chain alias from URLs or text", () => {
    const parsed = parseTokenInput(
      "https://dexscreener.com/bsc/0x2222222222222222222222222222222222222222",
    );

    expect(parsed.chain).toBe("bsc");
  });

  it("extracts a Solana token address from URLs or text", () => {
    const parsed = parseTokenInput(
      "https://dexscreener.com/solana/So11111111111111111111111111111111111111112",
    );

    expect(parsed.chain).toBe("solana");
    expect(parsed.address).toBe("So11111111111111111111111111111111111111112");
  });

  it("detects a raw Solana token address without a chain alias", () => {
    const parsed = parseTokenInput("So11111111111111111111111111111111111111112");

    expect(parsed.chain).toBe("solana");
  });
});
