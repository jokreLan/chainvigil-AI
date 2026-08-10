"use client";

import Link from "next/link";
import { listMockRiskDatabaseEntries } from "@chainvigil/risk-core";
import { useLocale } from "../i18n/locale-context";
import { IntelligenceSubnav } from "../ui/intelligence-subnav";
import { RiskBadge } from "../ui/risk-badge";
import { WebsiteFooter } from "../ui/website-footer";
import { WebsiteHeader } from "../ui/website-header";

export default function RiskDatabasePage() {
  const { locale, t } = useLocale();
  const entries = listMockRiskDatabaseEntries(locale);

  return (
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader active="intel" />
      <IntelligenceSubnav active="database" />

      <section className="mx-auto max-w-[1180px] px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
          V0 mock · Risk education · No live claim
        </p>
        <h1 className="mt-3 cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl lg:text-6xl">
          {t("riskDb.title")}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-[#9dacad] sm:text-lg">
          {t("riskDb.subtitle")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/leaderboard/high-risk-tokens"
            className="inline-flex min-h-11 items-center border border-[#3b494c] px-4 cv-font-mono text-[11px] uppercase text-[#bac9cc]"
          >
            {t("common.highRiskCa")}
          </Link>
          <Link
            href="/fake-token-database"
            className="inline-flex min-h-11 items-center border border-[#3b494c] px-4 cv-font-mono text-[11px] uppercase text-[#bac9cc]"
          >
            {t("common.fakeDb")}
          </Link>
          <Link
            href="/learn"
            className="inline-flex min-h-11 items-center bg-[#00d9f2] px-4 cv-font-mono text-[11px] font-semibold uppercase text-[#002b31]"
          >
            {t("common.riskWiki")}
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-[1180px] gap-4 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="cv-website-panel border border-[#3b494c]/70 bg-[#0d1516]/88 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">
                {entry.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9ca3af]">
                  {t("common.sample")}
                </span>
                <RiskBadge level={entry.severity} />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#9dacad]">
              {entry.plainLanguage}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.signals.map((signal) => (
                <span
                  key={signal}
                  className="border border-[#3b494c]/60 bg-[#071012] px-2 py-1 cv-font-mono text-[11px] text-[#bac9cc]"
                >
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-4 border-t border-[#3b494c]/55 pt-4 text-sm leading-6 text-[#c3f5ff]">
              {entry.recommendedAction}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-4 my-12 max-w-[1180px] border border-[#00d9f2]/30 bg-[#00d9f2]/6 p-6 text-center sm:mx-6 lg:mx-auto">
        <p className="cv-font-display text-lg font-semibold text-[#dce4e5]">
          {t("common.suspiciousCa")}
        </p>
        <p className="mt-2 text-sm text-[#9dacad]">{t("common.dontGuess")}</p>
        <Link
          href="/check"
          className="mt-5 inline-flex min-h-11 items-center bg-[#00d9f2] px-5 cv-font-mono text-xs font-semibold uppercase text-[#002b31]"
        >
          {t("common.ctaScan")}
        </Link>
      </section>

      <WebsiteFooter />
    </main>
  );
}
