import type { ReportConfidence, ReportExecutionMode, TokenRiskReport } from "@chainvigil/types";

export type ReportLocale = "zh" | "en";

function normalizeLocale(locale?: string | null): ReportLocale {
  return locale === "en" ? "en" : "zh";
}

export function buildSeoTitle(report: TokenRiskReport, locale?: string | null): string {
  const lang = normalizeLocale(locale);
  if (lang === "en") {
    const modeTag = report.mode === "live" ? "" : "Sample · ";
    return `${modeTag}${report.tokenSymbol} risk report｜${report.label}｜ChainVigil`;
  }
  const modeTag = report.mode === "live" ? "" : "示例·";
  return `${modeTag}${report.tokenSymbol} 风险报告｜${report.label}｜ChainVigil`;
}

export function buildSeoDescription(report: TokenRiskReport, locale?: string | null): string {
  const lang = normalizeLocale(locale);
  if (lang === "en") {
    const modeHint =
      report.mode === "live" ? "mode=live" : "mode=mock · not a live on-chain conclusion";
    return `${report.summary} Chain: ${report.chain}. ${modeHint}. Before you buy, check the CA. Not investment advice.`;
  }
  const modeHint =
    report.mode === "live" ? "检测模式 live" : "检测模式 mock，非实时链上结论";
  return `${report.summary} 检测链：${report.chain}。${modeHint}。买币前，先查 CA。检测结果不构成投资建议。`;
}

export function describeReportMode(
  mode: ReportExecutionMode,
  confidence: ReportConfidence,
  locale?: string | null,
): {
  badge: string;
  title: string;
  body: string;
  tone: "mock" | "live" | "mixed";
} {
  const lang = normalizeLocale(locale);

  if (mode === "live" && confidence !== "UNASSESSED") {
    return lang === "en"
      ? {
          badge: "LIVE",
          title: "On-chain evidence run",
          body: "External evidence was requested. On-chain state can change — re-verify before trading.",
          tone: "live",
        }
      : {
          badge: "LIVE",
          title: "链上证据检测",
          body: "本报告包含已执行的外部证据请求。链上状态可能变化，交易前请再次复核官方渠道与区块浏览器。",
          tone: "live",
        };
  }

  if (mode === "live") {
    return lang === "en"
      ? {
          badge: "LIVE · low confidence",
          title: "Partial live evidence",
          body: "Live sources were attempted but confidence is limited. Don’t size up on a single signal.",
          tone: "mixed",
        }
      : {
          badge: "LIVE · 低置信",
          title: "部分证据已接入",
          body: "已尝试真实数据源，但置信度仍有限。请勿仅凭单一结果做大额决策。",
          tone: "mixed",
        };
  }

  return lang === "en"
    ? {
        badge: "MOCK",
        title: "Demo / not live chain evidence",
        body: "Mock or degraded output. Fields do not prove real tradability, tax, permissions, or LP safety.",
        tone: "mock",
      }
    : {
        badge: "MOCK",
        title: "演示 / 未完成实时检测",
        body: "当前为 mock 或降级结果，字段不代表真实可买卖、税率、权限或 LP 状态。接入外部数据源前，仅用于产品演示与流程验收。",
        tone: "mock",
      };
}

export function buildSharePrefix(report: TokenRiskReport, locale?: string | null): string {
  const lang = normalizeLocale(locale);
  if (lang === "en") {
    return report.mode === "live"
      ? "ChainVigil buy-before scan: "
      : "ChainVigil sample report (not live): ";
  }
  if (report.mode === "live") {
    return "ChainVigil 买前安检：";
  }
  return "ChainVigil 示例报告（非实时链上检测）：";
}

export function buildTokenReportJsonLd(
  report: TokenRiskReport,
  locale?: string | null,
): Record<string, unknown> {
  const lang = normalizeLocale(locale);
  return {
    "@context": "https://schema.org",
    "@type": "Report",
    name: buildSeoTitle(report, lang),
    headline: buildSeoTitle(report, lang),
    description: buildSeoDescription(report, lang),
    url: report.reportUrl,
    datePublished: report.checkedAt,
    dateModified: report.checkedAt,
    inLanguage: lang === "zh" ? "zh-CN" : "en",
    publisher: {
      "@type": "Organization",
      name: "ChainVigil",
      url: "https://chainvigil.ai",
      slogan: lang === "en" ? "Before you buy, check the CA." : "买币前，先查 CA。",
    },
    about: {
      "@type": "Thing",
      name: `${report.tokenSymbol} token risk`,
      identifier: `${report.chain}:${report.tokenAddress}`,
    },
    riskAssessment: {
      label: report.label,
      riskLevel: report.riskLevel,
      score: report.score,
      summary: report.summary,
      recommendation: report.recommendation,
      mode: report.mode,
      confidence: report.confidence,
      confidenceScore: report.confidenceScore,
      reasons: report.reasons.map((reason) => ({
        severity: reason.severity,
        title: reason.title,
        explanation: reason.explanation,
      })),
    },
    disclaimer:
      lang === "en"
        ? "Risk education only. Not investment advice."
        : "本报告仅用于交易安全风险识别，不构成投资建议。",
  };
}

export function buildTelegramCheckReply(report: TokenRiskReport, locale?: string | null): string {
  const lang = normalizeLocale(locale);
  const mode = describeReportMode(report.mode, report.confidence, lang);
  const topReasons = report.reasons
    .slice(0, 4)
    .map((reason, index) => `${index + 1}. ${reason.title}`)
    .join("\n");

  if (lang === "en") {
    return [
      `ChainVigil result: ${report.label}`,
      `Mode: ${mode.badge} · confidence: ${report.confidence}`,
      "",
      report.summary,
      "",
      "Top reasons:",
      topReasons,
      "",
      `Full report: ${report.reportUrl}`,
      "",
      mode.tone === "mock"
        ? "Demo/degraded result — verify independently."
        : "On-chain state can change — verify independently.",
      "Before you buy, check the CA. Not investment advice.",
    ].join("\n");
  }

  return [
    `ChainVigil 检测结果：${report.label}`,
    `模式：${mode.badge} · 置信：${report.confidence}`,
    "",
    report.summary,
    "",
    "主要原因：",
    topReasons,
    "",
    `完整报告：${report.reportUrl}`,
    "",
    mode.tone === "mock" ? "当前为演示/降级结果，请独立复核。" : "链上状态可能变化，请独立复核。",
    "买币前，先查 CA。不构成投资建议。",
  ].join("\n");
}
