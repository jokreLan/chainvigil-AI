import type { ChainId } from "@chainvigil/types";

export interface AdapterHealth {
  name: string;
  mode: "mock" | "live";
  ready: boolean;
  requiredEnv?: string;
}

export interface TokenSecurityLookupInput {
  chain: ChainId;
  address: string;
}

export interface TokenSecuritySnapshot {
  source: "mock" | "goplus" | "honeypot" | "rpc" | "dex" | "internal";
  chain: ChainId;
  address: string;
  fetchedAt: string;
  freshForSeconds: number;
  data: Record<string, unknown>;
}

export interface TokenRiskDataBundle {
  chain: ChainId;
  address: string;
  fetchedAt: string;
  snapshots: TokenSecuritySnapshot[];
  missingLiveConfig: string[];
}

const providerConfig = [
  { name: "GoPlus", source: "goplus", requiredEnv: "GOPLUS_API_KEY" },
  { name: "Honeypot.is", source: "honeypot", requiredEnv: "HONEYPOT_API_KEY" },
  { name: "RPC", source: "rpc", requiredEnv: "RPC_BASE_URL" },
  { name: "DEX", source: "dex", requiredEnv: undefined },
] as const;

function hasRequiredEnv(
  provider: (typeof providerConfig)[number],
): provider is (typeof providerConfig)[number] & { requiredEnv: string } {
  return typeof provider.requiredEnv === "string";
}

export function getAdapterHealth(env: Record<string, string | undefined> = process.env): AdapterHealth[] {
  return [
    ...providerConfig.map((provider) => {
      const hasConfig = provider.requiredEnv ? Boolean(env[provider.requiredEnv]?.trim()) : false;

      return {
        name: provider.name,
        mode: hasConfig ? "live" : "mock",
        ready: hasConfig,
        ...(provider.requiredEnv ? { requiredEnv: provider.requiredEnv } : {}),
      } satisfies AdapterHealth;
    }),
    { name: "InternalRiskDB", mode: "mock", ready: true },
  ];
}

export async function lookupTokenSecurity(_input: TokenSecurityLookupInput) {
  const snapshot: TokenSecuritySnapshot = {
    source: "mock",
    chain: _input.chain,
    address: _input.address.toLowerCase(),
    fetchedAt: new Date().toISOString(),
    freshForSeconds: 60,
    data: {
      message: "V0 skeleton: external adapters are defined but not connected yet.",
    },
  };

  return snapshot;
}

export async function collectTokenRiskData(
  input: TokenSecurityLookupInput,
  env: Record<string, string | undefined> = process.env,
): Promise<TokenRiskDataBundle> {
  const normalizedAddress = input.address.toLowerCase();
  const fetchedAt = new Date().toISOString();
  const missingLiveConfig = providerConfig
    .filter(hasRequiredEnv)
    .filter((provider) => !env[provider.requiredEnv]?.trim())
    .map((provider) => provider.requiredEnv);
  const snapshots: TokenSecuritySnapshot[] = [
    ...providerConfig.map((provider) => ({
      source: provider.source,
      chain: input.chain,
      address: normalizedAddress,
      fetchedAt,
      freshForSeconds: 60,
      data: {
        mode: provider.requiredEnv && env[provider.requiredEnv]?.trim() ? "live-ready" : "mock",
        requiredEnv: provider.requiredEnv ?? null,
        message: "V0 adapter contract only. Live provider calls are intentionally not enabled yet.",
      },
    })),
    {
      source: "internal",
      chain: input.chain,
      address: normalizedAddress,
      fetchedAt,
      freshForSeconds: 300,
      data: {
        mode: "mock",
        labels: [],
        message: "Internal risk database skeleton.",
      },
    },
  ];

  return {
    chain: input.chain,
    address: normalizedAddress,
    fetchedAt,
    snapshots,
    missingLiveConfig,
  };
}
