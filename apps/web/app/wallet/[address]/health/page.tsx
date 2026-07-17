import type { Metadata } from "next";
import Link from "next/link";
import { buildMockWalletHealthReport } from "@chainvigil/risk-core";
import type { ApprovalRiskLevel } from "@chainvigil/types";
import { getServerT } from "../../../i18n/server";
import { CopyValueButton } from "../../../ui/copy-value-button";
import { HealthScoreRing } from "../../../ui/health-score-ring";
import { ReportModeBanner } from "../../../ui/report-mode-banner";

interface WalletHealthPageProps {
  params: Promise<{
    address: string;
  }>;
}

const approvalRiskStyles: Record<ApprovalRiskLevel, string> = {
  HIGH: "border-[#ef4444]/40 bg-[#ef4444]/10 text-[#fca5a5]",
  MEDIUM: "border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#fde68a]",
  LOW: "border-[#10b981]/40 bg-[#10b981]/10 text-[#6ee7b7]",
  UNKNOWN: "border-[#6b7280]/40 bg-[#6b7280]/10 text-[#d1d5db]",
};

export async function generateMetadata({ params }: WalletHealthPageProps): Promise<Metadata> {
  const { address } = await params;
  const { locale } = await getServerT();
  const report = buildMockWalletHealthReport({ address, locale });

  return {
    title: `Wallet health｜${report.summary.label}｜ChainVigil AI`,
    description: `Read-only wallet check (${report.mode}). Not investment advice.`,
    // Wallet addresses are private tool pages — never long-tail SEO.
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}

export default async function WalletHealthPage({ params }: WalletHealthPageProps) {
  const { address } = await params;
  const { t, locale } = await getServerT();
  const report = buildMockWalletHealthReport({ address, locale });
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          {t("brand.name")}
        </Link>
        <Link href="/wallet-check">{t("common.recheckWallet")}</Link>
      </nav>

      <section className="mx-auto mt-12 grid max-w-7xl gap-8 lg:grid-cols-[22rem_1fr]">
        <aside className="h-fit rounded-lg border border-[#f97316]/40 bg-[#f97316]/10 p-5">
          <HealthScoreRing score={report.summary.score} label={report.summary.label} />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <p className="break-all font-mono text-sm leading-6 text-[#c7c4d7]">{report.address}</p>
            <CopyValueButton value={report.address} label={t("common.copyAddress")} />
          </div>
          <p className="mt-6 border-t border-[#f97316]/25 pt-5 text-xs leading-5 text-[#c7c4d7]">
            {report.disclaimer}
          </p>
        </aside>

        <div>
          <p className="text-sm font-semibold text-[#c0c1ff]">
            BNB Smart Chain · {report.mode.toUpperCase()} · Read-only
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[#f9fafb]">{t("walletReport.title")}</h1>
          <div className="mt-4">
            <ReportModeBanner
              mode={report.mode}
              confidence={report.confidence}
              confidenceScore={report.confidenceScore}
            />
          </div>
          <p className="mt-4 text-[#9ca3af]">
            {t("walletReport.generated")}
            {new Date(report.checkedAt).toLocaleString(dateLocale)} · {t("walletReport.noSign")}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/app/approvals"
              className="inline-flex min-h-11 items-center rounded-xl bg-[#8083ff] px-4 text-sm font-semibold text-[#0d0096]"
            >
              {t("wallet.viewApprovals")}
            </Link>
            <Link
              href="/app/asset-barber"
              className="inline-flex min-h-11 items-center rounded-xl border border-[#464554] px-4 text-sm font-semibold text-[#f9fafb]"
            >
              {t("wallet.assetBarber")}
            </Link>
            <Link
              href="/check"
              className="inline-flex min-h-11 items-center rounded-xl border border-[#464554] px-4 text-sm font-semibold text-[#f9fafb]"
            >
              {t("wallet.goCheck")}
            </Link>
          </div>

          <section className="mt-8 grid gap-3 sm:grid-cols-5">
            <Metric label={t("walletReport.metricHigh")} value={String(report.summary.highRiskApprovals)} />
            <Metric
              label={t("walletReport.metricInfinite")}
              value={String(report.summary.infiniteApprovals)}
            />
            <Metric
              label={t("walletReport.metricSuspicious")}
              value={String(report.summary.suspiciousTokens)}
            />
            <Metric label={t("walletReport.metricSpam")} value={String(report.summary.spamNfts)} />
            <Metric label={t("walletReport.metricDust")} value={`$${report.summary.dustValueUsd}`} />
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-[#f9fafb]">{t("walletReport.approvals")}</h2>
            <div className="mt-4 space-y-4">
              {report.approvals.map((approval) => (
                <article key={approval.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[#9ca3af]">
                        {approval.assetSymbol} / {approval.assetType}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-[#f9fafb]">
                        {approval.spenderLabel}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-sm ${approvalRiskStyles[approval.riskLevel]}`}
                    >
                      {approval.riskLevel}
                    </span>
                  </div>
                  <p className="mt-3 break-all font-mono text-sm text-[#9ca3af]">
                    {approval.spenderAddress}
                  </p>
                  <p className="mt-3 text-[#c7c4d7]">{approval.recommendedAction}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {approval.riskReasons.map((reason) => (
                      <span
                        key={reason}
                        className="rounded-md bg-[#292932] px-3 py-1 text-xs text-[#c7c4d7]"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
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
