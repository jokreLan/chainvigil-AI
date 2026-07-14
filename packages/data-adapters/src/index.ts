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
  providerId?: string;
  chain: ChainId;
  address: string;
  fetchedAt: string;
  freshForSeconds: number;
  executionMode?: "mock" | "live";
  evidenceTypes?: RiskEvidenceType[];
  fallbackReason?: string;
  data: Record<string, unknown>;
}

export type RiskEvidenceType =
  | "token_authority"
  | "token_metadata"
  | "contract_privileges"
  | "holder_concentration"
  | "trading_simulation"
  | "tax_analysis"
  | "liquidity"
  | "label_intelligence";

export type RiskEvidenceProviderMode = "mock" | "live-ready";

export interface RiskEvidenceProviderStatus {
  id: string;
  name: string;
  source: Exclude<TokenSecuritySnapshot["source"], "mock">;
  chains: ChainId[];
  evidenceTypes: RiskEvidenceType[];
  mode: RiskEvidenceProviderMode;
  ready: boolean;
  requiredEnv?: string;
  fallback: "mock_snapshot";
  note: string;
}

export interface RiskEvidenceCoverage {
  chain: ChainId;
  status: "mock_only" | "live_configured";
  confidence: "UNASSESSED";
  confidenceScore: 0;
  fallbackActive: true;
  missingLiveConfig: string[];
  plainLanguage: string;
}

interface RiskEvidenceProviderConfig {
  id: string;
  name: string;
  source: Exclude<TokenSecuritySnapshot["source"], "mock">;
  chains: readonly ChainId[];
  evidenceTypes: readonly RiskEvidenceType[];
  requiredEnv?: string;
  note: string;
}

export interface TokenRiskDataBundle {
  chain: ChainId;
  address: string;
  fetchedAt: string;
  snapshots: TokenSecuritySnapshot[];
  missingLiveConfig: string[];
  coverage: RiskEvidenceCoverage;
}

const providerConfig = [
  { name: "GoPlus", source: "goplus", requiredEnv: "GOPLUS_API_KEY" },
  { name: "Honeypot.is", source: "honeypot", requiredEnv: "HONEYPOT_API_KEY" },
  { name: "RPC", source: "rpc", requiredEnv: "RPC_BASE_URL" },
  { name: "DEX", source: "dex", requiredEnv: undefined },
] as const;

const riskEvidenceProviderConfig: readonly RiskEvidenceProviderConfig[] = [
  {
    id: "solana-rpc",
    name: "Solana RPC",
    source: "rpc",
    chains: ["solana"],
    evidenceTypes: ["token_authority", "token_metadata", "holder_concentration"],
    requiredEnv: "RPC_SOLANA_URL",
    note: "用于读取 mint/freeze authority、Token metadata 和持仓结构。",
  },
  {
    id: "bsc-rpc",
    name: "BNB Smart Chain RPC",
    source: "rpc",
    chains: ["bsc"],
    evidenceTypes: ["contract_privileges", "token_metadata", "holder_concentration"],
    requiredEnv: "RPC_BSC_URL",
    note: "用于读取合约权限、基础元数据和持仓结构。",
  },
  {
    id: "goplus-bsc",
    name: "GoPlus (BNB)",
    source: "goplus",
    chains: ["bsc"],
    evidenceTypes: ["contract_privileges", "holder_concentration", "label_intelligence"],
    requiredEnv: "GOPLUS_API_KEY",
    note: "用于补充 BNB Token 权限、持仓与标签风险证据。",
  },
  {
    id: "honeypot-bsc",
    name: "Honeypot.is (BNB)",
    source: "honeypot",
    chains: ["bsc"],
    evidenceTypes: ["trading_simulation", "tax_analysis"],
    requiredEnv: "HONEYPOT_API_KEY",
    note: "用于补充买卖仿真和税率证据。",
  },
  {
    id: "dex-market",
    name: "DEX market data",
    source: "dex",
    chains: ["solana", "bsc"],
    evidenceTypes: ["liquidity", "token_metadata"],
    note: "用于补充池子、流动性和交易对证据。",
  },
  {
    id: "internal-risk-db",
    name: "InternalRiskDB",
    source: "internal",
    chains: ["solana", "bsc"],
    evidenceTypes: ["label_intelligence"],
    note: "用于匹配人工复核后的 Token、部署者和标签风险。",
  },
];

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

export function getRiskEvidenceProviderStatus(
  env: Record<string, string | undefined> = process.env,
  chain?: ChainId,
): RiskEvidenceProviderStatus[] {
  return riskEvidenceProviderConfig
    .filter((provider) => !chain || provider.chains.includes(chain))
    .map((provider) => {
      const ready = provider.requiredEnv ? Boolean(env[provider.requiredEnv]?.trim()) : provider.id === "internal-risk-db";

      return {
        id: provider.id,
        name: provider.name,
        source: provider.source,
        chains: [...provider.chains],
        evidenceTypes: [...provider.evidenceTypes],
        mode: ready && provider.requiredEnv ? "live-ready" : "mock",
        ready,
        ...(provider.requiredEnv ? { requiredEnv: provider.requiredEnv } : {}),
        fallback: "mock_snapshot",
        note: provider.note,
      } satisfies RiskEvidenceProviderStatus;
    });
}

function buildRiskEvidenceCoverage(
  chain: ChainId,
  providers: RiskEvidenceProviderStatus[],
): RiskEvidenceCoverage {
  const missingLiveConfig = providers
    .filter((provider) => provider.requiredEnv && !provider.ready)
    .map((provider) => provider.requiredEnv!);
  const hasLiveConfiguration = providers.some((provider) => provider.mode === "live-ready");

  return {
    chain,
    status: hasLiveConfiguration ? "live_configured" : "mock_only",
    confidence: "UNASSESSED",
    confidenceScore: 0,
    fallbackActive: true,
    missingLiveConfig,
    plainLanguage: hasLiveConfiguration
      ? "真实数据源配置已就绪，但 V0 尚未执行真实请求；当前报告仍只使用 mock 证据，不产生风险置信度。"
      : "当前没有已执行的真实链上证据；V0 使用 mock 快照演示页面与接口，不产生风险置信度。",
  };
}

function collectLegacyEvmMockSnapshots(
  input: TokenSecurityLookupInput,
  address: string,
  fetchedAt: string,
  env: Record<string, string | undefined>,
): { snapshots: TokenSecuritySnapshot[]; missingLiveConfig: string[] } {
  const missingLiveConfig = providerConfig
    .filter(hasRequiredEnv)
    .filter((provider) => !env[provider.requiredEnv]?.trim())
    .map((provider) => provider.requiredEnv);
  const snapshots: TokenSecuritySnapshot[] = [
    ...providerConfig.map((provider) => ({
      source: provider.source,
      providerId: `legacy-${provider.source}`,
      chain: input.chain,
      address,
      fetchedAt,
      freshForSeconds: 60,
      executionMode: "mock" as const,
      fallbackReason: "该链保留 V0 mock 兼容；真实风险 Provider 当前仅优先建设 SOL 和 BNB。",
      data: {
        mode: "mock",
        requiredEnv: provider.requiredEnv ?? null,
        message: "V0 compatibility mock. Live provider calls are intentionally not enabled yet.",
      },
    })),
    {
      source: "internal",
      providerId: "legacy-internal-risk-db",
      chain: input.chain,
      address,
      fetchedAt,
      freshForSeconds: 300,
      executionMode: "mock",
      fallbackReason: "该链保留 V0 mock 兼容；真实风险 Provider 当前仅优先建设 SOL 和 BNB。",
      data: {
        mode: "mock",
        labels: [],
        message: "Internal risk database compatibility skeleton.",
      },
    },
  ];

  return { snapshots, missingLiveConfig };
}

export async function lookupTokenSecurity(_input: TokenSecurityLookupInput) {
  const normalizedAddress = _input.chain === "solana" ? _input.address : _input.address.toLowerCase();
  const snapshot: TokenSecuritySnapshot = {
    source: "mock",
    chain: _input.chain,
    address: normalizedAddress,
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
  const normalizedAddress = input.chain === "solana" ? input.address : input.address.toLowerCase();
  const fetchedAt = new Date().toISOString();
  const providers = getRiskEvidenceProviderStatus(env, input.chain);
  const primaryCoverage = buildRiskEvidenceCoverage(input.chain, providers);
  const primarySnapshots: TokenSecuritySnapshot[] = providers.map((provider) => ({
      source: provider.source,
      providerId: provider.id,
      chain: input.chain,
      address: normalizedAddress,
      fetchedAt,
      freshForSeconds: 60,
      executionMode: "mock",
      evidenceTypes: [...provider.evidenceTypes],
      fallbackReason: provider.ready
        ? "真实数据源只完成配置；V0 不执行外部请求，已降级为 mock 快照。"
        : provider.requiredEnv
          ? `缺少 ${provider.requiredEnv}，已降级为 mock 快照。`
          : "V0 尚未接入该 provider client，已降级为 mock 快照。",
      data: {
        mode: provider.mode,
        requiredEnv: provider.requiredEnv ?? null,
        message: "V0 adapter contract only. Live provider calls are intentionally not enabled yet.",
      },
    }));
  const legacyBundle = providers.length === 0
    ? collectLegacyEvmMockSnapshots(input, normalizedAddress, fetchedAt, env)
    : undefined;
  const coverage: RiskEvidenceCoverage = legacyBundle
    ? {
        ...primaryCoverage,
        missingLiveConfig: legacyBundle.missingLiveConfig,
        plainLanguage: "该链保留 V0 mock 兼容；真实风险 Provider 当前仅优先建设 SOL 和 BNB，不产生风险置信度。",
      }
    : primaryCoverage;

  return {
    chain: input.chain,
    address: normalizedAddress,
    fetchedAt,
    snapshots: legacyBundle?.snapshots ?? primarySnapshots,
    missingLiveConfig: coverage.missingLiveConfig,
    coverage,
  };
}
