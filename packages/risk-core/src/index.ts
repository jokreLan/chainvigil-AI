import { parseTokenInput } from "@chainvigil/chain";
import { isAddress } from "viem";
import type {
  AdminRiskLabelItem,
  AdminRiskReviewItem,
  ApprovalRiskItem,
  ChainId,
  RiskReason,
  TokenRiskReport,
  WalletHealthReport,
} from "@chainvigil/types";

export interface MockRiskInput {
  input: string;
  chain?: ChainId | undefined;
  appBaseUrl?: string;
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
