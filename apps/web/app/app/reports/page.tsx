"use client";

import Link from "next/link";
import { listMockTokenReportIndex } from "@chainvigil/risk-core";
import { useLocale } from "../../i18n/locale-context";
import { MobileNav } from "../../ui/mobile-nav";
import { RiskBadge } from "../../ui/risk-badge";
import { SiteHeader } from "../../ui/site-header";

export default function AppReportsPage() {
  const { locale, t } = useLocale();
  const reports = listMockTokenReportIndex("http://localhost:3000", locale);

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-10">
      <SiteHeader active="intel" />
      <div className="mx-auto max-w-6xl px-5 py-9 md:px-8">
        <section>
          <p className="text-sm font-semibold text-[#c0c1ff]">Read-only index</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">{t("reports.title")}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">{t("reports.subtitle")}</p>
        </section>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [t("reports.statSamples"), reports.length],
            [t("reports.statChains"), "SOL / BNB"],
            [t("reports.statStatus"), "V0 mock"],
          ].map(([label, value]) => (
            <article key={String(label)} className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
              <p className="text-sm text-[#9ca3af]">{label}</p>
              <p className="mt-3 text-xl font-semibold text-[#f9fafb]">{value}</p>
            </article>
          ))}
        </section>
        <section className="mt-8 space-y-4">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={report.reportUrl}
              className="block rounded-xl border border-[#262932] bg-[#16181d] p-5 transition-colors hover:border-[#464554]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-[#f9fafb]">
                      {report.tokenName} · {report.tokenSymbol}
                    </h2>
                    <span className="rounded bg-[#292932] px-2 py-1 text-xs text-[#c7c4d7]">
                      {report.chain}
                    </span>
                  </div>
                  <p className="mt-2 break-all font-mono text-xs text-[#c7c4d7]">
                    {report.tokenAddress}
                  </p>
                </div>
                <RiskBadge level={report.riskLevel} label={report.label} />
              </div>
              <p className="mt-4 leading-7 text-[#c7c4d7]">{report.summary}</p>
              <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-[#262932] pt-4 text-sm">
                <span className="text-[#9ca3af]">
                  {t("common.source")}
                  {report.source} · {t("common.score")} {report.score ?? "--"}
                </span>
                <span className="font-semibold text-[#c0c1ff]">{t("common.viewReport")}</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
      <MobileNav active="database" />
    </main>
  );
}
