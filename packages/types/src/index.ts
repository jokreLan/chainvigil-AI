export type ChainId =
  | "ethereum"
  | "bsc"
  | "base"
  | "arbitrum"
  | "polygon"
  | "optimism";

export type RiskLevel =
  | "BLOCK"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "UNKNOWN";

export type ApprovalRiskLevel = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";

export type RiskReasonSeverity = "critical" | "high" | "medium" | "low";

export interface RiskReason {
  severity: RiskReasonSeverity;
  title: string;
  explanation: string;
  evidence?: Record<string, unknown>;
}

export interface TokenRiskEvidence {
  buyTaxPercent?: number;
  sellTaxPercent?: number;
  transferTaxPercent?: number;
  canBuy?: boolean;
  canSell?: boolean;
  honeypotDetected?: boolean;
  ownerCanModifyTax?: boolean;
  blacklistFunction?: boolean;
  whitelistFunction?: boolean;
  pausable?: boolean;
  mintable?: boolean;
  sourceVerified?: boolean;
  proxyContract?: boolean;
  lpValueUsd?: number;
  lpLocked?: boolean;
  holderCount?: number;
  top10HolderPercent?: number;
  deployerRiskLabel?: string;
}

export interface TokenRiskReport {
  id: string;
  chain: ChainId;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  score: number | null;
  riskLevel: RiskLevel;
  label: string;
  summary: string;
  recommendation: string;
  reasons: RiskReason[];
  evidence: TokenRiskEvidence;
  checkedAt: string;
  reportUrl: string;
  shareText: string;
}

export interface TokenCheckRequest {
  input: string;
  chain?: ChainId;
  source?: "web" | "telegram" | "api" | "admin";
  referrer?: string;
  forceRefresh?: boolean;
}

export interface TokenCheckResponse {
  report: TokenRiskReport;
}

export interface WalletHealthSummary {
  score: number;
  label: string;
  highRiskApprovals: number;
  infiniteApprovals: number;
  suspiciousTokens: number;
  spamNfts: number;
  dustValueUsd: number;
}

export interface ApprovalRiskItem {
  id: string;
  chain: ChainId;
  assetSymbol: string;
  assetType: "ERC20" | "ERC721" | "ERC1155";
  spenderAddress: string;
  spenderLabel: string;
  allowanceLabel: string;
  lastUsedAt: string | null;
  riskLevel: ApprovalRiskLevel;
  riskReasons: string[];
  recommendedAction: string;
}

export interface WalletHealthReport {
  id: string;
  address: string;
  summary: WalletHealthSummary;
  approvals: ApprovalRiskItem[];
  checkedAt: string;
  reportUrl: string;
  disclaimer: string;
}

export interface WalletHealthRequest {
  address: string;
  chain?: ChainId;
  source?: "web" | "api" | "admin";
}

export interface WalletHealthResponse {
  report: WalletHealthReport;
}

export type PointEventType =
  | "FIRST_CA_CHECK"
  | "DAILY_FIRST_CA_CHECK"
  | "FIRST_NEW_CA_CHECK"
  | "REPORT_SHARED"
  | "SHARE_EFFECTIVE_VISIT"
  | "SHARE_EFFECTIVE_CA_CHECK"
  | "RISK_REPORT_SUBMITTED";

export type PointEventStatus = "pending" | "confirmed" | "rejected";

export type PointLedger = "xp" | "security_contribution" | "growth_reward";

export interface PointEvent {
  id: string;
  type: PointEventType;
  ledger: PointLedger;
  status: PointEventStatus;
  points: number;
  subjectId?: string;
  actorId?: string;
  idempotencyKey: string;
  reason: string;
  createdAt: string;
}

export interface PointLedgerBalance {
  ledger: PointLedger;
  pending: number;
  confirmed: number;
  rejected: number;
}

export interface PointLedgerSummary {
  subjectId: string;
  pointsName: "哨点";
  englishName: "Vigil Points";
  shortName: "VP";
  totalPending: number;
  totalConfirmed: number;
  totalRejected: number;
  balances: PointLedgerBalance[];
  recentEvents: PointEvent[];
  disclaimer: string;
}

export type AdminAuditAction =
  | "risk_report.reviewed"
  | "risk_label.created"
  | "risk_label.updated"
  | "telegram_group.updated"
  | "data_source.checked"
  | "system_readiness.viewed";

export interface AdminAuditLog {
  id: string;
  actorId: string;
  action: AdminAuditAction;
  target: string;
  reason: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ServiceMeta {
  service: string;
  brand: "ChainVigil AI";
  chineseName: "链哨 AI";
  slogan: "买币前，先查 CA。";
  version: "v0";
  mode: "mock" | "production";
  supportedChains: ChainId[];
  commitSha?: string;
  generatedAt: string;
}
