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

  it("does not match chain aliases inside unrelated words", () => {
    expect(
      parseTokenInput("copy 0x1111111111111111111111111111111111111111").chain,
    ).toBe("bsc");
    expect(
      parseTokenInput(
        "https://example.com/baseball/0x1111111111111111111111111111111111111111",
      ).chain,
    ).toBe("bsc");
  });

  it("recognizes explorer hostnames without confusing optimism and ethereum", () => {
    expect(
      parseTokenInput(
        "https://optimistic.etherscan.io/token/0x1111111111111111111111111111111111111111",
      ).chain,
    ).toBe("optimism");
    expect(
      parseTokenInput(
        "https://etherscan.io/token/0x1111111111111111111111111111111111111111",
      ).chain,
    ).toBe("ethereum");
  });

  it("honors an explicit chain hint", () => {
    expect(
      parseTokenInput("0x1111111111111111111111111111111111111111", "base").chain,
    ).toBe("base");
  });

  it("rejects base58 strings that do not decode to a 32-byte Solana public key", () => {
    expect(() => parseTokenInput("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")).toThrow();
  });
});
