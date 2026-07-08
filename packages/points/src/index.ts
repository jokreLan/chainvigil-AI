import type {
  PointEvent,
  PointEventStatus,
  PointEventType,
  PointLedger,
  PointLedgerSummary,
} from "@chainvigil/types";

const pointProgramMeta = {
  pointsName: "哨点",
  englishName: "Vigil Points",
  shortName: "VP",
  disclaimer: "VP 用于产品权益和生态贡献记录，不承诺固定兑换平台币。",
} as const;

const pointRules: Record<PointEventType, { points: number; ledger: PointLedger; reason: string }> = {
  FIRST_CA_CHECK: { points: 20, ledger: "xp", reason: "首次完成 CA 安检" },
  DAILY_FIRST_CA_CHECK: { points: 5, ledger: "xp", reason: "每日首次 CA 安检" },
  FIRST_NEW_CA_CHECK: { points: 10, ledger: "xp", reason: "首次检测新的 CA" },
  REPORT_SHARED: { points: 5, ledger: "growth_reward", reason: "分享风险报告" },
  SHARE_EFFECTIVE_VISIT: { points: 3, ledger: "growth_reward", reason: "分享带来有效访问" },
  SHARE_EFFECTIVE_CA_CHECK: {
    points: 15,
    ledger: "growth_reward",
    reason: "分享带来有效 CA 检测",
  },
  RISK_REPORT_SUBMITTED: {
    points: 30,
    ledger: "security_contribution",
    reason: "提交高危 CA 举报",
  },
};

export function createPendingPointEvent(params: {
  type: PointEventType;
  subjectId?: string;
  actorId?: string;
  idempotencyKey: string;
}): PointEvent {
  const rule = pointRules[params.type];

  const event: PointEvent = {
    id: crypto.randomUUID(),
    type: params.type,
    ledger: rule.ledger,
    status: "pending",
    points: rule.points,
    idempotencyKey: params.idempotencyKey,
    reason: rule.reason,
    createdAt: new Date().toISOString(),
  };

  if (params.subjectId) {
    event.subjectId = params.subjectId;
  }

  if (params.actorId) {
    event.actorId = params.actorId;
  }

  return event;
}

export function listPointRules() {
  return pointRules;
}

const mockPointLedgerEvents = [
  {
    id: "point-mock-first-check",
    type: "FIRST_CA_CHECK",
    ledger: "xp",
    status: "confirmed",
    points: 20,
    subjectId: "visitor:mock",
    idempotencyKey: "mock:first-ca-check",
    reason: pointRules.FIRST_CA_CHECK.reason,
    createdAt: "2026-07-08T00:00:00.000Z",
  },
  {
    id: "point-mock-report-shared",
    type: "REPORT_SHARED",
    ledger: "growth_reward",
    status: "pending",
    points: 5,
    subjectId: "visitor:mock",
    idempotencyKey: "mock:report-shared",
    reason: pointRules.REPORT_SHARED.reason,
    createdAt: "2026-07-08T00:05:00.000Z",
  },
  {
    id: "point-mock-risk-report",
    type: "RISK_REPORT_SUBMITTED",
    ledger: "security_contribution",
    status: "pending",
    points: 30,
    subjectId: "visitor:mock",
    idempotencyKey: "mock:risk-report-submitted",
    reason: pointRules.RISK_REPORT_SUBMITTED.reason,
    createdAt: "2026-07-08T00:10:00.000Z",
  },
] satisfies PointEvent[];

function sumEvents(events: PointEvent[], status: PointEventStatus): number {
  return events
    .filter((event) => event.status === status)
    .reduce((total, event) => total + event.points, 0);
}

export function listMockPointLedgerEvents(subjectId = "visitor:mock"): PointEvent[] {
  return mockPointLedgerEvents.map((event) => ({
    ...event,
    subjectId,
  }));
}

export function getMockPointLedgerSummary(subjectId = "visitor:mock"): PointLedgerSummary {
  const recentEvents = listMockPointLedgerEvents(subjectId);
  const ledgers: PointLedger[] = ["xp", "security_contribution", "growth_reward"];

  return {
    pointsName: pointProgramMeta.pointsName,
    englishName: pointProgramMeta.englishName,
    shortName: pointProgramMeta.shortName,
    subjectId,
    totalPending: sumEvents(recentEvents, "pending"),
    totalConfirmed: sumEvents(recentEvents, "confirmed"),
    totalRejected: sumEvents(recentEvents, "rejected"),
    balances: ledgers.map((ledger) => {
      const events = recentEvents.filter((event) => event.ledger === ledger);

      return {
        ledger,
        pending: sumEvents(events, "pending"),
        confirmed: sumEvents(events, "confirmed"),
        rejected: sumEvents(events, "rejected"),
      };
    }),
    recentEvents,
    disclaimer: pointProgramMeta.disclaimer,
  };
}

export function getPointProgram() {
  return {
    ...pointProgramMeta,
    rules: pointRules,
  };
}
