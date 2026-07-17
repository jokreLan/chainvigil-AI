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
import { MobileNav } from "../../../ui/mobile-nav";
import { CopyValueButton } from "../../../ui/copy-value-button";
import { ReportModeBanner } from "../../../ui/report-mode-banner";
import { ReportActionBar } from "../../../ui/report-action-bar";
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
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-4 pb-40 md:px-8 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between border-b border-[#262932] text-sm text-[#9ca3af]">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[#f9fafb]">
          <span className="text-[#c0c1ff]">◎</span>
          {t("brand.name")}
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/wallet-check">{t("report.checkWallet")}</Link>
          <Link href="/check" className="font-semibold text-[#c0c1ff]">
            {t("report.recheck")}
          </Link>
        </div>
      </nav>

      <section className="mx-auto mt-6 max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#262932] bg-[#16181d] text-sm font-semibold text-[#c0c1ff]">
              {report.tokenSymbol.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[#f9fafb]">{report.tokenSymbol}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="rounded bg-[#292932] px-2 py-0.5 text-[11px] uppercase text-[#c7c4d7]">
                  {report.chain}
                </span>
                <p className="font-mono text-xs text-[#9ca3af]">{shortAddress}</p>
                <CopyValueButton value={report.tokenAddress} label={t("report.copy")} />
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <ShareReport
              reportUrl={trackedReportUrl}
              shareText={trackedShareText}
              subjectId={`${report.chain}:${report.tokenAddress}`}
              referralCode={referralCode}
            />
          </div>
        </div>
        <div className="mt-4 sm:hidden">
          <ShareReport
            compact
            reportUrl={trackedReportUrl}
            shareText={trackedShareText}
            subjectId={`${report.chain}:${report.tokenAddress}`}
            referralCode={referralCode}
          />
        </div>

        <div className="mt-5">
          <ReportModeBanner
            mode={report.mode}
            confidence={report.confidence}
            confidenceScore={report.confidenceScore}
          />
        </div>

        <aside
          role="note"
          className="mt-3 rounded-xl border border-[#8083ff]/30 bg-[#8083ff]/10 px-3 py-3 text-sm leading-6 text-[#c0c1ff]"
        >
          <p className="font-semibold text-[#e1e0ff]">{t("report.freshnessTitle")}</p>
          <p className="mt-1 text-[#c7c4d7]">{t("report.freshnessBody")}</p>
          <Link href="/check" className="mt-2 inline-block font-semibold underline">
            {t("report.freshnessCta")}
          </Link>
        </aside>

        {fromTask ? (
          <p
            role="status"
            className="mt-3 rounded-xl border border-[#eab308]/35 bg-[#eab308]/10 px-3 py-2 text-sm text-[#fde68a]"
          >
            {t("report.taskDone")}{" "}
            <Link href="/app/points?done=check" className="font-semibold underline">
              {t("report.backPoints")}
            </Link>
          </p>
        ) : null}

        {/* Conclusion hero — Stitch ai_4 */}
        <div className={`mt-5 rounded-2xl border p-5 md:p-6 ${riskStyle.panel} ${riskStyle.glow}`}>
          <div className="flex flex-col items-center text-center">
            <div
              className={`flex min-h-28 w-full max-w-[11rem] flex-col items-center justify-center rounded-2xl border px-4 py-6 ${riskStyle.badge}`}
            >
              <span className="text-3xl font-bold tracking-wide">{report.label}</span>
              <span className="mt-2 text-[11px] font-semibold uppercase opacity-80">
                {report.riskLevel === "BLOCK" ? "Danger" : report.riskLevel}
              </span>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#c0c1ff]">
              ChainVigil AI Analysis Conclusion
            </p>
            <p className={`mt-3 text-base leading-7 md:text-lg ${riskStyle.summary}`}>
              {report.summary}
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {report.reasons.slice(0, 3).map((reason) => (
                <div
                  key={reason.title}
                  className="rounded-xl border border-[#262932]/80 bg-[#0a0b0f]/35 p-3 text-left"
                >
                  <p className={`text-xs font-semibold ${reasonSeverityStyles[reason.severity]}`}>
                    {reason.title}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-5 text-[#c7c4d7]">{reason.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade simulation */}
        <section className="mt-5 rounded-2xl border border-[#262932] bg-[#16181d] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#f9fafb]">{t("report.tradeSim")}</h2>
              <p className="mt-1 text-xs text-[#9ca3af]">{t("report.tradeHint")}</p>
            </div>
            <span
              className={
                report.evidence.canSell === false
                  ? "rounded-full bg-[#ef4444]/15 px-2.5 py-1 text-[11px] font-semibold text-[#fca5a5]"
                  : "rounded-full bg-[#10b981]/15 px-2.5 py-1 text-[11px] font-semibold text-[#6ee7b7]"
              }
            >
              {report.evidence.canSell === false ? t("report.riskExtreme") : t("report.continueVerify")}
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Evidence
              label={t("report.buyTest")}
              value={report.evidence.canBuy ? t("common.success") : t("common.fail")}
              tone={report.evidence.canBuy ? "text-[#6ee7b7]" : "text-[#fca5a5]"}
            />
            <Evidence
              label={t("report.sellTest")}
              value={report.evidence.canSell ? t("common.success") : t("common.fail")}
              tone={report.evidence.canSell ? "text-[#6ee7b7]" : "text-[#fca5a5]"}
            />
            <Evidence label={t("report.buyTax")} value={`${report.evidence.buyTaxPercent ?? 0}%`} />
            <Evidence
              label={t("report.sellTax")}
              value={`${report.evidence.sellTaxPercent ?? 0}%`}
              tone="text-[#fca5a5]"
            />
          </div>
          {report.evidence.honeypotDetected ? (
            <p className="mt-4 rounded-lg border border-[#ef4444]/25 bg-[#ef4444]/10 p-3 text-xs leading-5 text-[#fecaca]">
              {t("report.honeypotHint")}
            </p>
          ) : null}
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-[#262932] bg-[#16181d] p-5">
            <h2 className="text-lg font-semibold text-[#f9fafb]">{t("report.permissions")}</h2>
            <div className="mt-4 space-y-3">
              <Evidence
                label={t("report.ownerPerm")}
                value={
                  report.evidence.ownerCanModifyTax ? t("report.ownerOpen") : t("report.ownerClosed")
                }
              />
              <Evidence
                label={t("report.blacklistFn")}
                value={report.evidence.blacklistFunction ? t("common.found") : t("common.notFound")}
                tone={report.evidence.blacklistFunction ? "text-[#fca5a5]" : "text-[#6ee7b7]"}
              />
              <Evidence
                label={t("report.mintAuth")}
                value={report.evidence.mintable ? t("report.exists") : t("common.notFound")}
              />
              <Evidence
                label={t("report.pauseAuth")}
                value={report.evidence.pausable ? t("report.pausable") : t("common.notFound")}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#262932] bg-[#16181d] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#f9fafb]">{t("report.lp")}</h2>
              <span className={report.evidence.lpLocked ? "text-[#6ee7b7]" : "text-[#fca5a5]"}>
                {report.evidence.lpLocked ? t("common.locked") : t("common.unlocked")}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric label={t("report.lpValue")} value={`$${report.evidence.lpValueUsd ?? "N/A"}`} />
              <Metric label="Holder" value={String(report.evidence.holderCount ?? "N/A")} />
              <Metric label="Top 10" value={`${report.evidence.top10HolderPercent ?? "N/A"}%`} />
              <Metric label={t("report.riskScore")} value={String(report.score ?? "N/A")} />
            </div>
          </section>
        </div>

        <section className="mt-5">
          <h2 className="text-xl font-semibold text-[#f9fafb]">{t("report.reasons")}</h2>
          <div className="mt-3 space-y-3">
            {report.reasons.map((reason) => (
              <article key={reason.title} className="rounded-xl border border-[#262932] bg-[#16181d] p-4">
                <p className={`text-[11px] font-semibold uppercase ${reasonSeverityStyles[reason.severity]}`}>
                  {reason.severity}
                </p>
                <h3 className="mt-1.5 text-base font-semibold text-[#f9fafb]">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{reason.explanation}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#262932] bg-[#16181d]">
          <h2 className="border-b border-[#262932] p-4 text-lg font-semibold text-[#f9fafb]">
            {t("report.evidence")}
          </h2>
          <div className="p-4">
            <p className="font-mono text-sm text-[#c0c1ff]">
              honeypotDetected={String(Boolean(report.evidence.honeypotDetected))}
            </p>
            <p className="mt-2 font-mono text-xs text-[#9ca3af]">
              sourceVerified={String(Boolean(report.evidence.sourceVerified))} · blacklist=
              {String(Boolean(report.evidence.blacklistFunction))}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#c7c4d7]">
              {report.mode === "live" ? t("report.evidenceLive") : t("report.evidenceMock")}
            </p>
          </div>
        </section>

        <Link
          href="/app/points"
          className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[#eab308]/35 bg-[#16181d] p-4"
        >
          <div>
            <p className="text-xs font-semibold text-[#eab308]">{t("report.vpCta")}</p>
            <p className="mt-1 text-sm text-[#c7c4d7]">{t("report.vpCtaDesc")}</p>
          </div>
          <span className="shrink-0 rounded-lg bg-[#eab308]/15 px-3 py-2 text-xs font-semibold text-[#eab308]">
            {t("report.viewVp")}
          </span>
        </Link>

        <aside id="share-report" className="mt-5 scroll-mt-28 rounded-2xl border border-[#262932] bg-[#16181d] p-4">
          <h2 className="text-base font-semibold text-[#f9fafb]">{t("report.shareTitle")}</h2>
          <p className="mt-2 text-xs leading-5 text-[#9ca3af]">{t("report.shareHint")}</p>
          <div className="mt-3 break-all rounded-lg border border-[#34343d] bg-[#0d0d15] p-3 text-xs text-[#c7c4d7]">
            {trackedShareText}
          </div>
          <p className="mt-3 text-[11px] text-[#9ca3af]">
            {t("report.generatedAt")}
            {new Date(report.checkedAt).toLocaleString(dateLocale)} · mode={report.mode}
          </p>
          <p className="mt-3 border-t border-[#262932] pt-3 text-[11px] leading-5 text-[#9ca3af]">
            {t("report.disclaimer")}
          </p>
        </aside>
      </section>
      <ReportActionBar
        reportUrl={trackedReportUrl}
        chain={report.chain}
        address={report.tokenAddress}
      />
      <MobileNav active="database" />
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
    <div className="flex items-center justify-between border-b border-[#262932] pb-2.5 text-sm last:border-0">
      <span className="text-[#9ca3af]">{label}</span>
      <span className={`font-semibold ${tone}`}>{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#262932] bg-[#0d0d15] p-3">
      <p className="text-[11px] text-[#9ca3af]">{label}</p>
      <p className="mt-1.5 text-lg font-semibold text-[#f9fafb]">{value}</p>
    </div>
  );
}
