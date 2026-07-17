import { parseTokenInput } from "@chainvigil/chain";
import { isAddress } from "viem";
import type {
  AdminRiskLabelItem,
  AdminRiskReviewItem,
  AdminTokenReportIndexItem,
  ApprovalRiskItem,
  AssetCleanupPolicy,
  ChainId,
  FakeTokenExample,
  HighRiskTokenListItem,
  RiskDatabaseEntry,
  RiskEducationLesson,
  RiskMonitorRule,
  RiskReason,
  TokenRiskReport,
  UserPreferenceSetting,
  WalletCheckCapability,
  WalletHealthReport,
  WalletWatchlistItem,
} from "@chainvigil/types";

export type ContentLocale = "zh" | "en";

export interface MockRiskInput {
  input: string;
  chain?: ChainId | undefined;
  appBaseUrl?: string;
  /** User-facing mock copy language. Defaults to zh. */
  locale?: ContentLocale | undefined;
}

export function normalizeContentLocale(locale?: string | null): ContentLocale {
  return locale === "en" ? "en" : "zh";
}

function pick(locale: ContentLocale, zh: string, en: string): string {
  return locale === "en" ? en : zh;
}

export function listMockTokenReportIndex(
  appBaseUrl = "http://localhost:3000",
  locale?: ContentLocale | null,
): AdminTokenReportIndexItem[] {
  const lang = normalizeContentLocale(locale);
  const reports = [
    {
      id: "report-bsc-1113",
      chain: "bsc",
      tokenAddress: "0x1111111111111111111111111111111111111113",
      tokenSymbol: "BNB-MVP",
      tokenName: "Mock BNB Vigil Token",
      riskLevel: "BLOCK",
      label: pick(lang, "禁买", "Block"),
      score: 12,
      summary: pick(
        lang,
        "疑似貔貅盘：卖出仿真失败，并伴随 LP 未锁等风险。",
        "Likely honeypot: sell simulation failed with unlocked LP signals.",
      ),
      checkedAt: "2026-07-08T00:20:00.000Z",
      reportUrl: `${appBaseUrl}/token/bsc/0x1111111111111111111111111111111111111113`,
      source: "web",
    },
    {
      id: "report-sol-so111",
      chain: "solana",
      tokenAddress: "So11111111111111111111111111111111111111112",
      tokenSymbol: "SOL-MOCK",
      tokenName: "Mock Solana Vigil Token",
      riskLevel: "HIGH",
      label: pick(lang, "高危", "High risk"),
      score: 34,
      summary: pick(
        lang,
        "高危：未发现一票否决项，但合约权限和持仓结构风险较高。",
        "High risk: no hard block, but privilege and concentration risks are elevated.",
      ),
      checkedAt: "2026-07-08T00:35:00.000Z",
      reportUrl: `${appBaseUrl}/token/solana/So11111111111111111111111111111111111111112`,
      source: "telegram",
    },
    {
      id: "report-bsc-1111",
      chain: "bsc",
      tokenAddress: "0x1111111111111111111111111111111111111111",
      tokenSymbol: "MVP",
      tokenName: "Mock Vigil Token",
      riskLevel: "MEDIUM",
      label: pick(lang, "谨慎", "Caution"),
      score: 58,
      summary: pick(
        lang,
        "谨慎：当前未发现明确致命风险，但仍需小额验证并关注权限与流动性。",
        "Caution: no clear fatal signal yet — still verify with a tiny size and watch privileges/LP.",
      ),
      checkedAt: "2026-07-08T00:45:00.000Z",
      reportUrl: `${appBaseUrl}/token/bsc/0x1111111111111111111111111111111111111111`,
      source: "api",
    },
  ] satisfies AdminTokenReportIndexItem[];

  return reports.map((report) => ({ ...report }));
}

export function listMockWalletWatchlist(
  appBaseUrl = "http://localhost:3000",
  locale?: ContentLocale | null,
): WalletWatchlistItem[] {
  const lang = normalizeContentLocale(locale);
  const items = [
    {
      id: "wallet-watch-main",
      address: "0x1111111111111111111111111111111111111110",
      chain: "base",
      label: pick(lang, "主钱包", "Main wallet"),
      status: "checked",
      lastCheckedAt: "2026-07-08T00:55:00.000Z",
      reportUrl: `${appBaseUrl}/wallet/0x1111111111111111111111111111111111111110/health`,
      summaryLabel: pick(lang, "高风险", "High risk"),
      highRiskApprovals: 3,
      note: pick(
        lang,
        "只读体检已完成，存在无限授权和可疑资产，需要优先复查。",
        "Read-only check done: unlimited approvals and suspicious assets need review first.",
      ),
    },
    {
      id: "wallet-watch-trading",
      address: "0x2222222222222222222222222222222222222222",
      chain: "base",
      label: pick(lang, "交易钱包", "Trading wallet"),
      status: "pending_check",
      lastCheckedAt: null,
      reportUrl: `${appBaseUrl}/wallet/0x2222222222222222222222222222222222222222/health`,
      summaryLabel: pick(lang, "待体检", "Pending check"),
      highRiskApprovals: null,
      note: pick(
        lang,
        "V0 不要求连接钱包，可先保存地址，手动触发只读体检。",
        "V0 never requires connect — save the address and run a read-only check later.",
      ),
    },
    {
      id: "wallet-watch-vault",
      address: "0x3333333333333333333333333333333333333333",
      chain: "ethereum",
      label: pick(lang, "冷钱包观察", "Cold wallet watch"),
      status: "watching",
      lastCheckedAt: "2026-07-07T23:30:00.000Z",
      reportUrl: `${appBaseUrl}/wallet/0x3333333333333333333333333333333333333333/health`,
      summaryLabel: pick(lang, "需要关注", "Needs attention"),
      highRiskApprovals: 1,
      note: pick(
        lang,
        "仅做只读观察，不发起签名、不自动撤销授权。",
        "Read-only watching only — no signatures, no auto-revoke.",
      ),
    },
  ] satisfies WalletWatchlistItem[];

  return items.map((item) => ({ ...item }));
}

export function listMockWalletCheckCapabilities(
  locale?: ContentLocale | null,
): WalletCheckCapability[] {
  const lang = normalizeContentLocale(locale);
  const capabilities = [
    {
      id: "wallet-check-high-risk-approvals",
      title: pick(lang, "高危授权", "High-risk approvals"),
      category: "approval",
      riskLevel: "HIGH",
      description: pick(
        lang,
        "识别未知 spender、高危 spender 和长期未使用授权，只做只读提示。",
        "Flag unknown/high-risk spenders and long-unused approvals — read-only tips only.",
      ),
      requiresSignature: false,
      v0Action: "read_only_check",
      prohibitedActions: pick(
        lang,
        "自动撤销授权|代替用户签名|请求授权给 ChainVigil 合约",
        "auto-revoke|sign for the user|request approvals to ChainVigil contracts",
      ).split("|"),
    },
    {
      id: "wallet-check-infinite-approvals",
      title: pick(lang, "无限授权", "Unlimited approvals"),
      category: "approval",
      riskLevel: "MEDIUM",
      description: pick(
        lang,
        "检查授权额度是否过大，帮助用户优先复查长期不用的 spender。",
        "Check oversized allowances so users can review long-unused spenders first.",
      ),
      requiresSignature: false,
      v0Action: "read_only_check",
      prohibitedActions: pick(
        lang,
        "自动降低授权额度|自动广播 revoke 交易",
        "auto-reduce allowance|auto-broadcast revoke txs",
      ).split("|"),
    },
    {
      id: "wallet-check-suspicious-tokens",
      title: pick(lang, "疑似垃圾 Token", "Suspicious tokens"),
      category: "asset",
      riskLevel: "MEDIUM",
      description: pick(
        lang,
        "标记无价格、无流动性或带钓鱼诱导的可疑资产，避免误点交互。",
        "Mark no-price, no-liquidity, or phishing-lure assets to avoid accidental interaction.",
      ),
      requiresSignature: false,
      v0Action: "read_only_check",
      prohibitedActions: pick(
        lang,
        "自动 swap|自动隐藏资产|点击未知 claim 链接",
        "auto swap|auto-hide assets|click unknown claim links",
      ).split("|"),
    },
    {
      id: "wallet-check-spam-nfts",
      title: "Spam NFT",
      category: "nft",
      riskLevel: "MEDIUM",
      description: pick(
        lang,
        "识别疑似垃圾 NFT 和钓鱼空投，提醒用户不要访问未知站点。",
        "Flag junk NFTs and phishing airdrops — don’t visit unknown sites.",
      ),
      requiresSignature: false,
      v0Action: "read_only_check",
      prohibitedActions: pick(
        lang,
        "访问 NFT 描述里的未知链接|授权未知 marketplace",
        "open unknown NFT description links|approve unknown marketplaces",
      ).split("|"),
    },
    {
      id: "wallet-check-dust-estimate",
      title: pick(lang, "粉尘资产估算", "Dust estimate"),
      category: "dust",
      riskLevel: "LOW",
      description: pick(
        lang,
        "只估算粉尘资产价值和处理成本，不进行粉尘归集或跨链桥接。",
        "Estimate dust value and cleanup cost only — never sweep or bridge dust.",
      ),
      requiresSignature: false,
      v0Action: "estimate_only",
      prohibitedActions: pick(
        lang,
        "粉尘归集|自动 bridge|自动 swap",
        "dust sweep|auto bridge|auto swap",
      ).split("|"),
    },
    {
      id: "wallet-check-health-score",
      title: pick(lang, "钱包健康分", "Wallet health score"),
      category: "score",
      riskLevel: "UNKNOWN",
      description: pick(
        lang,
        "用授权、可疑资产和粉尘风险生成只读健康摘要，不代表资产收益判断。",
        "Read-only health summary from approvals, suspicious assets, and dust — not yield advice.",
      ),
      requiresSignature: false,
      v0Action: "score_only",
      prohibitedActions: pick(
        lang,
        "承诺收益|隐藏高危授权|替用户执行资产操作",
        "promise returns|hide high-risk approvals|act on assets for the user",
      ).split("|"),
    },
  ] satisfies WalletCheckCapability[];

  return capabilities.map((capability) => ({
    ...capability,
    prohibitedActions: [...capability.prohibitedActions],
  }));
}

export function listMockUserPreferenceSettings(
  locale?: ContentLocale | null,
): UserPreferenceSetting[] {
  const lang = normalizeContentLocale(locale);
  const settings = [
    {
      id: "setting-language",
      title: pick(lang, "语言", "Language"),
      category: "language",
      valueLabel: "中文 / English",
      description: pick(
        lang,
        "V0 默认中文展示，保留英文品牌、API 字段和必要技术名词。",
        "Default UI is Chinese; English brand, API fields, and technical terms stay as-is.",
      ),
      editableInV0: false,
    },
    {
      id: "setting-risk-alert-threshold",
      title: pick(lang, "风险提醒阈值", "Risk alert threshold"),
      category: "risk_alert",
      valueLabel: pick(lang, "MEDIUM 及以上", "MEDIUM and above"),
      description: pick(
        lang,
        "中风险及以上展示明确提醒；BLOCK 级别继续使用禁买人话解释。",
        "Clear alerts from MEDIUM up; BLOCK keeps hard-block plain language.",
      ),
      editableInV0: false,
    },
    {
      id: "setting-public-leaderboard-name",
      title: pick(lang, "公开榜单昵称", "Public leaderboard name"),
      category: "profile",
      valueLabel: pick(lang, "匿名访客", "Anonymous visitor"),
      description: pick(
        lang,
        "公开榜单不展示钱包地址全量信息，V0 只保留匿名展示占位。",
        "Public boards never show full wallet addresses — V0 keeps an anonymous placeholder.",
      ),
      editableInV0: false,
    },
    {
      id: "setting-report-share-privacy",
      title: pick(lang, "报告分享隐私", "Report share privacy"),
      category: "privacy",
      valueLabel: pick(lang, "隐藏内部证据字段", "Hide internal evidence fields"),
      description: pick(
        lang,
        "分享报告只展示公开摘要、风险等级和免责声明，不暴露内部 mock evidence。",
        "Shared reports show public summary, risk level, and disclaimer only — no internal mock evidence.",
      ),
      editableInV0: false,
    },
  ] satisfies UserPreferenceSetting[];

  return settings.map((setting) => ({ ...setting }));
}

export function listMockRiskDatabaseEntries(locale?: ContentLocale | null): RiskDatabaseEntry[] {
  const lang = normalizeContentLocale(locale);
  const entries = [
    {
      id: "risk-honeypot",
      title: pick(lang, "貔貅盘 / Honeypot", "Honeypot"),
      category: "honeypot",
      severity: "BLOCK",
      plainLanguage: pick(
        lang,
        "买得进但卖不出，或卖出税接近 100%，属于 V0 一票否决风险。",
        "You can buy but cannot sell, or sell tax is near 100% — a V0 hard-block risk.",
      ),
      signals: ["canSell=false", "honeypotDetected", "sellTaxPercent>=90"],
      recommendedAction: pick(
        lang,
        "不要买入；如果已经持有，先停止加仓，等待人工复核和真实数据源确认。",
        "Do not buy. If you already hold, stop adding size until live review confirms.",
      ),
    },
    {
      id: "risk-impersonation",
      title: pick(lang, "假冒主流 Token", "Impersonation of major tokens"),
      category: "impersonation",
      severity: "HIGH",
      plainLanguage: pick(
        lang,
        "使用相似名称、符号或图标仿冒 USDT、USDC、WETH、PEPE 等知名资产。",
        "Similar name, symbol, or icon used to mimic USDT, USDC, WETH, PEPE, etc.",
      ),
      signals: ["symbolImpersonation", "unverifiedContract", "newPair"],
      recommendedAction: pick(
        lang,
        "只从官方渠道复制 CA，并用多数据源核对合约地址。",
        "Copy the CA only from official channels and cross-check explorers/markets.",
      ),
    },
    {
      id: "risk-owner-privilege",
      title: pick(lang, "Owner 后门", "Owner backdoors"),
      category: "owner_privilege",
      severity: "HIGH",
      plainLanguage: pick(
        lang,
        "项目方仍可修改税率、暂停交易、拉黑地址或增发，后续风险可能突然变化。",
        "Team can still change tax, pause trading, blacklist, or mint — risk can change suddenly.",
      ),
      signals: ["ownerCanModifyTax", "blacklistFunction", "pausable", "mintable"],
      recommendedAction: pick(
        lang,
        "只小额验证，并持续观察权限是否 renounce、timelock 或多签管理。",
        "Use tiny size only; watch for renounce, timelock, or multi-sig control.",
      ),
    },
    {
      id: "risk-liquidity-unlocked",
      title: pick(lang, "LP 未锁", "Unlocked LP"),
      category: "liquidity",
      severity: "MEDIUM",
      plainLanguage: pick(
        lang,
        "流动性未锁定或未燃烧时，项目方可能撤池，导致用户无法正常退出。",
        "If LP is unlocked/unburned, the team may pull liquidity and block exits.",
      ),
      signals: ["lpLocked=false", "lpValueLow", "lpOwnerConcentrated"],
      recommendedAction: pick(
        lang,
        "等待 LP 锁定证明；没有证明时，不把短期热度当作安全信号。",
        "Wait for lock/burn proof; don’t treat short-term hype as safety.",
      ),
    },
    {
      id: "risk-approval-unlimited",
      title: pick(lang, "无限授权", "Unlimited approvals"),
      category: "approval",
      severity: "MEDIUM",
      plainLanguage: pick(
        lang,
        "授权额度过大时，spender 一旦被攻击或作恶，可能转走对应资产。",
        "Oversized allowances let a compromised or malicious spender drain assets.",
      ),
      signals: ["allowance=infinite", "spenderUnknown", "lastUsedAt=null"],
      recommendedAction: pick(
        lang,
        "定期复查授权，对长期不用或未知 spender 优先撤销。",
        "Review approvals regularly; revoke unused or unknown spenders first.",
      ),
    },
  ] satisfies RiskDatabaseEntry[];

  return entries.map((entry) => ({
    ...entry,
    signals: [...entry.signals],
  }));
}

export function listMockRiskMonitorRules(locale?: ContentLocale | null): RiskMonitorRule[] {
  const lang = normalizeContentLocale(locale);
  const rules = [
    {
      id: "monitor-high-risk-token",
      title: pick(lang, "高危 token 复查", "High-risk token recheck"),
      targetType: "token",
      severity: "HIGH",
      status: "needs_review",
      cadenceLabel: pick(lang, "每 6 小时", "Every 6 hours"),
      lastSignalAt: "2026-07-08T03:00:00.000Z",
      signals: ["riskLevelChanged", "honeypotDetected", "sellTaxPercent>=50"],
      explanation: pick(
        lang,
        "当已查询 token 出现更高风险信号时提醒用户复查，不自动阻断交易。",
        "Alert when a scanned token shows higher risk — never auto-block trades.",
      ),
    },
    {
      id: "monitor-approval-change",
      title: pick(lang, "授权变更提醒", "Approval change alerts"),
      targetType: "wallet",
      severity: "MEDIUM",
      status: "watching",
      cadenceLabel: pick(lang, "每日", "Daily"),
      lastSignalAt: "2026-07-08T02:30:00.000Z",
      signals: ["newInfiniteApproval", "unknownSpender", "spenderLabelChanged"],
      explanation: pick(
        lang,
        "仅提示新增或异常授权，不替用户自动撤销，也不请求签名。",
        "Surfaces new/odd approvals only — no auto-revoke, no signatures.",
      ),
    },
    {
      id: "monitor-deployer-profile",
      title: pick(lang, "部署者画像变化", "Deployer profile changes"),
      targetType: "deployer",
      severity: "HIGH",
      status: "watching",
      cadenceLabel: pick(lang, "每 12 小时", "Every 12 hours"),
      lastSignalAt: "2026-07-07T22:00:00.000Z",
      signals: ["repeatedDeployments", "linkedRiskLabels", "clusterPending"],
      explanation: pick(
        lang,
        "追踪部署者关联风险标签变化，等待真实链上聚类接入后提升准确率。",
        "Tracks deployer risk-label changes; accuracy improves with live clustering.",
      ),
    },
    {
      id: "monitor-liquidity-pull",
      title: pick(lang, "LP 撤出风险", "LP pull risk"),
      targetType: "liquidity",
      severity: "BLOCK",
      status: "paused",
      cadenceLabel: pick(lang, "真实 RPC 接入后启用", "Enabled after live RPC"),
      lastSignalAt: null,
      signals: ["lpRemoved", "lpLocked=false", "ownerConcentrated"],
      explanation: pick(
        lang,
        "V0 只保留监控规则 contract，真实 LP 撤出监听需要 RPC 和索引器。",
        "V0 keeps the rule contract only; live LP-pull watching needs RPC + indexers.",
      ),
    },
  ] satisfies RiskMonitorRule[];

  return rules.map((rule) => ({
    ...rule,
    signals: [...rule.signals],
  }));
}

export function listMockAssetCleanupPolicies(locale?: ContentLocale | null): AssetCleanupPolicy[] {
  const lang = normalizeContentLocale(locale);
  const policies = [
    {
      id: "cleanup-approval-manual-confirm",
      flow: "approval_cleaner",
      title: pick(lang, "授权撤销必须用户确认", "Revokes require user confirmation"),
      decision: "manual_confirm",
      description: pick(
        lang,
        "撤销授权属于执行类能力，V0 只展示检查清单，不发起签名、不代替用户广播交易。",
        "Revoke is an execution capability. V0 shows checklists only — no signatures or broadcasts.",
      ),
      requiredChecks: pick(lang, "spender 地址|资产类型|授权额度|gas 估算|二次确认", "spender|asset type|allowance|gas estimate|second confirm").split("|"),
      prohibitedActions: pick(
        lang,
        "自动撤销授权|请求授权给 ChainVigil 自有合约|隐藏 spender 风险标签",
        "auto-revoke|request approvals to ChainVigil contracts|hide spender risk labels",
      ).split("|"),
    },
    {
      id: "cleanup-asset-recoverable",
      flow: "asset_barber",
      title: pick(lang, "可回收资产", "Recoverable assets"),
      decision: "review",
      description: pick(
        lang,
        "有价格、有流动性，且预估收益大于 gas、滑点和风险成本时，才进入后续候选。",
        "Only candidates with price, liquidity, and expected recovery above gas/slippage/risk cost.",
      ),
      requiredChecks: pick(lang, "价格来源|流动性深度|预估 gas|滑点|风险标签", "price source|liquidity depth|est. gas|slippage|risk labels").split("|"),
      prohibitedActions: pick(lang, "自动 swap|跨链 bridge|合并未知资产", "auto swap|cross-chain bridge|merge unknown assets").split("|"),
    },
    {
      id: "cleanup-asset-hide",
      flow: "asset_barber",
      title: pick(lang, "建议隐藏资产", "Suggested hide"),
      decision: "hide",
      description: pick(
        lang,
        "无价格、无流动性、spam token 或垃圾 NFT 优先建议隐藏，避免诱导交互。",
        "No price/liquidity, spam tokens, or junk NFTs should be hidden to avoid lure interactions.",
      ),
      requiredChecks: pick(lang, "是否有价格|是否有流动性|是否 spam|是否钓鱼空投", "has price|has liquidity|is spam|phishing airdrop").split("|"),
      prohibitedActions: pick(lang, "点击空投 claim|授权未知合约|访问未知站点", "click airdrop claim|approve unknown contracts|visit unknown sites").split("|"),
    },
    {
      id: "cleanup-asset-block",
      flow: "asset_barber",
      title: pick(lang, "禁止处理资产", "Do not touch"),
      decision: "block",
      description: pick(
        lang,
        "疑似貔貅、钓鱼空投或交互风险高资产不进入归集候选。",
        "Likely honeypots, phishing airdrops, or high-interaction risks never enter sweep candidates.",
      ),
      requiredChecks: pick(lang, "honeypot 信号|钓鱼标签|交互风险|合约验证状态", "honeypot signals|phish tags|interaction risk|source verified").split("|"),
      prohibitedActions: pick(lang, "自动归集|自动出售|自动 claim", "auto sweep|auto sell|auto claim").split("|"),
    },
    {
      id: "cleanup-dust-threshold",
      flow: "dust_scan",
      title: pick(lang, "粉尘归集阈值", "Dust sweep threshold"),
      decision: "review",
      description: pick(
        lang,
        "回收价值必须大于 gas、路由费、滑点、bridge fee 和风险成本；V0/V1 不执行粉尘归集。",
        "Recovery value must exceed gas, routing, slippage, bridge fees, and risk cost. V0/V1 never execute dust sweeps.",
      ),
      requiredChecks: pick(lang, "回收价值|gas|路由费|滑点|bridge fee|风险成本", "recovery value|gas|routing fee|slippage|bridge fee|risk cost").split("|"),
      prohibitedActions: pick(lang, "自动 swap|自动 bridge|粉尘归集", "auto swap|auto bridge|dust sweep").split("|"),
    },
  ] satisfies AssetCleanupPolicy[];

  return policies.map((policy) => ({
    ...policy,
    requiredChecks: [...policy.requiredChecks],
    prohibitedActions: [...policy.prohibitedActions],
  }));
}

export function listMockHighRiskTokens(
  appBaseUrl = "http://localhost:3000",
  locale?: ContentLocale | null,
): HighRiskTokenListItem[] {
  const lang = normalizeContentLocale(locale);
  const tokens = [
    {
      id: "high-risk-sol-so111",
      chain: "solana",
      tokenAddress: "So11111111111111111111111111111111111111112",
      tokenSymbol: "SOL-MOCK",
      tokenName: "Mock Solana Vigil Token",
      riskLevel: "BLOCK",
      label: pick(lang, "禁买", "Block"),
      score: 12,
      reason: pick(lang, "卖出仿真失败 / LP 未锁", "Sell sim failed / LP unlocked"),
      reportUrl: `${appBaseUrl}/token/solana/So11111111111111111111111111111111111111112`,
      evidenceTags: ["solanaAuthorityRisk", "lpLocked=false", "dexPoolUnverified"],
      updatedAt: "2026-07-08T04:00:00.000Z",
    },
    {
      id: "high-risk-bsc-2220",
      chain: "bsc",
      tokenAddress: "0x2222222222222222222222222222222222222220",
      tokenSymbol: "FAKE",
      tokenName: "Fake Router Token",
      riskLevel: "BLOCK",
      label: pick(lang, "禁买", "Block"),
      score: 18,
      reason: pick(lang, "疑似貔貅 / 黑名单权限", "Likely honeypot / blacklist power"),
      reportUrl: `${appBaseUrl}/token/bsc/0x2222222222222222222222222222222222222220`,
      evidenceTags: ["honeypotDetected", "blacklistFunction", "ownerCanModifyTax"],
      updatedAt: "2026-07-08T04:10:00.000Z",
    },
    {
      id: "high-risk-bsc-3330",
      chain: "bsc",
      tokenAddress: "0x3333333333333333333333333333333333333330",
      tokenSymbol: "MIMIC",
      tokenName: "Mimic Bluechip Token",
      riskLevel: "HIGH",
      label: pick(lang, "高危", "High risk"),
      score: 31,
      reason: pick(lang, "Owner 可改税 / 持仓集中", "Owner can change tax / concentrated holders"),
      reportUrl: `${appBaseUrl}/token/bsc/0x3333333333333333333333333333333333333330`,
      evidenceTags: ["ownerCanModifyTax", "top10HolderPercent=82", "sourceVerified=false"],
      updatedAt: "2026-07-08T04:20:00.000Z",
    },
  ] satisfies HighRiskTokenListItem[];

  return tokens.map((token) => ({
    ...token,
    evidenceTags: [...token.evidenceTags],
  }));
}

export function listMockFakeTokenExamples(locale?: ContentLocale | null): FakeTokenExample[] {
  const lang = normalizeContentLocale(locale);
  const examples = [
    {
      id: "fake-usdt",
      title: pick(lang, "假 USDT", "Fake USDT"),
      impersonates: "USDT",
      chain: "bsc",
      riskLevel: "HIGH",
      description: pick(
        lang,
        "名称和 symbol 相似，但合约地址不匹配官方地址，常搭配假交易截图传播。",
        "Similar name/symbol but wrong CA; often shared with fake trade screenshots.",
      ),
      signals: ["symbolImpersonation", "unverifiedContract", "newPair"],
      recommendedAction: pick(
        lang,
        "只从官方渠道复制 CA，并核对区块浏览器、官网和主流行情页。",
        "Copy CA only from official channels; verify explorer, site, and trusted markets.",
      ),
    },
    {
      id: "fake-pepe",
      title: pick(lang, "假 PEPE", "Fake PEPE"),
      impersonates: "PEPE",
      chain: "bsc",
      riskLevel: "BLOCK",
      description: pick(
        lang,
        "借热门币热度传播，常伴随高税、卖出限制或短时间刷量。",
        "Rides trending-name hype with high tax, sell limits, or short-lived volume.",
      ),
      signals: ["trendingMimic", "sellTaxPercent>=50", "canSell=false"],
      recommendedAction: pick(
        lang,
        "不要追陌生群链接；先查 CA，再看是否可卖和 LP 状态。",
        "Don’t chase unknown group links; scan CA first, then sell path and LP.",
      ),
    },
    {
      id: "fake-airdrop-claim",
      title: pick(lang, "假空投 Token", "Fake airdrop token"),
      impersonates: pick(lang, "空投 claim", "Airdrop claim"),
      chain: "solana",
      riskLevel: "HIGH",
      description: pick(
        lang,
        "通过钱包里凭空出现的 Token/NFT 诱导访问钓鱼站点或授权恶意 spender。",
        "Spam tokens/NFTs appear in-wallet to lure phishing sites or malicious approvals.",
      ),
      signals: ["spamAirdrop", "unknownClaimSite", "approvalPhishing"],
      recommendedAction: pick(
        lang,
        "不要点击资产备注里的链接，不要给未知 spender 授权。",
        "Don’t click links in asset notes; never approve unknown spenders.",
      ),
    },
  ] satisfies FakeTokenExample[];

  return examples.map((example) => ({
    ...example,
    signals: [...example.signals],
  }));
}

export function listMockRiskEducationLessons(locale?: ContentLocale | null): RiskEducationLesson[] {
  const lang = normalizeContentLocale(locale);
  const lessons = [
    {
      id: "lesson-honeypot-basics",
      title: pick(lang, "什么是貔貅盘？", "What is a honeypot?"),
      category: "token",
      difficulty: "beginner",
      summary: pick(
        lang,
        "能买不能卖，或卖出税接近 100%，属于买币前最需要先排除的一票否决风险。",
        "Buy-but-can’t-sell, or ~100% sell tax — the first hard-block risk to rule out.",
      ),
      relatedSignals: ["canSell=false", "honeypotDetected", "sellTaxPercent>=90"],
      recommendedAction: pick(
        lang,
        "看到禁买或卖出失败信号时，不要买入；已经持有也不要继续加仓。",
        "On block/sell-fail signals, don’t buy; if holding, don’t add size.",
      ),
    },
    {
      id: "lesson-liquidity-lock",
      title: pick(lang, "为什么 LP 未锁有风险？", "Why unlocked LP is risky?"),
      category: "liquidity",
      difficulty: "beginner",
      summary: pick(
        lang,
        "流动性可被撤走时，用户可能无法按预期退出，价格看起来活跃也不代表安全。",
        "If liquidity can be pulled, exits may fail — active price action isn’t safety.",
      ),
      relatedSignals: ["lpLocked=false", "lpValueLow", "lpOwnerConcentrated"],
      recommendedAction: pick(
        lang,
        "等待 LP 锁定或燃烧证据；没有证据时，把它视为需要谨慎的风险项。",
        "Wait for lock/burn proof; without it, treat LP as a caution flag.",
      ),
    },
    {
      id: "lesson-unlimited-approval",
      title: pick(lang, "无限授权为什么危险？", "Why unlimited approvals are dangerous?"),
      category: "approval",
      difficulty: "beginner",
      summary: pick(
        lang,
        "授权额度过大时，spender 一旦被攻击或作恶，可能转走授权范围内资产。",
        "Huge allowances let a compromised/malicious spender drain covered assets.",
      ),
      relatedSignals: ["allowance=infinite", "spenderUnknown", "lastUsedAt=null"],
      recommendedAction: pick(
        lang,
        "定期复查授权，对长期不用或未知 spender 优先手动撤销。",
        "Review approvals often; manually revoke unused/unknown spenders first.",
      ),
    },
    {
      id: "lesson-low-risk-disclaimer",
      title: pick(lang, "相对低风险不等于推荐买入", "Lower risk ≠ buy recommendation"),
      category: "disclaimer",
      difficulty: "beginner",
      summary: pick(
        lang,
        "ChainVigil 只判断交易安全风险，不判断价格走势、收益空间或投资价值。",
        "ChainVigil judges trade-safety risk only — not price, upside, or investment value.",
      ),
      relatedSignals: ["riskLevel=LOW", "notInvestmentAdvice", "manualReviewStillNeeded"],
      recommendedAction: pick(
        lang,
        "把报告当作安全检查，不把低风险结果当作买入建议。",
        "Treat reports as safety checks, not buy advice.",
      ),
    },
  ] satisfies RiskEducationLesson[];

  return lessons.map((lesson) => ({
    ...lesson,
    relatedSignals: [...lesson.relatedSignals],
  }));
}

export function listMockRiskReviewQueue(appBaseUrl = "http://localhost:3000"): AdminRiskReviewItem[] {
  const items = [
    {
      id: "risk-review-bsc-1113",
      chain: "bsc",
      tokenAddress: "0x1111111111111111111111111111111111111113",
      tokenSymbol: "BNB-MVP",
      riskLevel: "BLOCK",
      label: "禁买",
      score: 12,
      submittedBy: "system",
      status: "pending",
      reason: "卖出仿真失败且 LP 锁定状态未确认，需要人工复核是否加入高危 CA 列表。",
      signals: ["honeypotDetected", "canSell=false", "lpLocked=false"],
      reportUrl: `${appBaseUrl}/token/bsc/0x1111111111111111111111111111111111111113`,
      createdAt: "2026-07-08T00:20:00.000Z",
    },
    {
      id: "risk-review-sol-so111",
      chain: "solana",
      tokenAddress: "So11111111111111111111111111111111111111112",
      tokenSymbol: "SOL-MOCK",
      riskLevel: "HIGH",
      label: "高危",
      score: 34,
      submittedBy: "telegram_group",
      status: "needs_data",
      reason: "群内多次查询后触发 Solana 权限和池子未验证信号，等待真实数据源补证。",
      signals: ["solanaAuthorityRisk", "dexPoolUnverified", "top10HolderPercent=72"],
      reportUrl: `${appBaseUrl}/token/solana/So11111111111111111111111111111111111111112`,
      createdAt: "2026-07-08T00:35:00.000Z",
    },
    {
      id: "risk-review-bsc-1115",
      chain: "bsc",
      tokenAddress: "0x1111111111111111111111111111111111111115",
      tokenSymbol: "MVP",
      riskLevel: "BLOCK",
      label: "禁买",
      score: 12,
      submittedBy: "user_report",
      status: "escalated",
      reason: "用户举报疑似仿盘，mock 报告命中一票否决项，需后续接入审计写入后再支持处理动作。",
      signals: ["userReport", "honeypotDetected", "sourceVerified=false"],
      reportUrl: `${appBaseUrl}/token/bsc/0x1111111111111111111111111111111111111115`,
      createdAt: "2026-07-08T00:50:00.000Z",
    },
  ] satisfies AdminRiskReviewItem[];

  return items.map((item) => ({
    ...item,
    signals: [...item.signals],
  }));
}

export function listMockRiskLabels(): AdminRiskLabelItem[] {
  const labels = [
    {
      id: "risk-label-token-1110",
      targetType: "token",
      chain: "base",
      target: "0x1111111111111111111111111111111111111110",
      label: "疑似貔貅盘",
      riskLevel: "BLOCK",
      status: "active",
      source: "system",
      confidence: 92,
      reason: "卖出仿真失败，且 LP 锁定状态未确认。",
      evidenceTags: ["honeypotDetected", "canSell=false", "lpLocked=false"],
      createdAt: "2026-07-08T01:00:00.000Z",
    },
    {
      id: "risk-label-deployer-0001",
      targetType: "deployer",
      chain: "base",
      target: "0x9999999999999999999999999999999999999999",
      label: "高危部署者",
      riskLevel: "HIGH",
      status: "pending_review",
      source: "user_report",
      confidence: 76,
      reason: "多个用户举报该部署者地址关联仿盘，等待真实链上聚类补证。",
      evidenceTags: ["userReport", "clusterPending", "repeatedDeployments"],
      createdAt: "2026-07-08T01:15:00.000Z",
    },
    {
      id: "risk-label-spender-permit2",
      targetType: "spender",
      chain: "ethereum",
      target: "0x000000000022d473030f116ddee9f6b43ac78ba3",
      label: "常见授权合约",
      riskLevel: "LOW",
      status: "active",
      source: "admin_seed",
      confidence: 88,
      reason: "常见 Permit2 授权合约，风险来自授权额度和使用场景，不直接标记为恶意。",
      evidenceTags: ["permit2", "knownSpender", "reviewed"],
      createdAt: "2026-07-08T01:30:00.000Z",
    },
  ] satisfies AdminRiskLabelItem[];

  return labels.map((label) => ({
    ...label,
    evidenceTags: [...label.evidenceTags],
  }));
}

export function buildMockTokenRiskReport({
  input,
  chain,
  appBaseUrl = "http://localhost:3000",
  locale,
}: MockRiskInput): TokenRiskReport {
  const lang = normalizeContentLocale(locale);
  const parsed = parseTokenInput(input, chain);
  const normalizedAddress = parsed.chain === "solana" ? parsed.address : parsed.address.toLowerCase();
  const addressSeed = [...normalizedAddress].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const isCritical = addressSeed % 5 === 0;
  const isHigh = !isCritical && addressSeed % 3 === 0;
  const checkedAt = new Date().toISOString();
  const reasons: RiskReason[] = [
    {
      severity: isCritical ? "critical" : "high",
      title: isCritical
        ? pick(lang, "卖出路径存在异常", "Sell path anomaly")
        : pick(lang, "Owner 权限偏高", "Elevated owner powers"),
      explanation: isCritical
        ? pick(
            lang,
            "mock 检测显示卖出仿真失败，存在买入后无法正常退出的风险。",
            "Mock sell simulation failed — you may not be able to exit after buying.",
          )
        : pick(
            lang,
            "合约 owner 仍保留关键参数调整权限，后续可能改变税率或交易规则。",
            "Contract owner can still change key parameters such as tax or trading rules.",
          ),
      evidence: isCritical ? { canSell: false } : { ownerCanModifyTax: true },
    },
    {
      severity: "medium",
      title: pick(lang, "LP 锁定状态未确认", "LP lock not confirmed"),
      explanation: pick(
        lang,
        "当前 mock 数据无法确认 LP 已锁定或燃烧，需要接入真实数据源后复核。",
        "Mock data cannot confirm LP is locked or burned — re-check when live sources are connected.",
      ),
      evidence: { lpLocked: false },
    },
    {
      severity: "medium",
      title: pick(lang, "前 10 持仓集中度偏高", "Top-10 concentration elevated"),
      explanation: pick(
        lang,
        "头部地址持仓比例较高，价格可能受到少数地址卖出的明显影响。",
        "Top holders own a large share; price can move sharply if they sell.",
      ),
      evidence: { top10HolderPercent: isHigh ? 72 : 48 },
    },
  ];

  const riskLevel = isCritical ? "BLOCK" : isHigh ? "HIGH" : "MEDIUM";
  const label = isCritical
    ? pick(lang, "禁买", "Block")
    : isHigh
      ? pick(lang, "高危", "High risk")
      : pick(lang, "谨慎", "Caution");
  const score = isCritical ? 12 : isHigh ? 34 : 58;
  const summary = isCritical
    ? pick(
        lang,
        "疑似貔貅盘：卖出仿真失败，并伴随 LP 未锁等风险。",
        "Likely honeypot: sell simulation failed, with unlocked LP signals.",
      )
    : isHigh
      ? pick(
          lang,
          "高危：未发现一票否决项，但合约权限和持仓结构风险较高。",
          "High risk: no hard block, but privilege and concentration risks are elevated.",
        )
      : pick(
          lang,
          "谨慎：当前未发现明确致命风险，但仍需小额验证并关注权限与流动性。",
          "Caution: no clear fatal signal yet — still verify with a tiny size and watch privileges/LP.",
        );
  const recommendation = isCritical
    ? pick(
        lang,
        "建议不要买入。如果已持有，优先尝试小额卖出，不要继续加仓。",
        "Do not buy. If you already hold, try a tiny sell first and do not add size.",
      )
    : pick(
        lang,
        "不构成投资建议。若仍要交互，请使用极小金额，并在交易前重新检测。",
        "Not investment advice. If you still interact, use a tiny amount and re-scan before trading.",
      );
  const reportUrl = `${appBaseUrl}/token/${parsed.chain}/${normalizedAddress}`;

  return {
    id: `${parsed.chain}:${normalizedAddress}:${checkedAt}`,
    chain: parsed.chain,
    tokenAddress: normalizedAddress,
    tokenName: "Mock Vigil Token",
    tokenSymbol: "MVP",
    score,
    riskLevel,
    label,
    summary,
    recommendation,
    reasons,
    evidence: {
      buyTaxPercent: isCritical ? 3 : 1,
      sellTaxPercent: isCritical ? 100 : isHigh ? 28 : 6,
      transferTaxPercent: 0,
      canBuy: true,
      canSell: !isCritical,
      honeypotDetected: isCritical,
      ownerCanModifyTax: true,
      blacklistFunction: isCritical || isHigh,
      whitelistFunction: false,
      pausable: isHigh,
      mintable: false,
      sourceVerified: !isCritical,
      proxyContract: false,
      lpValueUsd: isCritical ? 8200 : 56000,
      lpLocked: false,
      holderCount: isCritical ? 128 : 2468,
      top10HolderPercent: isHigh ? 72 : 48,
      deployerRiskLabel: isCritical ? "mock-high-risk-deployer" : "mock-unverified",
    },
    checkedAt,
    reportUrl,
    shareText:
      lang === "en"
        ? `ChainVigil AI result: ${label}｜${summary} ${reportUrl}`
        : `ChainVigil AI 检测结果：${label}｜${summary} ${reportUrl}`,
    mode: "mock",
    confidence: "UNASSESSED",
    confidenceScore: 0,
  };
}

export function buildMockWalletHealthReport(params: {
  address: string;
  chain?: ChainId | undefined;
  appBaseUrl?: string;
  locale?: ContentLocale | undefined;
}): WalletHealthReport {
  const lang = normalizeContentLocale(params.locale);
  const normalizedAddress = params.address.trim().toLowerCase();

  if (!isAddress(normalizedAddress)) {
    throw new Error(
      pick(lang, "请输入有效的 EVM 钱包地址。", "Enter a valid EVM wallet address."),
    );
  }

  const chain = params.chain ?? "bsc";
  const appBaseUrl = params.appBaseUrl ?? "http://localhost:3000";
  const checkedAt = new Date().toISOString();
  const lastNibble = Number.parseInt(normalizedAddress.slice(-1), 16);
  const highRiskApprovals = lastNibble % 4 === 0 ? 3 : 1;
  const infiniteApprovals = highRiskApprovals + 4;
  const suspiciousTokens = lastNibble % 3 === 0 ? 8 : 3;
  const spamNfts = lastNibble % 2 === 0 ? 12 : 5;
  const dustValueUsd = lastNibble % 2 === 0 ? 42 : 18;
  const score = Math.max(28, 86 - highRiskApprovals * 12 - suspiciousTokens);
  const approvals: ApprovalRiskItem[] = [
    {
      id: `${chain}:permit2:${normalizedAddress}`,
      chain,
      assetSymbol: "USDC",
      assetType: "ERC20",
      spenderAddress: "0x000000000022d473030f116ddee9f6b43ac78ba3",
      spenderLabel: "Permit2 / mock spender",
      allowanceLabel: pick(lang, "无限授权", "Unlimited"),
      lastUsedAt: null,
      riskLevel: "HIGH",
      riskReasons: [
        pick(lang, "无限授权", "Unlimited allowance"),
        pick(lang, "长期未使用", "Long unused"),
        pick(lang, "spender 风险标签未确认", "Spender risk label unverified"),
      ],
      recommendedAction: pick(
        lang,
        "建议优先复查，确认不用后撤销授权。",
        "Review first; revoke if you no longer need this approval.",
      ),
    },
    {
      id: `${chain}:nft:${normalizedAddress}`,
      chain,
      assetSymbol: "NFT",
      assetType: "ERC721",
      spenderAddress: "0x3333333333333333333333333333333333333333",
      spenderLabel: "Unknown NFT Operator",
      allowanceLabel: "setApprovalForAll",
      lastUsedAt: "2026-06-01T00:00:00.000Z",
      riskLevel: "MEDIUM",
      riskReasons: [
        pick(lang, "未知 operator", "Unknown operator"),
        pick(lang, "授权范围覆盖全部 NFT", "Approval covers all NFTs"),
      ],
      recommendedAction: pick(
        lang,
        "如果不是常用市场或协议，建议撤销。",
        "Revoke if this is not a market or protocol you actively use.",
      ),
    },
    {
      id: `${chain}:dex:${normalizedAddress}`,
      chain,
      assetSymbol: "WETH",
      assetType: "ERC20",
      spenderAddress: "0x4444444444444444444444444444444444444444",
      spenderLabel: "Mock DEX Router",
      allowanceLabel: pick(lang, "额度较低", "Low allowance"),
      lastUsedAt: "2026-07-01T00:00:00.000Z",
      riskLevel: "LOW",
      riskReasons: [
        pick(lang, "近期使用", "Recently used"),
        pick(lang, "额度较低", "Low allowance"),
      ],
      recommendedAction: pick(
        lang,
        "暂未发现明显授权风险，仍可定期复查。",
        "No clear approval risk yet — still review periodically.",
      ),
    },
  ];

  return {
    id: `${chain}:${normalizedAddress}:${checkedAt}`,
    address: normalizedAddress,
    summary: {
      score,
      label:
        score >= 75
          ? pick(lang, "相对健康", "Relatively healthy")
          : score >= 55
            ? pick(lang, "需要关注", "Needs attention")
            : pick(lang, "高风险", "High risk"),
      highRiskApprovals,
      infiniteApprovals,
      suspiciousTokens,
      spamNfts,
      dustValueUsd,
    },
    approvals,
    checkedAt,
    reportUrl: `${appBaseUrl}/wallet/${normalizedAddress}/health`,
    disclaimer: pick(
      lang,
      "钱包体检为只读风险提示，不会请求签名、不托管资产，也不会自动执行撤销或交易。",
      "Wallet health is a read-only risk tip. No signatures, custody, auto-revoke, or trades.",
    ),
    mode: "mock",
    confidence: "UNASSESSED",
    confidenceScore: 0,
  };
}
