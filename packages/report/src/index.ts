import type { TokenRiskReport } from "@chainvigil/types";

export function buildSeoTitle(report: TokenRiskReport): string {
  return `${report.tokenSymbol} 风险报告｜${report.label}｜ChainVigil AI`;
}

export function buildSeoDescription(report: TokenRiskReport): string {
  return `${report.summary} 检测链：${report.chain}。买币前，先查 CA。检测结果不构成投资建议。`;
}

export function buildTokenReportJsonLd(report: TokenRiskReport): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Report",
    name: buildSeoTitle(report),
    headline: buildSeoTitle(report),
    description: buildSeoDescription(report),
    url: report.reportUrl,
    datePublished: report.checkedAt,
    dateModified: report.checkedAt,
    inLanguage: "zh-CN",
    publisher: {
      "@type": "Organization",
      name: "ChainVigil AI｜链哨 AI",
      url: "https://chainvigil.ai",
      slogan: "买币前，先查 CA。",
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
      reasons: report.reasons.map((reason) => ({
        severity: reason.severity,
        title: reason.title,
        explanation: reason.explanation,
      })),
    },
    disclaimer: "本报告仅用于交易安全风险识别，不构成投资建议。",
  };
}

export function buildTelegramCheckReply(report: TokenRiskReport): string {
  const topReasons = report.reasons
    .slice(0, 4)
    .map((reason, index) => `${index + 1}. ${reason.title}`)
    .join("\n");

  return [
    `ChainVigil AI｜链哨 AI 检测结果：${report.label}`,
    "",
    report.summary,
    "",
    "主要原因：",
    topReasons,
    "",
    `完整报告：${report.reportUrl}`,
    "",
    "买币前，先查 CA。",
  ].join("\n");
}
