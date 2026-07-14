import type { Metadata } from "next";
import Link from "next/link";
import { buildSeoDescription, buildSeoTitle, buildTokenReportJsonLd } from "@chainvigil/report";
import { buildMockTokenRiskReport } from "@chainvigil/risk-core";
import type { ChainId, RiskLevel, RiskReasonSeverity } from "@chainvigil/types";
import { appendReferralParam, buildTrackedShareText } from "../../../lib/share";
import { ShareReport } from "../../../ui/share-report";
import { MobileNav } from "../../../ui/mobile-nav";
import { CopyValueButton } from "../../../ui/copy-value-button";

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
    <main className="min-h-screen bg-[#0a0b0f] px-4 pb-28 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between border-b border-[#262932] text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/check">重新检测</Link>
      </nav>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#262932] bg-[#16181d] font-semibold text-[#c0c1ff]">{report.tokenSymbol.slice(0, 2)}</div><div><h1 className="text-2xl font-semibold text-[#f9fafb]">{report.tokenSymbol}</h1><div className="mt-1 flex flex-wrap items-center gap-2"><p className="break-all font-mono text-xs text-[#9ca3af]">{report.chain} · {report.tokenAddress}</p><CopyValueButton value={report.tokenAddress} label="复制 CA" /></div></div></div>
          <div className="w-full md:w-auto"><ShareReport reportUrl={trackedReportUrl} shareText={trackedShareText} subjectId={`${report.chain}:${report.tokenAddress}`} referralCode={referralCode} /></div>
        </div>

        <div className={`mt-8 rounded-2xl border p-5 md:p-8 ${riskStyle.panel}`}>
          <div className="grid gap-6 md:grid-cols-[11rem_1fr]">
            <div className={`flex flex-col items-center justify-center rounded-2xl border p-6 text-center ${riskStyle.badge}`}><span className="text-3xl font-semibold">{report.label}</span><span className="mt-2 text-xs font-semibold uppercase">{report.riskLevel}</span></div>
            <div>
              <p className="text-xs font-semibold text-[#c0c1ff]">ChainVigil AI Analysis Conclusion</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#f9fafb]">AI 风险结论</h2>
              <p className={`mt-3 text-lg leading-8 ${riskStyle.summary}`}>{report.summary}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">{report.reasons.slice(0, 3).map((reason) => <div key={reason.title} className="rounded-xl border border-[#262932] bg-[#16181d]/80 p-3"><p className={`text-xs font-semibold ${reasonSeverityStyles[reason.severity]}`}>{reason.title}</p><p className="mt-2 text-xs leading-5 text-[#c7c4d7]">{reason.explanation}</p></div>)}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-12">
          <section className="rounded-2xl border border-[#262932] bg-[#16181d] p-5 md:col-span-8"><h2 className="text-xl font-semibold text-[#f9fafb]">买卖仿真分析</h2><p className="mt-1 text-sm text-[#9ca3af]">V0 mock 风险证据</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><Evidence label="买入测试" value={report.evidence.canBuy ? "成功" : "失败"} tone={report.evidence.canBuy ? "text-[#6ee7b7]" : "text-[#fca5a5]"} /><Evidence label="卖出测试" value={report.evidence.canSell ? "成功" : "失败"} tone={report.evidence.canSell ? "text-[#6ee7b7]" : "text-[#fca5a5]"} /><Evidence label="买入税" value={`${report.evidence.buyTaxPercent ?? 0}%`} /><Evidence label="卖出税" value={`${report.evidence.sellTaxPercent ?? 0}%`} tone="text-[#fca5a5]" /></div></section>
          <section className="rounded-2xl border border-[#262932] bg-[#16181d] p-5 md:col-span-4"><h2 className="text-xl font-semibold text-[#f9fafb]">合约权限</h2><div className="mt-5 space-y-3"><Evidence label="Owner 权限" value={report.evidence.ownerCanModifyTax ? "可修改税率" : "未发现"} /><Evidence label="黑名单功能" value={report.evidence.blacklistFunction ? "检测到" : "未发现"} tone={report.evidence.blacklistFunction ? "text-[#fca5a5]" : "text-[#6ee7b7]"} /><Evidence label="增发权限" value={report.evidence.mintable ? "检测到" : "未发现"} /></div></section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div>
          <section className="rounded-2xl border border-[#262932] bg-[#16181d] p-5"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold text-[#f9fafb]">流动性分析 (LP)</h2><p className="mt-1 text-sm text-[#9ca3af]">资金池安全性检测</p></div><span className={report.evidence.lpLocked ? "text-[#6ee7b7]" : "text-[#fca5a5]"}>{report.evidence.lpLocked ? "已锁定" : "未锁定"}</span></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Metric label="LP 价值" value={`$${report.evidence.lpValueUsd ?? "N/A"}`} /><Metric label="Holder" value={String(report.evidence.holderCount ?? "N/A")} /><Metric label="Top 10" value={`${report.evidence.top10HolderPercent ?? "N/A"}%`} /></div></section>
          <section className="mt-6">
            <h2 className="text-2xl font-semibold text-[#f9fafb]">主要风险原因</h2>
            <div className="mt-4 space-y-4">{report.reasons.map((reason) => <article key={reason.title} className="rounded-xl border border-[#262932] bg-[#16181d] p-5"><p className={`text-xs font-semibold uppercase ${reasonSeverityStyles[reason.severity]}`}>{reason.severity}</p><h3 className="mt-2 text-lg font-semibold text-[#f9fafb]">{reason.title}</h3><p className="mt-2 leading-7 text-[#c7c4d7]">{reason.explanation}</p></article>)}</div>
          </section>
          <section className="mt-6 rounded-2xl border border-[#262932] bg-[#16181d]"><h2 className="border-b border-[#262932] p-5 text-xl font-semibold text-[#f9fafb]">技术证据详情</h2><div className="p-5"><p className="font-mono text-sm text-[#c0c1ff]">{report.evidence.honeypotDetected ? "honeypotDetected=true" : "honeypotDetected=false"}</p><p className="mt-3 text-sm leading-6 text-[#c7c4d7]">V0 仅展示公开 mock 证据摘要；真实 provider 接入后会补充可复查的链上来源与时间戳。</p></div></section>
          </div>
          <aside className="h-fit rounded-2xl border border-[#262932] bg-[#16181d] p-5">
            <h2 className="text-lg font-semibold text-[#f9fafb]">分享报告</h2><p className="mt-3 text-sm leading-6 text-[#c7c4d7]">复制链接发到 Telegram 或 X，让群友先看风险再决定是否交互。</p><div className="mt-4 break-all rounded-md border border-[#34343d] bg-[#0d0d15] p-3 text-sm text-[#c7c4d7]">{trackedShareText}</div><p className="mt-5 text-xs leading-5 text-[#9ca3af]">检测时间：{new Date(report.checkedAt).toLocaleString("zh-CN")}</p><p className="mt-5 border-t border-[#262932] pt-5 text-xs leading-5 text-[#9ca3af]">免责声明：本报告仅用于交易安全风险识别，不构成投资建议。链上状态可能随时变化，请在交易前重新检测。</p>
          </aside>
        </div>
        <section className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="风险分" value={report.score?.toString() ?? "N/A"} />
            <Metric label="卖出税" value={`${report.evidence.sellTaxPercent ?? 0}%`} />
            <Metric label="可卖出" value={report.evidence.canSell ? "是" : "否"} />
        </section>
      </section>
      <MobileNav active="database" />
    </main>
  );
}

function Evidence({ label, value, tone = "text-[#f9fafb]" }: { label: string; value: string; tone?: string }) { return <div className="flex items-center justify-between border-b border-[#262932] pb-3 text-sm"><span className="text-[#9ca3af]">{label}</span><span className={`font-semibold ${tone}`}>{value}</span></div>; }

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#262932] bg-[#16181d] p-4">
      <p className="text-xs text-[#9ca3af]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#f9fafb]">{value}</p>
    </div>
  );
}
