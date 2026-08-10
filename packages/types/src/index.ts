export type ChainId =
  | "solana"
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

export type ReportExecutionMode = "mock" | "live";
export type ReportConfidence = "UNASSESSED" | "LOW" | "MEDIUM" | "HIGH";

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
  /** Always present so clients cannot mistake mock for live chain evidence. */
  mode: ReportExecutionMode;
  confidence: ReportConfidence;
  confidenceScore: number;
}

export interface TokenCheckRequest {
  input: string;
  chain?: ChainId;
  source?: "web" | "telegram" | "api" | "admin";
  referrer?: string;
  forceRefresh?: boolean;
  /** User-facing copy language for mock/live reports. */
  locale?: "zh" | "en";
}

export interface TokenCheckResponse {
  report: TokenRiskReport;
  mode?: ReportExecutionMode;
  confidence?: ReportConfidence;
}

export interface AdminTokenReportIndexItem {
  id: string;
  chain: ChainId;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  riskLevel: RiskLevel;
  label: string;
  score: number | null;
  summary: string;
  checkedAt: string;
  reportUrl: string;
  source: "web" | "telegram" | "api" | "admin";
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
  mode: ReportExecutionMode;
  confidence: ReportConfidence;
  confidenceScore: number;
}

export interface WalletHealthRequest {
  address: string;
  chain?: ChainId;
  source?: "web" | "api" | "admin";
  /** User-facing copy language for mock/live reports. */
  locale?: "zh" | "en";
}

export interface WalletHealthResponse {
  report: WalletHealthReport;
  mode?: ReportExecutionMode;
  confidence?: ReportConfidence;
}

export interface WalletWatchlistItem {
  id: string;
  address: string;
  chain: ChainId;
  label: string;
  status: "checked" | "pending_check" | "watching";
  lastCheckedAt: string | null;
  reportUrl: string;
  summaryLabel: string;
  highRiskApprovals: number | null;
  note: string;
}

export interface WalletCheckCapability {
  id: string;
  title: string;
  category: "approval" | "asset" | "nft" | "dust" | "score";
  riskLevel: ApprovalRiskLevel;
  description: string;
  requiresSignature: false;
  v0Action: "read_only_check" | "estimate_only" | "score_only";
  prohibitedActions: string[];
}

export interface UserPreferenceSetting {
  id: string;
  title: string;
  category: "language" | "risk_alert" | "profile" | "privacy";
  valueLabel: string;
  description: string;
  editableInV0: false;
}

export interface RiskDatabaseEntry {
  id: string;
  title: string;
  category: "honeypot" | "impersonation" | "owner_privilege" | "liquidity" | "approval";
  severity: RiskLevel;
  plainLanguage: string;
  signals: string[];
  recommendedAction: string;
}

export interface RiskMonitorRule {
  id: string;
  title: string;
  targetType: "token" | "wallet" | "deployer" | "liquidity";
  severity: RiskLevel;
  status: "watching" | "needs_review" | "paused";
  cadenceLabel: string;
  lastSignalAt: string | null;
  signals: string[];
  explanation: string;
}

export interface AssetCleanupPolicy {
  id: string;
  flow: "approval_cleaner" | "asset_barber" | "dust_scan";
  title: string;
  decision: "review" | "hide" | "block" | "manual_confirm";
  description: string;
  requiredChecks: string[];
  prohibitedActions: string[];
}

export interface HighRiskTokenListItem {
  id: string;
  chain: ChainId;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  riskLevel: RiskLevel;
  label: string;
  score: number | null;
  reason: string;
  reportUrl: string;
  evidenceTags: string[];
  updatedAt: string;
}

export interface FakeTokenExample {
  id: string;
  title: string;
  impersonates: string;
  chain: ChainId;
  riskLevel: RiskLevel;
  description: string;
  signals: string[];
  recommendedAction: string;
}

export interface RiskEducationLesson {
  id: string;
  title: string;
  category: "token" | "liquidity" | "approval" | "disclaimer";
  difficulty: "beginner";
  summary: string;
  relatedSignals: string[];
  recommendedAction: string;
}

export type AdminRiskReviewStatus = "pending" | "needs_data" | "escalated";

export interface AdminRiskReviewItem {
  id: string;
  chain: ChainId;
  tokenAddress: string;
  tokenSymbol: string;
  riskLevel: RiskLevel;
  label: string;
  score: number | null;
  submittedBy: "system" | "user_report" | "telegram_group";
  status: AdminRiskReviewStatus;
  reason: string;
  signals: string[];
  reportUrl: string;
  createdAt: string;
}

export type AdminRiskLabelTargetType = "token" | "deployer" | "spender" | "domain";
export type AdminRiskLabelStatus = "active" | "pending_review" | "retired";
export type AdminRiskLabelSource = "system" | "admin_seed" | "user_report";

export interface AdminRiskLabelItem {
  id: string;
  targetType: AdminRiskLabelTargetType;
  chain: ChainId | null;
  target: string;
  label: string;
  riskLevel: RiskLevel;
  status: AdminRiskLabelStatus;
  source: AdminRiskLabelSource;
  confidence: number;
  reason: string;
  evidenceTags: string[];
  createdAt: string;
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

/** Product benefits redeemable with confirmed VP (second growth engine). */
export type VpRedemptionStatus = "preview" | "coming_soon" | "active";

export interface VpRedemptionItem {
  id: string;
  title: string;
  description: string;
  costVp: number;
  category: "checks" | "monitor" | "pro" | "group";
  status: VpRedemptionStatus;
  cashAlternativeLabel?: string;
  highlight?: boolean;
}

export type GrowthChannelType = "kol" | "telegram_group" | "x_thread";
export type GrowthChannelStatus = "active" | "paused" | "pending_review";

export interface GrowthChannel {
  id: string;
  type: GrowthChannelType;
  name: string;
  status: GrowthChannelStatus;
  owner: string;
  referralCode: string;
  visits: number;
  effectiveVisits: number;
  effectiveCaChecks: number;
  pendingVp: number;
  confirmedVp: number;
  conversionRate: number;
  note: string;
  updatedAt: string;
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
  brand: "ChainVigil";
  chineseName: "ChainVigil";
  slogan: "买币前，先查 CA。";
  version: "v0";
  mode: "mock" | "production";
  supportedChains: ChainId[];
  commitSha?: string;
  generatedAt: string;
}

export type WorkerJobName = "risk.refresh" | "points.settle" | "report.snapshot";

export interface WorkerJobDefinition {
  name: WorkerJobName;
  cadenceSeconds: number;
  enabled: boolean;
  mode: "mock";
  description: string;
}

export interface WorkerHealth {
  ok: boolean;
  service: "chainvigil-worker";
  mode: "mock" | "production";
  cache: {
    name: string;
    mode: "mock" | "live" | "disabled";
    ready: boolean;
    requiredEnv?: string;
  };
  jobs: WorkerJobDefinition[];
}

export interface TelegramGroupSettings {
  id: string;
  telegramChatId: string;
  title: string;
  autoDetectEnabled: boolean;
  highRiskAlerts: boolean;
  dailyCheckLimit: number;
  language: "zh" | "en";
  checksToday: number;
  highRiskAlertsToday: number;
  lastCheckedAt: string | null;
}

export interface TelegramCommand {
  command: string;
  description: string;
}
