import { isAddress } from "viem";
import type { ChainId } from "@chainvigil/types";

export const supportedChains: Record<
  ChainId,
  { name: string; explorerBaseUrl: string; nativeSymbol: string }
> = {
  solana: {
    name: "Solana",
    explorerBaseUrl: "https://solscan.io",
    nativeSymbol: "SOL",
  },
  ethereum: {
    name: "Ethereum",
    explorerBaseUrl: "https://etherscan.io",
    nativeSymbol: "ETH",
  },
  bsc: {
    name: "BNB Smart Chain",
    explorerBaseUrl: "https://bscscan.com",
    nativeSymbol: "BNB",
  },
  base: {
    name: "Base",
    explorerBaseUrl: "https://basescan.org",
    nativeSymbol: "ETH",
  },
  arbitrum: {
    name: "Arbitrum",
    explorerBaseUrl: "https://arbiscan.io",
    nativeSymbol: "ETH",
  },
  polygon: {
    name: "Polygon",
    explorerBaseUrl: "https://polygonscan.com",
    nativeSymbol: "POL",
  },
  optimism: {
    name: "Optimism",
    explorerBaseUrl: "https://optimistic.etherscan.io",
    nativeSymbol: "ETH",
  },
};

export interface ParsedTokenInput {
  chain: ChainId;
  address: string;
  rawInput: string;
}

const evmAddressPattern = /(?<![a-fA-F0-9])0x[a-fA-F0-9]{40}(?![a-fA-F0-9])/;
const solanaAddressPattern = /(?<![1-9A-HJ-NP-Za-km-z])[1-9A-HJ-NP-Za-km-z]{32,44}(?![1-9A-HJ-NP-Za-km-z])/;

const hostnameChains: Array<[RegExp, ChainId]> = [
  [/(^|\.)solscan\.io$/i, "solana"],
  [/(^|\.)bscscan\.com$/i, "bsc"],
  [/(^|\.)basescan\.org$/i, "base"],
  [/(^|\.)arbiscan\.io$/i, "arbitrum"],
  [/(^|\.)polygonscan\.com$/i, "polygon"],
  [/(^|\.)optimistic\.etherscan\.io$/i, "optimism"],
  [/(^|\.)etherscan\.io$/i, "ethereum"],
];

const pathSegmentChains: Record<string, ChainId> = {
  sol: "solana",
  solana: "solana",
  eth: "ethereum",
  ethereum: "ethereum",
  bsc: "bsc",
  bnb: "bsc",
  base: "base",
  arb: "arbitrum",
  arbitrum: "arbitrum",
  polygon: "polygon",
  matic: "polygon",
  optimism: "optimism",
  op: "optimism",
};

function decodeBase58Length(value: string): number {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let bytes = [0];

  for (const character of value) {
    const digit = alphabet.indexOf(character);
    if (digit < 0) return -1;

    let carry = digit;
    for (let index = 0; index < bytes.length; index += 1) {
      const current = bytes[index]! * 58 + carry;
      bytes[index] = current & 0xff;
      carry = current >> 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  for (let index = 0; index < value.length - 1 && value[index] === "1"; index += 1) {
    bytes.push(0);
  }

  return bytes.length;
}

export function isValidSolanaAddress(value: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value) && decodeBase58Length(value) === 32;
}

function detectChainFromUrl(rawInput: string): ChainId | undefined {
  try {
    const url = new URL(rawInput);
    const hostnameMatch = hostnameChains.find(([pattern]) => pattern.test(url.hostname));
    if (hostnameMatch) return hostnameMatch[1];

    const segments = url.pathname
      .toLowerCase()
      .split("/")
      .filter(Boolean);
    return segments.map((segment) => pathSegmentChains[segment]).find(Boolean);
  } catch {
    return undefined;
  }
}

export function parseTokenInput(input: string, chainHint?: ChainId): ParsedTokenInput {
  const rawInput = input.trim();
  const evmAddress = rawInput.match(evmAddressPattern)?.[0];
  const solanaAddress = rawInput.match(solanaAddressPattern)?.[0];
  const detectedChain =
    chainHint ??
    detectChainFromUrl(rawInput) ??
    (!evmAddress && solanaAddress && isValidSolanaAddress(solanaAddress) ? "solana" : "bsc");

  if (detectedChain === "solana") {
    if (!solanaAddress || !isValidSolanaAddress(solanaAddress)) {
      throw new Error("请输入有效的 Solana Token 地址。");
    }

    return {
      chain: detectedChain,
      address: solanaAddress,
      rawInput,
    };
  }

  if (!evmAddress || !isAddress(evmAddress)) {
    throw new Error("请输入有效的 EVM 合约地址。");
  }

  return {
    chain: detectedChain,
    address: evmAddress,
    rawInput,
  };
}

export function explorerTokenUrl(chain: ChainId, address: string): string {
  return `${supportedChains[chain].explorerBaseUrl}/token/${address}`;
}
