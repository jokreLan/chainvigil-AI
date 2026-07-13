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

const chainAliases: Record<string, ChainId> = {
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

export interface ParsedTokenInput {
  chain: ChainId;
  address: string;
  rawInput: string;
}

const solanaAddressPattern = /[1-9A-HJ-NP-Za-km-z]{32,44}/;

export function parseTokenInput(input: string, fallbackChain: ChainId = "bsc"): ParsedTokenInput {
  const rawInput = input.trim();
  const lowered = rawInput.toLowerCase();
  const evmAddress = rawInput.match(/0x[a-fA-F0-9]{40}/)?.[0];
  const solanaAddress = rawInput.match(solanaAddressPattern)?.[0];
  const aliasChain = Object.entries(chainAliases).find(([alias]) => lowered.includes(alias))?.[1];
  const detectedChain = aliasChain ?? (!evmAddress && solanaAddress ? "solana" : fallbackChain);

  if (detectedChain === "solana") {
    if (!solanaAddress) {
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
