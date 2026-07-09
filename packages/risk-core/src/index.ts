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
  RiskMonitorRule,
  RiskReason,
  TokenRiskReport,
  WalletHealthReport,
  WalletWatchlistItem,
} from "@chainvigil/types";

export interface MockRiskInput {
  input: string;
  chain?: ChainId | undefined;
  appBaseUrl?: string;
}

export function listMockTokenReportIndex(appBaseUrl = "http://localhost:3000"): AdminTokenReportIndexItem[] {
  const reports = [
    {
      id: "report-base-1110",
      chain: "base",
      tokenAddress: "0x1111111111111111111111111111111111111110",
      tokenSymbol: "MVP",
      tokenName: "Mock Vigil Token",
      riskLevel: "BLOCK",
      label: "禁买",
      score: 12,
      summary: "疑似貔貅盘：卖出仿真失败，并伴随 LP 未锁等风险。",
      checkedAt: "2026-07-08T00:20:00.000Z",
      reportUrl: `${appBaseUrl}/token/base/0x1111111111111111111111111111111111111110`,
      source: "web",
    },
    {
      id: "report-base-1113",
      chain: "base",
      tokenAddress: "0x1111111111111111111111111111111111111113",
      tokenSymbol: "MVP",
      tokenName: "Mock Vigil Token",
      riskLevel: "HIGH",
      label: "高危",
      score: 34,
      summary: "高危：未发现一票否决项，但合约权限和持仓结构风险较高。",
      checkedAt: "2026-07-08T00:35:00.000Z",
      reportUrl: `${appBaseUrl}/token/base/0x1111111111111111111111111111111111111113`,
      source: "telegram",
    },
    {
      id: "report-base-1111",
      chain: "base",
      tokenAddress: "0x1111111111111111111111111111111111111111",
      tokenSymbol: "MVP",
      tokenName: "Mock Vigil Token",
      riskLevel: "MEDIUM",
      label: "谨慎",
      score: 58,
      summary: "谨慎：当前未发现明确致命风险，但仍需小额验证并关注权限与流动性。",
      checkedAt: "2026-07-08T00:45:00.000Z",
      reportUrl: `${appBaseUrl}/token/base/0x1111111111111111111111111111111111111111`,
      source: "api",
    },
  ] satisfies AdminTokenReportIndexItem[];

  return reports.map((report) => ({ ...report }));
}

export function listMockWalletWatchlist(appBaseUrl = "http://localhost:3000"): WalletWatchlistItem[] {
  const items = [
    {
      id: "wallet-watch-main",
      address: "0x1111111111111111111111111111111111111110",
      chain: "base",
      label: "主钱包",
      status: "checked",
      lastCheckedAt: "2026-07-08T00:55:00.000Z",
      reportUrl: `${appBaseUrl}/wallet/0x1111111111111111111111111111111111111110/health`,
      summaryLabel: "高风险",
      highRiskApprovals: 3,
      note: "只读体检已完成，存在无限授权和可疑资产，需要优先复查。",
    },
    {
      id: "wallet-watch-trading",
      address: "0x2222222222222222222222222222222222222222",
      chain: "base",
      label: "交易钱包",
      status: "pending_check",
      lastCheckedAt: null,
      reportUrl: `${appBaseUrl}/wallet/0x2222222222222222222222222222222222222222/health`,
      summaryLabel: "待体检",
      highRiskApprovals: null,
      note: "V0 不要求连接钱包，可先保存地址，手动触发只读体检。",
    },
    {
      id: "wallet-watch-vault",
      address: "0x3333333333333333333333333333333333333333",
      chain: "ethereum",
      label: "冷钱包观察",
      status: "watching",
      lastCheckedAt: "2026-07-07T23:30:00.000Z",
      reportUrl: `${appBaseUrl}/wallet/0x3333333333333333333333333333333333333333/health`,
      summaryLabel: "需要关注",
      highRiskApprovals: 1,
      note: "仅做只读观察，不发起签名、不自动撤销授权。",
    },
  ] satisfies WalletWatchlistItem[];

  return items.map((item) => ({ ...item }));
}

export function listMockRiskDatabaseEntries(): RiskDatabaseEntry[] {
  const entries = [
    {
      id: "risk-honeypot",
      title: "貔貅盘 / Honeypot",
      category: "honeypot",
      severity: "BLOCK",
      plainLanguage: "买得进但卖不出，或卖出税接近 100%，属于 V0 一票否决风险。",
      signals: ["canSell=false", "honeypotDetected", "sellTaxPercent>=90"],
      recommendedAction: "不要买入；如果已经持有，先停止加仓，等待人工复核和真实数据源确认。",
    },
    {
      id: "risk-impersonation",
      title: "假冒主流 Token",
      category: "impersonation",
      severity: "HIGH",
      plainLanguage: "使用相似名称、符号或图标仿冒 USDT、USDC、WETH、PEPE 等知名资产。",
      signals: ["symbolImpersonation", "unverifiedContract", "newPair"],
      recommendedAction: "只从官方渠道复制 CA，并用多数据源核对合约地址。",
    },
    {
      id: "risk-owner-privilege",
      title: "Owner 后门",
      category: "owner_privilege",
      severity: "HIGH",
      plainLanguage: "项目方仍可修改税率、暂停交易、拉黑地址或增发，后续风险可能突然变化。",
      signals: ["ownerCanModifyTax", "blacklistFunction", "pausable", "mintable"],
      recommendedAction: "只小额验证，并持续观察权限是否 renounce、timelock 或多签管理。",
    },
    {
      id: "risk-liquidity-unlocked",
      title: "LP 未锁",
      category: "liquidity",
      severity: "MEDIUM",
      plainLanguage: "流动性未锁定或未燃烧时，项目方可能撤池，导致用户无法正常退出。",
      signals: ["lpLocked=false", "lpValueLow", "lpOwnerConcentrated"],
      recommendedAction: "等待 LP 锁定证明；没有证明时，不把短期热度当作安全信号。",
    },
    {
      id: "risk-approval-unlimited",
      title: "无限授权",
      category: "approval",
      severity: "MEDIUM",
      plainLanguage: "授权额度过大时，spender 一旦被攻击或作恶，可能转走对应资产。",
      signals: ["allowance=infinite", "spenderUnknown", "lastUsedAt=null"],
      recommendedAction: "定期复查授权，对长期不用或未知 spender 优先撤销。",
    },
  ] satisfies RiskDatabaseEntry[];

  return entries.map((entry) => ({
    ...entry,
    signals: [...entry.signals],
  }));
}

export function listMockRiskMonitorRules(): RiskMonitorRule[] {
  const rules = [
    {
      id: "monitor-high-risk-token",
      title: "高危 token 复查",
      targetType: "token",
      severity: "HIGH",
      status: "needs_review",
      cadenceLabel: "每 6 小时",
      lastSignalAt: "2026-07-08T03:00:00.000Z",
      signals: ["riskLevelChanged", "honeypotDetected", "sellTaxPercent>=50"],
      explanation: "当已查询 token 出现更高风险信号时提醒用户复查，不自动阻断交易。",
    },
    {
      id: "monitor-approval-change",
      title: "授权变更提醒",
      targetType: "wallet",
      severity: "MEDIUM",
      status: "watching",
      cadenceLabel: "每日",
      lastSignalAt: "2026-07-08T02:30:00.000Z",
      signals: ["newInfiniteApproval", "unknownSpender", "spenderLabelChanged"],
      explanation: "仅提示新增或异常授权，不替用户自动撤销，也不请求签名。",
    },
    {
      id: "monitor-deployer-profile",
      title: "部署者画像变化",
      targetType: "deployer",
      severity: "HIGH",
      status: "watching",
      cadenceLabel: "每 12 小时",
      lastSignalAt: "2026-07-07T22:00:00.000Z",
      signals: ["repeatedDeployments", "linkedRiskLabels", "clusterPending"],
      explanation: "追踪部署者关联风险标签变化，等待真实链上聚类接入后提升准确率。",
    },
    {
      id: "monitor-liquidity-pull",
      title: "LP 撤出风险",
      targetType: "liquidity",
      severity: "BLOCK",
      status: "paused",
      cadenceLabel: "真实 RPC 接入后启用",
      lastSignalAt: null,
      signals: ["lpRemoved", "lpLocked=false", "ownerConcentrated"],
      explanation: "V0 只保留监控规则 contract，真实 LP 撤出监听需要 RPC 和索引器。",
    },
  ] satisfies RiskMonitorRule[];

  return rules.map((rule) => ({
    ...rule,
    signals: [...rule.signals],
  }));
}

export function listMockAssetCleanupPolicies(): AssetCleanupPolicy[] {
  const policies = [
    {
      id: "cleanup-approval-manual-confirm",
      flow: "approval_cleaner",
      title: "授权撤销必须用户确认",
      decision: "manual_confirm",
      description: "撤销授权属于执行类能力，V0 只展示检查清单，不发起签名、不代替用户广播交易。",
      requiredChecks: ["spender 地址", "资产类型", "授权额度", "gas 估算", "二次确认"],
      prohibitedActions: ["自动撤销授权", "请求授权给 ChainVigil 自有合约", "隐藏 spender 风险标签"],
    },
    {
      id: "cleanup-asset-recoverable",
      flow: "asset_barber",
      title: "可回收资产",
      decision: "review",
      description: "有价格、有流动性，且预估收益大于 gas、滑点和风险成本时，才进入后续候选。",
      requiredChecks: ["价格来源", "流动性深度", "预估 gas", "滑点", "风险标签"],
      prohibitedActions: ["自动 swap", "跨链 bridge", "合并未知资产"],
    },
    {
      id: "cleanup-asset-hide",
      flow: "asset_barber",
      title: "建议隐藏资产",
      decision: "hide",
      description: "无价格、无流动性、spam token 或垃圾 NFT 优先建议隐藏，避免诱导交互。",
      requiredChecks: ["是否有价格", "是否有流动性", "是否 spam", "是否钓鱼空投"],
      prohibitedActions: ["点击空投 claim", "授权未知合约", "访问未知站点"],
    },
    {
      id: "cleanup-asset-block",
      flow: "asset_barber",
      title: "禁止处理资产",
      decision: "block",
      description: "疑似貔貅、钓鱼空投或交互风险高资产不进入归集候选。",
      requiredChecks: ["honeypot 信号", "钓鱼标签", "交互风险", "合约验证状态"],
      prohibitedActions: ["自动归集", "自动出售", "自动 claim"],
    },
    {
      id: "cleanup-dust-threshold",
      flow: "dust_scan",
      title: "粉尘归集阈值",
      decision: "review",
      description: "回收价值必须大于 gas、路由费、滑点、bridge fee 和风险成本；V0/V1 不执行粉尘归集。",
      requiredChecks: ["回收价值", "gas", "路由费", "滑点", "bridge fee", "风险成本"],
      prohibitedActions: ["自动 swap", "自动 bridge", "粉尘归集"],
    },
  ] satisfies AssetCleanupPolicy[];

  return policies.map((policy) => ({
    ...policy,
    requiredChecks: [...policy.requiredChecks],
    prohibitedActions: [...policy.prohibitedActions],
  }));
}

export function listMockHighRiskTokens(appBaseUrl = "http://localhost:3000"): HighRiskTokenListItem[] {
  const tokens = [
    {
      id: "high-risk-base-1110",
      chain: "base",
      tokenAddress: "0x1111111111111111111111111111111111111110",
      tokenSymbol: "MVP",
      tokenName: "Mock Vigil Token",
      riskLevel: "BLOCK",
      label: "禁买",
      score: 12,
      reason: "卖出仿真失败 / LP 未锁",
      reportUrl: `${appBaseUrl}/token/base/0x1111111111111111111111111111111111111110`,
      evidenceTags: ["honeypotDetected", "canSell=false", "lpLocked=false"],
      updatedAt: "2026-07-08T04:00:00.000Z",
    },
    {
      id: "high-risk-bsc-2220",
      chain: "bsc",
      tokenAddress: "0x2222222222222222222222222222222222222220",
      tokenSymbol: "FAKE",
      tokenName: "Fake Router Token",
      riskLevel: "BLOCK",
      label: "禁买",
      score: 18,
      reason: "疑似貔貅 / 黑名单权限",
      reportUrl: `${appBaseUrl}/token/bsc/0x2222222222222222222222222222222222222220`,
      evidenceTags: ["honeypotDetected", "blacklistFunction", "ownerCanModifyTax"],
      updatedAt: "2026-07-08T04:10:00.000Z",
    },
    {
      id: "high-risk-eth-3330",
      chain: "ethereum",
      tokenAddress: "0x3333333333333333333333333333333333333330",
      tokenSymbol: "MIMIC",
      tokenName: "Mimic Bluechip Token",
      riskLevel: "HIGH",
      label: "高危",
      score: 31,
      reason: "Owner 可改税 / 持仓集中",
      reportUrl: `${appBaseUrl}/token/ethereum/0x3333333333333333333333333333333333333330`,
      evidenceTags: ["ownerCanModifyTax", "top10HolderPercent=82", "sourceVerified=false"],
      updatedAt: "2026-07-08T04:20:00.000Z",
    },
  ] satisfies HighRiskTokenListItem[];

  return tokens.map((token) => ({
    ...token,
    evidenceTags: [...token.evidenceTags],
  }));
}

export function listMockFakeTokenExamples(): FakeTokenExample[] {
  const examples = [
    {
      id: "fake-usdt",
      title: "假 USDT",
      impersonates: "USDT",
      chain: "bsc",
      riskLevel: "HIGH",
      description: "名称和 symbol 相似，但合约地址不匹配官方地址，常搭配假交易截图传播。",
      signals: ["symbolImpersonation", "unverifiedContract", "newPair"],
      recommendedAction: "只从官方渠道复制 CA，并核对区块浏览器、官网和主流行情页。",
    },
    {
      id: "fake-pepe",
      title: "假 PEPE",
      impersonates: "PEPE",
      chain: "base",
      riskLevel: "BLOCK",
      description: "借热门币热度传播，常伴随高税、卖出限制或短时间刷量。",
      signals: ["trendingMimic", "sellTaxPercent>=50", "canSell=false"],
      recommendedAction: "不要追陌生群链接；先查 CA，再看是否可卖和 LP 状态。",
    },
    {
      id: "fake-airdrop-claim",
      title: "假空投 Token",
      impersonates: "空投 claim",
      chain: "ethereum",
      riskLevel: "HIGH",
      description: "通过钱包里凭空出现的 Token/NFT 诱导访问钓鱼站点或授权恶意 spender。",
      signals: ["spamAirdrop", "unknownClaimSite", "approvalPhishing"],
      recommendedAction: "不要点击资产备注里的链接，不要给未知 spender 授权。",
    },
  ] satisfies FakeTokenExample[];

  return examples.map((example) => ({
    ...example,
    signals: [...example.signals],
  }));
}

export function listMockRiskReviewQueue(appBaseUrl = "http://localhost:3000"): AdminRiskReviewItem[] {
  const items = [
    {
      id: "risk-review-base-1110",
      chain: "base",
      tokenAddress: "0x1111111111111111111111111111111111111110",
      tokenSymbol: "MVP",
      riskLevel: "BLOCK",
      label: "禁买",
      score: 12,
      submittedBy: "system",
      status: "pending",
      reason: "卖出仿真失败且 LP 锁定状态未确认，需要人工复核是否加入高危 CA 列表。",
      signals: ["honeypotDetected", "canSell=false", "lpLocked=false"],
      reportUrl: `${appBaseUrl}/token/base/0x1111111111111111111111111111111111111110`,
      createdAt: "2026-07-08T00:20:00.000Z",
    },
    {
      id: "risk-review-base-1113",
      chain: "base",
      tokenAddress: "0x1111111111111111111111111111111111111113",
      tokenSymbol: "MVP",
      riskLevel: "HIGH",
      label: "高危",
      score: 34,
      submittedBy: "telegram_group",
      status: "needs_data",
      reason: "群内多次查询后触发高税率和黑名单函数信号，等待真实数据源补证。",
      signals: ["sellTaxPercent=28", "blacklistFunction=true", "top10HolderPercent=72"],
      reportUrl: `${appBaseUrl}/token/base/0x1111111111111111111111111111111111111113`,
      createdAt: "2026-07-08T00:35:00.000Z",
    },
    {
      id: "risk-review-base-1115",
      chain: "base",
      tokenAddress: "0x1111111111111111111111111111111111111115",
      tokenSymbol: "MVP",
      riskLevel: "BLOCK",
      label: "禁买",
      score: 12,
      submittedBy: "user_report",
      status: "escalated",
      reason: "用户举报疑似仿盘，mock 报告命中一票否决项，需后续接入审计写入后再支持处理动作。",
      signals: ["userReport", "honeypotDetected", "sourceVerified=false"],
      reportUrl: `${appBaseUrl}/token/base/0x1111111111111111111111111111111111111115`,
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
}: MockRiskInput): TokenRiskReport {
  const parsed = parseTokenInput(input, chain ?? "base");
  const normalizedAddress = parsed.address.toLowerCase();
  const lastNibble = Number.parseInt(normalizedAddress.slice(-1), 16);
  const isCritical = lastNibble % 5 === 0;
  const isHigh = !isCritical && lastNibble % 3 === 0;
  const checkedAt = new Date().toISOString();
  const reasons: RiskReason[] = [
    {
      severity: isCritical ? "critical" : "high",
      title: isCritical ? "卖出路径存在异常" : "Owner 权限偏高",
      explanation: isCritical
        ? "mock 检测显示卖出仿真失败，存在买入后无法正常退出的风险。"
        : "合约 owner 仍保留关键参数调整权限，后续可能改变税率或交易规则。",
      evidence: isCritical ? { canSell: false } : { ownerCanModifyTax: true },
    },
    {
      severity: "medium",
      title: "LP 锁定状态未确认",
      explanation: "当前 mock 数据无法确认 LP 已锁定或燃烧，需要接入真实数据源后复核。",
      evidence: { lpLocked: false },
    },
    {
      severity: "medium",
      title: "前 10 持仓集中度偏高",
      explanation: "头部地址持仓比例较高，价格可能受到少数地址卖出的明显影响。",
      evidence: { top10HolderPercent: isHigh ? 72 : 48 },
    },
  ];

  const riskLevel = isCritical ? "BLOCK" : isHigh ? "HIGH" : "MEDIUM";
  const label = isCritical ? "禁买" : isHigh ? "高危" : "谨慎";
  const score = isCritical ? 12 : isHigh ? 34 : 58;
  const summary = isCritical
    ? "疑似貔貅盘：卖出仿真失败，并伴随 LP 未锁等风险。"
    : isHigh
      ? "高危：未发现一票否决项，但合约权限和持仓结构风险较高。"
      : "谨慎：当前未发现明确致命风险，但仍需小额验证并关注权限与流动性。";
  const recommendation = isCritical
    ? "建议不要买入。如果已持有，优先尝试小额卖出，不要继续加仓。"
    : "不构成投资建议。若仍要交互，请使用极小金额，并在交易前重新检测。";
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
    shareText: `ChainVigil AI 检测结果：${label}｜${summary} ${reportUrl}`,
  };
}

export function buildMockWalletHealthReport(params: {
  address: string;
  chain?: ChainId | undefined;
  appBaseUrl?: string;
}): WalletHealthReport {
  const normalizedAddress = params.address.trim().toLowerCase();

  if (!isAddress(normalizedAddress)) {
    throw new Error("请输入有效的 EVM 钱包地址。");
  }

  const chain = params.chain ?? "base";
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
      allowanceLabel: "无限授权",
      lastUsedAt: null,
      riskLevel: "HIGH",
      riskReasons: ["无限授权", "长期未使用", "spender 风险标签未确认"],
      recommendedAction: "建议优先复查，确认不用后撤销授权。",
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
      riskReasons: ["未知 operator", "授权范围覆盖全部 NFT"],
      recommendedAction: "如果不是常用市场或协议，建议撤销。",
    },
    {
      id: `${chain}:dex:${normalizedAddress}`,
      chain,
      assetSymbol: "WETH",
      assetType: "ERC20",
      spenderAddress: "0x4444444444444444444444444444444444444444",
      spenderLabel: "Mock DEX Router",
      allowanceLabel: "额度较低",
      lastUsedAt: "2026-07-01T00:00:00.000Z",
      riskLevel: "LOW",
      riskReasons: ["近期使用", "额度较低"],
      recommendedAction: "暂未发现明显授权风险，仍可定期复查。",
    },
  ];

  return {
    id: `${chain}:${normalizedAddress}:${checkedAt}`,
    address: normalizedAddress,
    summary: {
      score,
      label: score >= 75 ? "相对健康" : score >= 55 ? "需要关注" : "高风险",
      highRiskApprovals,
      infiniteApprovals,
      suspiciousTokens,
      spamNfts,
      dustValueUsd,
    },
    approvals,
    checkedAt,
    reportUrl: `${appBaseUrl}/wallet/${normalizedAddress}/health`,
    disclaimer:
      "钱包体检为只读风险提示，不会请求签名、不托管资产，也不会自动执行撤销或交易。",
  };
}
