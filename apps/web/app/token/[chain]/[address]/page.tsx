import type { Metadata } from "next";
import Link from "next/link";
import { buildSeoDescription, buildSeoTitle, buildTokenReportJsonLd } from "@chainvigil/report";
import { buildMockTokenRiskReport } from "@chainvigil/risk-core";
import type { ChainId, RiskLevel, RiskReasonSeverity } from "@chainvigil/types";
import { appendReferralParam, buildTrackedShareText } from "../../../lib/share";
import { ShareReport } from "../../../ui/share-report";

interface TokenReportPageProps {
  params: Promise<{
    chain: ChainId;
    address: string;
  }>;
  searchParams?: Promise<{
    ref?: string;
  }>;
}

const reportRiskStyles: Record<
  RiskLevel,
  { panel: string; badge: string; summary: string }
> = {
  BLOCK: {
    panel: "border-[#ef4444]/40 bg-[#ef4444]/10",
    badge: "border-[#ef4444]/40 text-[#fca5a5]",
    summary: "text-[#fecaca]",
  },
  HIGH: {
    panel: "border-[#f97316]/40 bg-[#f97316]/10",
    badge: "border-[#f97316]/40 text-[#fdba74]",
    summary: "text-[#fed7aa]",
  },
  MEDIUM: {
    panel: "border-[#f59e0b]/40 bg-[#f59e0b]/10",
    badge: "border-[#f59e0b]/40 text-[#fde68a]",
    summary: "text-[#fef3c7]",
  },
  LOW: {
    panel: "border-[#10b981]/40 bg-[#10b981]/10",
    badge: "border-[#10b981]/40 text-[#6ee7b7]",
    summary: "text-[#d1fae5]",
  },
  UNKNOWN: {
    panel: "border-[#6b7280]/40 bg-[#6b7280]/10",
    badge: "border-[#6b7280]/40 text-[#d1d5db]",
    summary: "text-[#e5e7eb]",
  },
};

const reasonSeverityStyles: Record<RiskReasonSeverity, string> = {
  critical: "text-[#ef4444]",
  high: "text-[#f97316]",
  medium: "text-[#f59e0b]",
  low: "text-[#10b981]",
};

export async function generateMetadata({ params }: TokenReportPageProps): Promise<Metadata> {
  const { chain, address } = await params;
  const report = buildMockTokenRiskReport({ input: address, chain });

  return {
    title: buildSeoTitle(report),
    description: buildSeoDescription(report),
    openGraph: {
      title: buildSeoTitle(report),
      description: buildSeoDescription(report),
      type: "article",
      images: [
        {
          url: `/token/${report.chain}/${report.tokenAddress}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${report.tokenSymbol} ${report.label} 风险报告`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: buildSeoTitle(report),
      description: buildSeoDescription(report),
      images: [`/token/${report.chain}/${report.tokenAddress}/opengraph-image`],
    },
  };
}

export default async function TokenReportPage({ params, searchParams }: TokenReportPageProps) {
  const { chain, address } = await params;
  const { ref } = (await searchParams) ?? {};
  const report = buildMockTokenRiskReport({ input: address, chain });
  const referralCode = ref?.trim() || "share";
  const trackedReportUrl = appendReferralParam(report.reportUrl, referralCode);
  const trackedShareText = buildTrackedShareText(report.shareText, report.reportUrl, trackedReportUrl);
  const jsonLd = buildTokenReportJsonLd(report);
  const riskStyle = reportRiskStyles[report.riskLevel];

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/check">重新检测</Link>
      </nav>

      <section className="mx-auto mt-12 grid max-w-7xl gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="break-all font-mono text-sm text-[#9ca3af]">
            {report.chain} / {report.tokenAddress}
          </p>
          <div className={`mt-5 rounded-lg border p-6 ${riskStyle.panel}`}>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskStyle.badge}`}>
              {report.riskLevel}
            </span>
            <h1 className="mt-4 text-4xl font-semibold text-[#f9fafb]">AI 结论：{report.label}</h1>
            <p className={`mt-4 text-xl leading-8 ${riskStyle.summary}`}>{report.summary}</p>
            <p className="mt-4 text-[#c7c4d7]">{report.recommendation}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Metric label="风险分" value={report.score?.toString() ?? "N/A"} />
            <Metric label="卖出税" value={`${report.evidence.sellTaxPercent ?? 0}%`} />
            <Metric label="可卖出" value={report.evidence.canSell ? "是" : "否"} />
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-[#f9fafb]">主要风险原因</h2>
            <div className="mt-4 space-y-4">
              {report.reasons.map((reason) => (
                <article key={reason.title} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
                  <p className={`text-xs font-semibold uppercase ${reasonSeverityStyles[reason.severity]}`}>
                    {reason.severity}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[#f9fafb]">{reason.title}</h3>
                  <p className="mt-2 leading-7 text-[#c7c4d7]">{reason.explanation}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-[#262932] bg-[#16181d] p-5">
          <h2 className="text-lg font-semibold text-[#f9fafb]">分享报告</h2>
          <p className="mt-3 text-sm leading-6 text-[#c7c4d7]">
            复制链接发到 Telegram 或 X，让群友先看风险再决定是否交互。
          </p>
          <div className="mt-4 break-all rounded-md border border-[#34343d] bg-[#0d0d15] p-3 text-sm text-[#c7c4d7]">
            {trackedShareText}
          </div>
          <div className="mt-4">
            <ShareReport
              reportUrl={trackedReportUrl}
              shareText={trackedShareText}
              subjectId={`${report.chain}:${report.tokenAddress}`}
              referralCode={referralCode}
            />
          </div>
          <p className="mt-5 text-xs leading-5 text-[#9ca3af]">
            检测时间：{new Date(report.checkedAt).toLocaleString("zh-CN")}
          </p>
          <p className="mt-5 border-t border-[#262932] pt-5 text-xs leading-5 text-[#9ca3af]">
            免责声明：本报告仅用于交易安全风险识别，不构成投资建议。链上状态可能随时变化，请在交易前重新检测。
          </p>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#262932] bg-[#16181d] p-4">
      <p className="text-xs text-[#9ca3af]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#f9fafb]">{value}</p>
    </div>
  );
}
