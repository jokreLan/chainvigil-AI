import type { Metadata } from "next";
import Link from "next/link";
import { buildSeoDescription, buildSeoTitle, buildTokenReportJsonLd } from "@chainvigil/report";
import { buildMockTokenRiskReport } from "@chainvigil/risk-core";
import type { ChainId } from "@chainvigil/types";
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

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/check">重新检测</Link>
      </nav>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="text-sm text-emerald-200/75">
            {report.chain} / {report.tokenAddress}
          </p>
          <h1 className="mt-4 text-5xl font-semibold text-white">
            AI 结论：{report.label}
          </h1>
          <p className="mt-5 text-xl leading-8 text-emerald-50/80">{report.summary}</p>
          <p className="mt-4 text-emerald-100/70">{report.recommendation}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Metric label="风险分" value={report.score?.toString() ?? "N/A"} />
            <Metric label="卖出税" value={`${report.evidence.sellTaxPercent ?? 0}%`} />
            <Metric label="可卖出" value={report.evidence.canSell ? "是" : "否"} />
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">主要风险原因</h2>
            <div className="mt-4 space-y-4">
              {report.reasons.map((reason) => (
                <article key={reason.title} className="border border-emerald-300/14 bg-black/20 p-5">
                  <p className="text-xs uppercase text-emerald-200/60">{reason.severity}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{reason.title}</h3>
                  <p className="mt-2 leading-7 text-emerald-50/72">{reason.explanation}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit border border-emerald-300/16 bg-black/24 p-5">
          <h2 className="text-lg font-semibold text-white">分享报告</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-50/70">
            复制链接发到 Telegram 或 X，让群友先看风险再决定是否交互。
          </p>
          <div className="mt-4 break-all border border-emerald-300/12 bg-white/6 p-3 text-sm text-emerald-100/80">
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
          <p className="mt-5 text-xs leading-5 text-emerald-100/55">
            检测时间：{new Date(report.checkedAt).toLocaleString("zh-CN")}
          </p>
          <p className="mt-5 border-t border-emerald-300/12 pt-5 text-xs leading-5 text-emerald-100/55">
            免责声明：本报告仅用于交易安全风险识别，不构成投资建议。链上状态可能随时变化，请在交易前重新检测。
          </p>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-emerald-300/14 bg-black/18 p-4">
      <p className="text-xs text-emerald-200/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
