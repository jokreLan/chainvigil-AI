import type {
  GrowthChannel,
  PointEvent,
  PointEventStatus,
  PointEventType,
  PointLedger,
  PointLedgerSummary,
  VpRedemptionItem,
} from "@chainvigil/types";

export type PointsLocale = "zh" | "en";

function normalizeLocale(locale?: string | null): PointsLocale {
  return locale === "en" ? "en" : "zh";
}

function pick(locale: PointsLocale, zh: string, en: string): string {
  return locale === "en" ? en : zh;
}

const pointProgramMeta = {
  pointsName: "哨点",
  englishName: "Vigil Points",
  shortName: "VP",
  cashOffsetCapPercent: 30,
} as const;

function pointRulesFor(
  locale: PointsLocale,
): Record<PointEventType, { points: number; ledger: PointLedger; reason: string }> {
  return {
    FIRST_CA_CHECK: {
      points: 20,
      ledger: "xp",
      reason: pick(locale, "首次完成 CA 安检", "First CA check completed"),
    },
    DAILY_FIRST_CA_CHECK: {
      points: 5,
      ledger: "xp",
      reason: pick(locale, "每日首次 CA 安检", "Daily first CA check"),
    },
    FIRST_NEW_CA_CHECK: {
      points: 10,
      ledger: "xp",
      reason: pick(locale, "首次检测新的 CA", "First check of a new CA"),
    },
    REPORT_SHARED: {
      points: 5,
      ledger: "growth_reward",
      reason: pick(locale, "分享风险报告", "Shared a risk report"),
    },
    SHARE_EFFECTIVE_VISIT: {
      points: 3,
      ledger: "growth_reward",
      reason: pick(locale, "分享带来有效访问", "Share drove an effective visit"),
    },
    SHARE_EFFECTIVE_CA_CHECK: {
      points: 15,
      ledger: "growth_reward",
      reason: pick(locale, "分享带来有效 CA 检测", "Share drove an effective CA check"),
    },
    RISK_REPORT_SUBMITTED: {
      points: 30,
      ledger: "security_contribution",
      reason: pick(locale, "提交高危 CA 举报", "Submitted a high-risk CA report"),
    },
  };
}

/** Default zh rules for ledger mock / createPendingPointEvent compatibility. */
const pointRules = pointRulesFor("zh");

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

export function listPointRules(locale?: PointsLocale | null) {
  return pointRulesFor(normalizeLocale(locale));
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

export function getMockPointLedgerSummary(
  subjectId = "visitor:mock",
  locale?: PointsLocale | null,
): PointLedgerSummary {
  const lang = normalizeLocale(locale);
  const recentEvents = listMockPointLedgerEvents(subjectId);
  const ledgers: PointLedger[] = ["xp", "security_contribution", "growth_reward"];

  const disclaimer = pick(
    lang,
    "VP 为产品权益积分，用于兑换查询额度、监控与会员体验；不构成代币、收益承诺或投资建议，不可提现、不可转让。",
    "VP is a product perk ledger for check quotas, monitors, and membership trials — not a token, yield promise, or investment advice; non-withdrawable and non-transferable.",
  );

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
    disclaimer,
  };
}

export function listMockGrowthChannels(locale?: PointsLocale | null): GrowthChannel[] {
  const lang = normalizeLocale(locale);
  const channels = [
    {
      id: "channel-kol-001",
      type: "kol",
      name: "KOL-001",
      status: "active",
      owner: "growth-local",
      referralCode: "KOL001",
      visits: 1280,
      effectiveVisits: 318,
      effectiveCaChecks: 96,
      pendingVp: 420,
      confirmedVp: 860,
      conversionRate: 0.25,
      note: pick(
        lang,
        "按有效访问和有效 CA 检测结算，不奖励空点击。",
        "Settles on effective visits and CA checks — no empty-click rewards.",
      ),
      updatedAt: "2026-07-08T02:00:00.000Z",
    },
    {
      id: "channel-tg-base",
      type: "telegram_group",
      name: "TG-GROUP-BASE",
      status: "pending_review",
      owner: "telegram-admin",
      referralCode: "TGBASE",
      visits: 860,
      effectiveVisits: 172,
      effectiveCaChecks: 64,
      pendingVp: 260,
      confirmedVp: 510,
      conversionRate: 0.2,
      note: pick(
        lang,
        "等待真实群组归因和反作弊策略接入后再确认待结算 VP。",
        "Pending VP waits for live group attribution and anti-abuse rules.",
      ),
      updatedAt: "2026-07-08T02:10:00.000Z",
    },
    {
      id: "channel-x-weekly",
      type: "x_thread",
      name: "X-THREAD-WEEKLY",
      status: "paused",
      owner: "content-local",
      referralCode: "XWEEKLY",
      visits: 430,
      effectiveVisits: 86,
      effectiveCaChecks: 21,
      pendingVp: 0,
      confirmedVp: 180,
      conversionRate: 0.2,
      note: pick(
        lang,
        "旧周报入口暂停新增奖励，保留历史统计。",
        "Legacy weekly entry paused for new rewards; history kept.",
      ),
      updatedAt: "2026-07-08T02:20:00.000Z",
    },
  ] satisfies GrowthChannel[];

  return channels.map((channel) => ({ ...channel }));
}

export function listVpRedemptions(locale?: PointsLocale | null): VpRedemptionItem[] {
  const lang = normalizeLocale(locale);
  const vpRedemptions: VpRedemptionItem[] = [
    {
      id: "redeem.extra_checks_10",
      title: pick(lang, "额外安检 10 次", "Extra 10 CA checks"),
      description: pick(
        lang,
        "当日查询额度用尽后，用哨点续航继续查 CA。",
        "When daily quota is used up, spend VP to keep scanning CAs.",
      ),
      costVp: 40,
      category: "checks",
      status: "preview",
      cashAlternativeLabel: pick(lang, "Pro 会员含更高额度", "Pro includes higher quotas"),
      highlight: true,
    },
    {
      id: "redeem.monitor_ca_7d",
      title: pick(lang, "监控 1 个 CA · 7 天", "Monitor 1 CA · 7 days"),
      description: pick(
        lang,
        "风险等级变化时提醒（上线后接入通知通道）。",
        "Alert when risk level changes (notifications when live).",
      ),
      costVp: 100,
      category: "monitor",
      status: "coming_soon",
      cashAlternativeLabel: pick(lang, "约 ¥9 加购", "About ¥9 add-on"),
      highlight: true,
    },
    {
      id: "redeem.pro_7d",
      title: pick(lang, "Pro 体验 7 天", "Pro trial · 7 days"),
      description: pick(
        lang,
        "高级报告字段、更高限额；可用 VP 抵扣部分现金。",
        "Advanced report fields and higher limits; VP can offset part of cash.",
      ),
      costVp: 200,
      category: "pro",
      status: "coming_soon",
      cashAlternativeLabel: "¥19–49 / mo",
    },
    {
      id: "redeem.group_boost_day",
      title: pick(lang, "群日查询扩容", "Group daily quota boost"),
      description: pick(
        lang,
        "群 Bot 当日查询上限提升，适合活跃中文交易群。",
        "Raises group bot daily check cap for active trading groups.",
      ),
      costVp: 150,
      category: "group",
      status: "coming_soon",
      cashAlternativeLabel: pick(lang, "群商业版月费", "Group business plan fee"),
    },
  ];

  return vpRedemptions.map((item) => ({ ...item }));
}

export function getPointProgram(locale?: PointsLocale | null) {
  const lang = normalizeLocale(locale);
  return {
    pointsName: pick(lang, "哨点", "Vigil Points"),
    englishName: pointProgramMeta.englishName,
    shortName: pointProgramMeta.shortName,
    tagline: pick(lang, "用安检与贡献换防护权益", "Turn scans & contributions into protection perks"),
    disclaimer: pick(
      lang,
      "VP 为产品权益积分，用于兑换查询额度、监控与会员体验；不构成代币、收益承诺或投资建议，不可提现、不可转让。",
      "VP is a product perk ledger for check quotas, monitors, and membership trials — not a token, yield promise, or investment advice; non-withdrawable and non-transferable.",
    ),
    cashOffsetCapPercent: pointProgramMeta.cashOffsetCapPercent,
    rules: pointRulesFor(lang),
    redemptions: listVpRedemptions(lang),
  };
}
