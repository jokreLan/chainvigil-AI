import { isAddress } from "viem";
import type { ChainId } from "@chainvigil/types";

export const supportedChains: Record<
  ChainId,
  { name: string; explorerBaseUrl: string; nativeSymbol: string }
> = {
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

const chainAliases: Record<string, ChainId> = {
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

export interface ParsedTokenInput {
  chain: ChainId;
  address: `0x${string}`;
  rawInput: string;
}

export function parseTokenInput(input: string, fallbackChain: ChainId = "base"): ParsedTokenInput {
  const rawInput = input.trim();
  const address = rawInput.match(/0x[a-fA-F0-9]{40}/)?.[0];

  if (!address || !isAddress(address)) {
    throw new Error("请输入有效的 EVM 合约地址。");
  }

  const lowered = rawInput.toLowerCase();
  const detectedChain =
    Object.entries(chainAliases).find(([alias]) => lowered.includes(alias))?.[1] ??
    fallbackChain;

  return {
    chain: detectedChain,
    address: address as `0x${string}`,
    rawInput,
  };
}

export function explorerTokenUrl(chain: ChainId, address: string): string {
  return `${supportedChains[chain].explorerBaseUrl}/token/${address}`;
}
