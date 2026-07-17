CREATE TYPE "RiskLevel" AS ENUM ('BLOCK', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN');
CREATE TYPE "PointEventStatus" AS ENUM ('pending', 'confirmed', 'rejected');
CREATE TYPE "PointLedger" AS ENUM ('xp', 'security_contribution', 'growth_reward');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "wallet" TEXT,
  "telegramId" TEXT,
  "referralCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "TokenReport" (
  "id" TEXT NOT NULL,
  "chain" TEXT NOT NULL,
  "tokenAddress" TEXT NOT NULL,
  "tokenName" TEXT,
  "tokenSymbol" TEXT,
  "riskLevel" "RiskLevel" NOT NULL,
  "score" INTEGER,
  "summary" TEXT NOT NULL,
  "recommendation" TEXT NOT NULL,
  "checkedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TokenReport_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "TokenRiskSnapshot" (
  "id" TEXT NOT NULL,
  "tokenReportId" TEXT NOT NULL,
  "riskLevel" "RiskLevel" NOT NULL,
  "score" INTEGER,
  "evidence" JSONB NOT NULL,
  "reasons" JSONB NOT NULL,
  "checkedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TokenRiskSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "RiskFactor" (
  "id" TEXT NOT NULL,
  "tokenReportId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "explanation" TEXT NOT NULL,
  "evidence" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RiskFactor_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PointEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "type" TEXT NOT NULL,
  "ledger" "PointLedger" NOT NULL,
  "status" "PointEventStatus" NOT NULL DEFAULT 'pending',
  "points" INTEGER NOT NULL,
  "subjectType" TEXT,
  "subjectId" TEXT,
  "idempotencyKey" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewerId" TEXT,
  CONSTRAINT "PointEvent_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ReferralEvent" (
  "id" TEXT NOT NULL,
  "referralCode" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "visitorHash" TEXT,
  "subjectId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReferralEvent_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "TelegramGroup" (
  "id" TEXT NOT NULL,
  "telegramChatId" TEXT NOT NULL,
  "title" TEXT,
  "autoDetectEnabled" BOOLEAN NOT NULL DEFAULT false,
  "highRiskAlerts" BOOLEAN NOT NULL DEFAULT true,
  "dailyCheckLimit" INTEGER NOT NULL DEFAULT 100,
  "language" TEXT NOT NULL DEFAULT 'zh',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TelegramGroup_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AdminAuditLog" (
  "id" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "target" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
CREATE INDEX "TokenReport_riskLevel_idx" ON "TokenReport"("riskLevel");
CREATE INDEX "TokenReport_checkedAt_idx" ON "TokenReport"("checkedAt");
CREATE UNIQUE INDEX "TokenReport_chain_tokenAddress_key" ON "TokenReport"("chain", "tokenAddress");
CREATE INDEX "RiskFactor_key_idx" ON "RiskFactor"("key");
CREATE INDEX "RiskFactor_severity_idx" ON "RiskFactor"("severity");
CREATE UNIQUE INDEX "PointEvent_idempotencyKey_key" ON "PointEvent"("idempotencyKey");
CREATE INDEX "PointEvent_type_idx" ON "PointEvent"("type");
CREATE INDEX "PointEvent_status_idx" ON "PointEvent"("status");
CREATE INDEX "PointEvent_ledger_idx" ON "PointEvent"("ledger");
CREATE INDEX "ReferralEvent_referralCode_idx" ON "ReferralEvent"("referralCode");
CREATE INDEX "ReferralEvent_action_idx" ON "ReferralEvent"("action");
CREATE UNIQUE INDEX "TelegramGroup_telegramChatId_key" ON "TelegramGroup"("telegramChatId");

ALTER TABLE "TokenRiskSnapshot"
  ADD CONSTRAINT "TokenRiskSnapshot_tokenReportId_fkey"
  FOREIGN KEY ("tokenReportId") REFERENCES "TokenReport"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RiskFactor"
  ADD CONSTRAINT "RiskFactor_tokenReportId_fkey"
  FOREIGN KEY ("tokenReportId") REFERENCES "TokenReport"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PointEvent"
  ADD CONSTRAINT "PointEvent_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
