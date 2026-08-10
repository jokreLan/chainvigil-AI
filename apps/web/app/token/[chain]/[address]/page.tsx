import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildSeoDescription,
  buildSeoTitle,
  buildSharePrefix,
  buildTokenReportJsonLd,
} from "@chainvigil/report";
import type { ChainId, RiskLevel, RiskReasonSeverity } from "@chainvigil/types";
import { getServerT } from "../../../i18n/server";
import { appendReferralParam, buildTrackedShareText } from "../../../lib/share";
import { ShareReport } from "../../../ui/share-report";
import { ConsumerMobileNav } from "../../../ui/consumer-mobile-nav";
import { CopyValueButton } from "../../../ui/copy-value-button";
import { DappHeader } from "../../../ui/dapp-header";
import { DappIcon } from "../../../ui/dapp-icon";
import { ProviderCoverage } from "../../../ui/provider-coverage";
import { ReportActionBar } from "../../../ui/report-action-bar";
import { VigilCore } from "../../../ui/vigil-core";
import { getTokenRiskReport } from "../../../lib/reports";

interface TokenReportPageProps {
  params: Promise<{
    chain: ChainId;
    address: string;
  }>;
  searchParams?: Promise<{
    ref?: string;
    from?: string;
  }>;
}

const reportRiskStyles: Record<
  RiskLevel,
  { panel: string; badge: string; summary: string; glow: string }
> = {
  BLOCK: {
    panel: "border-[#ef4444]/45 bg-[#ef4444]/10",
    badge: "border-[#ef4444]/50 text-[#fca5a5] bg-[#0a0b0f]/40",
    summary: "text-[#fecaca]",
    glow: "ai-glow-card",
  },
  HIGH: {
    panel: "border-[#f97316]/45 bg-[#f97316]/10",
    badge: "border-[#f97316]/50 text-[#fdba74] bg-[#0a0b0f]/40",
    summary: "text-[#fed7aa]",
    glow: "",
  },
  MEDIUM: {
    panel: "border-[#f59e0b]/45 bg-[#f59e0b]/10",
    badge: "border-[#f59e0b]/50 text-[#fde68a] bg-[#0a0b0f]/40",
    summary: "text-[#fef3c7]",
    glow: "",
  },
  LOW: {
    panel: "border-[#10b981]/45 bg-[#10b981]/10",
    badge: "border-[#10b981]/50 text-[#6ee7b7] bg-[#0a0b0f]/40",
    summary: "text-[#d1fae5]",
    glow: "",
  },
  UNKNOWN: {
    panel: "border-[#6b7280]/45 bg-[#6b7280]/10",
    badge: "border-[#6b7280]/50 text-[#d1d5db] bg-[#0a0b0f]/40",
    summary: "text-[#e5e7eb]",
    glow: "",
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
  const { locale } = await getServerT();
  let report;
  try {
    report = await getTokenRiskReport(chain, address, locale);
  } catch {
    return { robots: { index: false, follow: false } };
  }

  return {
    title: buildSeoTitle(report, locale),
    description: buildSeoDescription(report, locale),
    // CA reports are share/recheck tools, not long-tail SEO pages (meme heat dies in days).
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
    openGraph: {
      title: buildSeoTitle(report, locale),
      description: buildSeoDescription(report, locale),
      type: "article",
      images: [
        {
          url: `/token/${report.chain}/${report.tokenAddress}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${report.tokenSymbol} ${report.label}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: buildSeoTitle(report, locale),
      description: buildSeoDescription(report, locale),
      images: [`/token/${report.chain}/${report.tokenAddress}/opengraph-image`],
    },
  };
}

export default async function TokenReportPage({ params, searchParams }: TokenReportPageProps) {
  const { chain, address } = await params;
  const { ref, from } = (await searchParams) ?? {};
  const { t, locale } = await getServerT();
  let report;
  try {
    report = await getTokenRiskReport(chain, address, locale);
  } catch {
    notFound();
  }
  const referralCode = ref?.trim() || "share";
  const trackedReportUrl = appendReferralParam(report.reportUrl, referralCode);
  const trackedShareText = `${buildSharePrefix(report, locale)}${buildTrackedShareText(report.shareText, report.reportUrl, trackedReportUrl)}`;
  const jsonLd = buildTokenReportJsonLd(report, locale);
  const riskStyle = reportRiskStyles[report.riskLevel];
  const shortAddress =
    report.tokenAddress.length > 12
      ? `${report.tokenAddress.slice(0, 6)}...${report.tokenAddress.slice(-4)}`
      : report.tokenAddress;
  const fromTask = from === "task";

  return (
    <main className="cv-dapp-page min-h-screen pb-52 md:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DappHeader active="scan" mode={report.mode === "live" ? "live" : "readiness"} />

      <section className="mx-auto max-w-[1120px] px-4 py-7 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-lg border ${riskStyle.badge}`}>
              <DappIcon name={report.riskLevel === "LOW" ? "check" : "alert"} className="size-6" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="cv-font-display text-2xl font-semibold text-[#dce4e5]">{report.tokenSymbol}</h1>
                <span className={`rounded border px-2 py-1 cv-font-mono text-[9px] font-semibold uppercase ${riskStyle.badge}`}>
                  {report.riskLevel}
                </span>
                <span className="rounded border border-[#00e5ff]/25 px-2 py-1 cv-font-mono text-[9px] uppercase text-[#c3f5ff]">
                  {report.mode === "live" ? "VERIFIED RESPONSE" : "MOCK / READINESS"}
                </span>
              </div>
              <div className="mt-2 flex min-w-0 items-center gap-2">
                <span className="rounded bg-[#242b2d] px-2 py-1 cv-font-mono text-[9px] uppercase text-[#bac9cc]">{report.chain}</span>
                <p className="truncate cv-font-mono text-xs text-[#849396]">{shortAddress}</p>
                <CopyValueButton value={report.tokenAddress} label={t("report.copy")} className="shrink-0 border-[#3b494c] text-[#c3f5ff]" />
              </div>
            </div>
          </div>
          <Link href="/check" className="hidden min-h-11 items-center gap-2 cv-font-mono text-xs uppercase tracking-[0.08em] text-[#bac9cc] hover:text-[#c3f5ff] md:flex">
            <DappIcon name="scan" className="size-4" />
            {t("report.recheck")}
          </Link>
        </div>

        {fromTask ? (
          <p
            role="status"
            className="mt-4 rounded-lg border border-[#9de32e]/25 bg-[#83c600]/10 px-3 py-2 text-sm text-[#b0f743]"
          >
            {t("report.taskDone")}{" "}
            <Link href="/app/points?done=check" className="font-semibold underline">
              {t("report.backPoints")}
            </Link>
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.82fr_1.18fr] lg:gap-5">
          <div className="space-y-4">
            <section className={`cv-dapp-panel p-5 text-center md:p-6 ${riskStyle.panel}`}>
              <VigilCore compact />
              <p className={`-mt-4 cv-font-display text-3xl font-semibold ${riskStyle.summary}`}>{report.label}</p>
              <p className="mt-2 cv-font-mono text-[10px] uppercase tracking-[0.08em] text-[#bac9cc]">Vigil Core · {report.mode === "live" ? "VERIFIED RESPONSE" : "SAMPLE / READINESS"}</p>
              <p className="mt-4 text-sm leading-6 text-[#dce4e5]">{report.summary}</p>
              <p className="mt-4 text-xs leading-5 text-[#849396]">{t("report.disclaimer")}</p>
            </section>

            <section className="cv-dapp-panel p-4">
              <div className="flex items-center justify-between gap-3 border-b border-[#3b494c]/35 pb-3">
                <h2 className="cv-font-display font-semibold text-[#dce4e5]">{t("report.conclusion")}</h2>
                <DappIcon name="alert" className={`size-5 ${riskStyle.summary}`} />
              </div>
              <a href="#evidence" className={`mt-4 flex min-h-12 items-center justify-center rounded-lg border px-4 text-center cv-font-display font-semibold ${riskStyle.badge}`}>
                {t("report.evidence")}
              </a>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/check" className="flex min-h-11 items-center justify-center rounded-lg border border-[#3b494c] bg-[#242b2d] text-sm font-semibold text-[#dce4e5]">{t("report.recheck")}</Link>
                <a href="#share-report" className="flex min-h-11 items-center justify-center rounded-lg border border-[#3b494c] bg-[#242b2d] text-sm font-semibold text-[#dce4e5]">{t("report.share")}</a>
              </div>
            </section>
          </div>

          <section id="evidence" className="cv-dapp-panel scroll-mt-24 p-5 md:p-6">
            <div>
              <p className="cv-font-mono text-[10px] uppercase tracking-[0.08em] text-[#00e5ff]">EVIDENCE FIRST</p>
              <h2 className="mt-2 cv-font-display text-xl font-semibold text-[#dce4e5]">{t("report.reasons")}</h2>
            </div>
            <div className="mt-5 space-y-3">
              {report.reasons.slice(0, 3).map((reason) => (
                <article key={reason.title} className="rounded-lg border border-[#3b494c]/40 bg-[#151d1e] p-4" style={{ borderLeftWidth: 4 }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`cv-font-mono text-[9px] font-semibold uppercase ${reasonSeverityStyles[reason.severity]}`}>{reason.severity} · {report.mode === "live" ? "EVIDENCE" : "SAMPLE"}</p>
                      <h3 className="mt-2 cv-font-display font-semibold text-[#dce4e5]">{reason.title}</h3>
                    </div>
                    <DappIcon name={reason.severity === "low" ? "check" : "alert"} className={`size-5 shrink-0 ${reasonSeverityStyles[reason.severity]}`} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#bac9cc]">{reason.explanation}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 border-t border-[#3b494c]/35 pt-5">
              <ProviderCoverage mode={report.mode} chain={report.chain} variant="strip" />
            </div>
          </section>
        </div>

        <details className="cv-dapp-panel mt-5 p-5">
          <summary className="cursor-pointer cv-font-display font-semibold text-[#c3f5ff]">{t("report.evidence")} · {t("report.permissions")} · {t("report.tradeSim")}</summary>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <section>
              <h3 className="cv-font-display font-semibold text-[#dce4e5]">{t("report.tradeSim")}</h3>
              <div className="mt-3 space-y-3">
                <Evidence label={t("report.buyTest")} value={report.mode === "live" ? (report.evidence.canBuy ? t("common.success") : t("common.fail")) : t("common.sample")} />
                <Evidence label={t("report.sellTest")} value={report.mode === "live" ? (report.evidence.canSell ? t("common.success") : t("common.fail")) : t("common.sample")} />
                <Evidence label={t("report.buyTax")} value={report.mode === "live" ? `${report.evidence.buyTaxPercent ?? 0}%` : t("common.pendingLookup")} />
                <Evidence label={t("report.sellTax")} value={report.mode === "live" ? `${report.evidence.sellTaxPercent ?? 0}%` : t("common.pendingLookup")} />
              </div>
            </section>
            <section>
              <h3 className="cv-font-display font-semibold text-[#dce4e5]">{t("report.permissions")}</h3>
              <div className="mt-3 space-y-3">
                <Evidence label={t("report.ownerPerm")} value={report.evidence.ownerCanModifyTax ? t("report.ownerOpen") : t("report.ownerClosed")} />
                <Evidence label={t("report.blacklistFn")} value={report.evidence.blacklistFunction ? t("common.found") : t("common.notFound")} />
                <Evidence label={t("report.mintAuth")} value={report.evidence.mintable ? t("report.exists") : t("common.notFound")} />
                <Evidence label={t("report.pauseAuth")} value={report.evidence.pausable ? t("report.pausable") : t("common.notFound")} />
              </div>
            </section>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Metric label={t("report.lpValue")} value={report.mode === "live" ? `$${report.evidence.lpValueUsd ?? "N/A"}` : t("common.pendingLookup")} />
            <Metric label="Holder" value={report.mode === "live" ? String(report.evidence.holderCount ?? "N/A") : t("common.pendingLookup")} />
            <Metric label="Top 10" value={report.mode === "live" ? `${report.evidence.top10HolderPercent ?? "N/A"}%` : t("common.pendingLookup")} />
            <Metric label={t("report.riskScore")} value={report.mode === "live" ? String(report.score ?? "N/A") : t("common.sample")} />
          </div>
        </details>

        <aside id="share-report" className="cv-dapp-panel mt-5 scroll-mt-28 p-5">
          <h2 className="cv-font-display font-semibold text-[#dce4e5]">{t("report.shareTitle")}</h2>
          <p className="mt-2 text-xs leading-5 text-[#849396]">{t("report.shareHint")}</p>
          <div className="mt-4 max-w-xl">
            <ShareReport reportUrl={trackedReportUrl} shareText={trackedShareText} subjectId={`${report.chain}:${report.tokenAddress}`} referralCode={referralCode} />
          </div>
        </aside>
      </section>
      <ReportActionBar
        reportUrl={trackedReportUrl}
        chain={report.chain}
        address={report.tokenAddress}
      />
      <ConsumerMobileNav active="reports" />
    </main>
  );
}

function Evidence({
  label,
  value,
  tone = "text-[#f9fafb]",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#3b494c]/35 pb-2.5 text-sm last:border-0">
      <span className="text-[#849396]">{label}</span>
      <span className={`font-semibold ${tone}`}>{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#3b494c]/35 bg-[#0d1516] p-3">
      <p className="cv-font-mono text-[9px] uppercase text-[#849396]">{label}</p>
      <p className="mt-1.5 cv-font-display text-base font-semibold text-[#dce4e5]">{value}</p>
    </div>
  );
}
