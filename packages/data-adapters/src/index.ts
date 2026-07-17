import type {
  ChainId,
  RiskReason,
  TokenRiskEvidence,
  TokenRiskReport,
} from "@chainvigil/types";

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
  status: "mock_only" | "live_configured" | "live_executed" | "mixed";
  confidence: "UNASSESSED" | "LOW" | "MEDIUM" | "HIGH";
  confidenceScore: number;
  fallbackActive: boolean;
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

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (value === "1" || value === 1 || value === "true") return true;
  if (value === "0" || value === 0 || value === "false") return false;
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export function applyLiveRiskData(
  report: TokenRiskReport,
  bundle: TokenRiskDataBundle,
  locale: "zh" | "en" = "zh",
): TokenRiskReport {
  const live = bundle.snapshots.filter((snapshot) => snapshot.executionMode === "live");
  if (live.length === 0) {
    return report;
  }

  const evidence: TokenRiskEvidence = {};
  let tokenName = report.tokenName;
  let tokenSymbol = report.tokenSymbol;
  const reasons: RiskReason[] = [];
  const pick = (zh: string, en: string) => (locale === "en" ? en : zh);

  const honeypot = live.find((snapshot) => snapshot.providerId === "honeypot-bsc");
  if (honeypot) {
    const hpResult = asRecord(honeypot.data.honeypotResult);
    const simulation = asRecord(honeypot.data.simulationResult);
    const token = asRecord(honeypot.data.token);
    const pair = asRecord(honeypot.data.pair);
    const hpDetected = asBoolean(hpResult?.isHoneypot);
    const buyTax = asNumber(simulation?.buyTax);
    const sellTax = asNumber(simulation?.sellTax);
    const transferTax = asNumber(simulation?.transferTax);
    const liquidity = asNumber(pair?.liquidity);
    if (hpDetected !== undefined) {
      evidence.honeypotDetected = hpDetected;
      evidence.canSell = !hpDetected;
    }
    if (buyTax !== undefined) evidence.buyTaxPercent = buyTax;
    if (sellTax !== undefined) evidence.sellTaxPercent = sellTax;
    if (transferTax !== undefined) evidence.transferTaxPercent = transferTax;
    if (liquidity !== undefined) evidence.lpValueUsd = liquidity;
    if (typeof token?.name === "string" && token.name.trim()) tokenName = token.name.trim();
    if (typeof token?.symbol === "string" && token.symbol.trim()) tokenSymbol = token.symbol.trim();

    if (hpDetected) {
      reasons.push({
        severity: "critical",
        title: pick("真实卖出仿真判定为貔貅", "Live simulation detected a honeypot"),
        explanation: pick(
          "Honeypot.is 的真实交易仿真返回无法正常卖出信号。",
          "Honeypot.is live trading simulation indicates the token cannot be sold normally.",
        ),
        evidence: { honeypotDetected: true },
      });
    }
    if ((evidence.sellTaxPercent ?? 0) >= 20) {
      reasons.push({
        severity: (evidence.sellTaxPercent ?? 0) >= 50 ? "critical" : "high",
        title: pick("卖出税率异常", "Abnormal sell tax"),
        explanation: pick(
          `真实仿真卖出税约为 ${evidence.sellTaxPercent}%。`,
          `Live simulation reports an estimated ${evidence.sellTaxPercent}% sell tax.`,
        ),
        evidence: { sellTaxPercent: evidence.sellTaxPercent },
      });
    }
  }

  const goplus = live.find((snapshot) => snapshot.providerId === "goplus-bsc");
  if (goplus) {
    const result = asRecord(goplus.data.result);
    const token = asRecord(result?.[report.tokenAddress.toLowerCase()]);
    if (token) {
      if (typeof token.token_name === "string" && token.token_name.trim()) tokenName = token.token_name.trim();
      if (typeof token.token_symbol === "string" && token.token_symbol.trim()) tokenSymbol = token.token_symbol.trim();
      const buyTax = asNumber(token.buy_tax);
      const sellTax = asNumber(token.sell_tax);
      const hpDetected = asBoolean(token.is_honeypot);
      const mintable = asBoolean(token.is_mintable);
      const blacklist = asBoolean(token.is_blacklisted);
      const proxy = asBoolean(token.is_proxy);
      const holderCount = asNumber(token.holder_count);
      if (evidence.buyTaxPercent === undefined && buyTax !== undefined) evidence.buyTaxPercent = buyTax;
      if (evidence.sellTaxPercent === undefined && sellTax !== undefined) evidence.sellTaxPercent = sellTax;
      if (evidence.honeypotDetected === undefined && hpDetected !== undefined) evidence.honeypotDetected = hpDetected;
      if (mintable !== undefined) evidence.mintable = mintable;
      if (blacklist !== undefined) evidence.blacklistFunction = blacklist;
      if (proxy !== undefined) evidence.proxyContract = proxy;
      const openSource = asBoolean(token.is_open_source);
      if (openSource !== undefined) evidence.sourceVerified = openSource;
      if (holderCount !== undefined) evidence.holderCount = holderCount;
      const privilegeSignals = [
        asBoolean(token.slippage_modifiable),
        asBoolean(token.owner_change_balance),
        asBoolean(token.can_take_back_ownership),
      ];
      if (privilegeSignals.some((value) => value !== undefined)) {
        evidence.ownerCanModifyTax = privilegeSignals.some(Boolean);
      }

      const riskyPrivileges = [
        evidence.ownerCanModifyTax,
        evidence.mintable,
        evidence.blacklistFunction,
      ].filter(Boolean).length;
      if (riskyPrivileges > 0) {
        reasons.push({
          severity: riskyPrivileges >= 2 ? "high" : "medium",
          title: pick("合约仍保留高风险权限", "Contract retains risky privileges"),
          explanation: pick(
            "GoPlus 实时结果显示合约可能保留改税、增发或黑名单等权限。",
            "GoPlus live data indicates tax, minting, or blacklist privileges may remain.",
          ),
          evidence: {
            ownerCanModifyTax: evidence.ownerCanModifyTax,
            mintable: evidence.mintable,
            blacklistFunction: evidence.blacklistFunction,
          },
        });
      }
    }
  }

  if (reasons.length === 0) {
    reasons.push({
      severity: "low",
      title: pick("已执行真实数据源检测", "Live data sources executed"),
      explanation: pick(
        `已执行 ${live.length} 个真实数据源；未命中当前规则中的明确高危项，但不代表绝对安全。`,
        `${live.length} live source(s) executed. No explicit high-risk rule matched, but this is not a safety guarantee.`,
      ),
    });
  }

  const critical = reasons.some((reason) => reason.severity === "critical");
  const high = reasons.some((reason) => reason.severity === "high");
  const medium = reasons.some((reason) => reason.severity === "medium");
  const riskLevel = critical ? "BLOCK" : high ? "HIGH" : medium ? "MEDIUM" : "LOW";
  const score = critical ? 10 : high ? 35 : medium ? 58 : 78;
  const label =
    locale === "en"
      ? critical ? "Block" : high ? "High risk" : medium ? "Caution" : "Lower observed risk"
      : critical ? "禁买" : high ? "高危" : medium ? "谨慎" : "当前低风险";
  const summary = pick(
    `已执行 ${live.length} 个真实数据源；风险等级为${label}。${
      bundle.coverage.fallbackActive ? "部分证据源降级，仍需复核。" : ""
    }`,
    `${live.length} live source(s) executed; observed risk is ${label}.${
      bundle.coverage.fallbackActive ? " Some evidence sources degraded; verify independently." : ""
    }`,
  );
  const recommendation = critical
    ? pick("建议不要买入；如已持有，仅尝试极小额卖出验证。", "Do not buy. If held, test only a tiny sell.")
    : pick(
        "不构成投资建议。交易前仍应核对合约、流动性与权限，并使用可承受损失的小额资金。",
        "Not investment advice. Re-check contract, liquidity, and privileges; use only a small amount you can lose.",
      );

  return {
    ...report,
    tokenName,
    tokenSymbol,
    score,
    riskLevel,
    label,
    summary,
    recommendation,
    reasons,
    evidence,
    mode: "live",
    confidence: bundle.coverage.confidence,
    confidenceScore: bundle.coverage.confidenceScore,
    shareText:
      locale === "en"
        ? `ChainVigil AI live result: ${label}｜${summary} ${report.reportUrl}`
        : `ChainVigil AI 真实检测：${label}｜${summary} ${report.reportUrl}`,
  };
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
    note: "用于补充买卖仿真和税率证据；公开接口当前可无密钥调用，可选 HONEYPOT_API_KEY。",
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
      const ready = provider.requiredEnv
        ? Boolean(env[provider.requiredEnv]?.trim())
        : provider.id === "internal-risk-db" || provider.id === "honeypot-bsc";
      const isLiveReady = ready && provider.id !== "internal-risk-db";

      return {
        id: provider.id,
        name: provider.name,
        source: provider.source,
        chains: [...provider.chains],
        evidenceTypes: [...provider.evidenceTypes],
        mode: isLiveReady ? "live-ready" : "mock",
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

/**
 * Live provider client contract (S1).
 * Implementations must never throw secrets; callers always have mock fallback.
 */
export interface LiveProviderClient {
  id: string;
  source: Exclude<TokenSecuritySnapshot["source"], "mock">;
  isEnabled(env: Record<string, string | undefined>): boolean;
  fetchSnapshot(input: TokenSecurityLookupInput): Promise<TokenSecuritySnapshot>;
}

/** Registry hook for S1 real detection — empty until a client is registered. */
const liveProviderClients: LiveProviderClient[] = [];

export function registerLiveProviderClient(client: LiveProviderClient): void {
  const index = liveProviderClients.findIndex((item) => item.id === client.id);
  if (index >= 0) {
    liveProviderClients[index] = client;
  } else {
    liveProviderClients.push(client);
  }
}

export function listRegisteredLiveProviderClients(): readonly LiveProviderClient[] {
  return liveProviderClients;
}

export function clearLiveProviderClientsForTests(): void {
  liveProviderClients.length = 0;
}

function requestHeaders(apiKey?: string): Record<string, string> {
  return apiKey?.trim()
    ? {
        accept: "application/json",
        authorization: `Bearer ${apiKey.trim()}`,
        "x-api-key": apiKey.trim(),
      }
    : { accept: "application/json" };
}

async function fetchJson(
  url: string,
  init: RequestInit = {},
  timeoutMs = 8_000,
): Promise<Record<string, unknown>> {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    throw new Error(`provider HTTP ${response.status}`);
  }
  const payload: unknown = await response.json();
  if (typeof payload !== "object" || payload === null) {
    throw new Error("provider returned invalid JSON");
  }
  return payload as Record<string, unknown>;
}

function builtInLiveProviderClients(
  env: Record<string, string | undefined>,
): LiveProviderClient[] {
  const liveEnabled =
    env.CHAINVIGIL_RUNTIME_MODE === "production" ||
    env.CHAINVIGIL_LIVE_PROVIDERS === "true";
  if (!liveEnabled) {
    return [];
  }
  const clients: LiveProviderClient[] = [];
  const goplusKey = env.GOPLUS_API_KEY?.trim();
  const honeypotKey = env.HONEYPOT_API_KEY?.trim();
  const bscRpcUrl = env.RPC_BSC_URL?.trim();
  const solanaRpcUrl = env.RPC_SOLANA_URL?.trim();

  clients.push({
    id: "honeypot-bsc",
    source: "honeypot",
    isEnabled: () => true,
    async fetchSnapshot(input) {
      if (input.chain !== "bsc") {
        throw new Error("unsupported chain");
      }
      const payload = await fetchJson(
        `https://api.honeypot.is/v2/IsHoneypot?address=${encodeURIComponent(input.address)}&chainID=56`,
        { headers: requestHeaders(honeypotKey) },
      );
      return {
        source: "honeypot",
        providerId: "honeypot-bsc",
        chain: input.chain,
        address: input.address,
        fetchedAt: new Date().toISOString(),
        freshForSeconds: 60,
        executionMode: "live",
        evidenceTypes: ["trading_simulation", "tax_analysis", "liquidity"],
        data: payload,
      };
    },
  });

  if (goplusKey) {
    clients.push({
      id: "goplus-bsc",
      source: "goplus",
      isEnabled: () => true,
      async fetchSnapshot(input) {
        if (input.chain !== "bsc") {
          throw new Error("unsupported chain");
        }
        const payload = await fetchJson(
          `https://api.gopluslabs.io/api/v1/token_security/56?contract_addresses=${encodeURIComponent(input.address)}`,
          { headers: requestHeaders(goplusKey) },
        );
        return {
          source: "goplus",
          providerId: "goplus-bsc",
          chain: input.chain,
          address: input.address,
          fetchedAt: new Date().toISOString(),
          freshForSeconds: 120,
          executionMode: "live",
          evidenceTypes: ["contract_privileges", "holder_concentration", "label_intelligence"],
          data: payload,
        };
      },
    });
  }

  const addRpcClient = (
    id: "bsc-rpc" | "solana-rpc",
    chain: "bsc" | "solana",
    rpcUrl: string,
  ) => {
    clients.push({
      id,
      source: "rpc",
      isEnabled: () => true,
      async fetchSnapshot(input) {
        if (input.chain !== chain) {
          throw new Error("unsupported chain");
        }
        const method = chain === "solana" ? "getAccountInfo" : "eth_getCode";
        const params =
          chain === "solana"
            ? [input.address, { encoding: "jsonParsed", commitment: "confirmed" }]
            : [input.address, "latest"];
        const payload = await fetchJson(rpcUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        });
        if (payload.error) {
          throw new Error("RPC returned an error");
        }
        return {
          source: "rpc",
          providerId: id,
          chain: input.chain,
          address: input.address,
          fetchedAt: new Date().toISOString(),
          freshForSeconds: 30,
          executionMode: "live",
          evidenceTypes:
            chain === "solana"
              ? ["token_authority", "token_metadata"]
              : ["contract_privileges", "token_metadata"],
          data: payload,
        };
      },
    });
  };

  if (bscRpcUrl) addRpcClient("bsc-rpc", "bsc", bscRpcUrl);
  if (solanaRpcUrl) addRpcClient("solana-rpc", "solana", solanaRpcUrl);
  return clients;
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

  // Execute built-in clients plus optional registered clients, with per-provider degradation.
  const liveSnapshots: TokenSecuritySnapshot[] = [];
  const availableClients = [
    ...liveProviderClients,
    ...builtInLiveProviderClients(env),
  ].filter(
    (client, index, all) => all.findIndex((candidate) => candidate.id === client.id) === index,
  );
  for (const client of availableClients) {
    if (!client.isEnabled(env)) {
      continue;
    }

    try {
      const live = await client.fetchSnapshot({
        chain: input.chain,
        address: normalizedAddress,
      });
      liveSnapshots.push({
        ...live,
        executionMode: live.executionMode ?? "live",
        address: normalizedAddress,
        chain: input.chain,
      });
    } catch {
      liveSnapshots.push({
        source: client.source,
        providerId: client.id,
        chain: input.chain,
        address: normalizedAddress,
        fetchedAt,
        freshForSeconds: 30,
        executionMode: "mock",
        fallbackReason: "live provider request failed; degraded to mock snapshot.",
        data: {
          mode: "degraded",
          message: "Live provider error handled without leaking upstream details.",
        },
      });
    }
  }

  const primarySnapshots: TokenSecuritySnapshot[] = providers.map((provider) => {
    const liveHit = liveSnapshots.find((snap) => snap.providerId === provider.id);

    if (liveHit) {
      return liveHit;
    }

    return {
      source: provider.source,
      providerId: provider.id,
      chain: input.chain,
      address: normalizedAddress,
      fetchedAt,
      freshForSeconds: 60,
      executionMode: "mock",
      evidenceTypes: [...provider.evidenceTypes],
      fallbackReason: provider.ready
        ? "真实数据源只完成配置；尚未注册 live client 或未执行外部请求，已降级为 mock 快照。"
        : provider.requiredEnv
          ? `缺少 ${provider.requiredEnv}，已降级为 mock 快照。`
          : "V0 尚未接入该 provider client，已降级为 mock 快照。",
      data: {
        mode: provider.mode,
        requiredEnv: provider.requiredEnv ?? null,
        message: "Adapter contract: registerLiveProviderClient() to enable live path.",
        liveClientRegistered: liveProviderClients.some((client) => client.id === provider.id),
      },
    };
  });
  const legacyBundle = providers.length === 0
    ? collectLegacyEvmMockSnapshots(input, normalizedAddress, fetchedAt, env)
    : undefined;
  const resolvedSnapshots = legacyBundle?.snapshots ?? primarySnapshots;
  const liveCount = resolvedSnapshots.filter((snapshot) => snapshot.executionMode === "live").length;
  const fallbackCount = resolvedSnapshots.length - liveCount;
  const coverage: RiskEvidenceCoverage = legacyBundle
    ? {
        ...primaryCoverage,
        missingLiveConfig: legacyBundle.missingLiveConfig,
        plainLanguage: "该链保留 V0 mock 兼容；真实风险 Provider 当前仅优先建设 SOL 和 BNB，不产生风险置信度。",
      }
    : liveCount > 0
      ? {
          ...primaryCoverage,
          status: fallbackCount > 0 ? "mixed" : "live_executed",
          confidence: liveCount >= 2 ? "HIGH" : "MEDIUM",
          confidenceScore: Math.min(95, 55 + liveCount * 15),
          fallbackActive: fallbackCount > 0,
          plainLanguage:
            fallbackCount > 0
              ? `已执行 ${liveCount} 个真实数据源，另有 ${fallbackCount} 个数据源降级；结论需结合缺失项复核。`
              : `已执行 ${liveCount} 个真实数据源，当前没有 mock 降级。`,
        }
      : primaryCoverage;

  return {
    chain: input.chain,
    address: normalizedAddress,
    fetchedAt,
    snapshots: resolvedSnapshots,
    missingLiveConfig: coverage.missingLiveConfig,
    coverage,
  };
}
