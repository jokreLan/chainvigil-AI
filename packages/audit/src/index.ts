import type { AdminAuditAction, AdminAuditLog, ChainId } from "@chainvigil/types";

const redacted = "[redacted]";
const secretKeyPattern = /(api[_-]?key|secret|token|password|authorization|private[_-]?key)/i;

export function redactAuditMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      key,
      secretKeyPattern.test(key) ? redacted : value,
    ]),
  );
}

export function createAdminAuditLog(params: {
  actorId: string;
  action: AdminAuditAction;
  target: string;
  reason: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}): AdminAuditLog {
  const log: AdminAuditLog = {
    id: crypto.randomUUID(),
    actorId: params.actorId,
    action: params.action,
    target: params.target,
    reason: params.reason,
    createdAt: (params.createdAt ?? new Date()).toISOString(),
  };

  if (params.metadata) {
    log.metadata = redactAuditMetadata(params.metadata);
  }

  return log;
}

export function tokenRiskTarget(chain: ChainId, tokenAddress: string): string {
  return `token:${chain}:${tokenAddress.toLowerCase()}`;
}

export function telegramGroupTarget(chatId: string | number): string {
  return `telegram-group:${chatId}`;
}

export function listMockAdminAuditLogs(): AdminAuditLog[] {
  return [
    createAdminAuditLog({
      actorId: "admin-local",
      action: "risk_report.reviewed",
      target: tokenRiskTarget("base", "0x1111111111111111111111111111111111111110"),
      reason: "V0 mock: 人工复核高危 CA 报告。",
      metadata: {
        previousLabel: "高危",
        nextLabel: "禁买",
        goplusApiKey: "mock-secret",
      },
      createdAt: new Date("2026-07-08T08:00:00.000Z"),
    }),
    createAdminAuditLog({
      actorId: "admin-local",
      action: "telegram_group.updated",
      target: telegramGroupTarget(-100123456),
      reason: "V0 mock: 调整群组自动检测配置。",
      metadata: {
        autoDetectEnabled: true,
        dailyCheckLimit: 100,
        telegramBotToken: "mock-token",
      },
      createdAt: new Date("2026-07-08T08:05:00.000Z"),
    }),
    createAdminAuditLog({
      actorId: "admin-local",
      action: "data_source.checked",
      target: "data-source:goplus",
      reason: "V0 mock: 查看数据源就绪状态。",
      metadata: {
        mode: "mock",
        missingEnv: ["GOPLUS_API_KEY"],
        password: "mock-password",
      },
      createdAt: new Date("2026-07-08T08:10:00.000Z"),
    }),
  ];
}
