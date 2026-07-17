"use client";

import Link from "next/link";
import { listMockRiskDatabaseEntries } from "@chainvigil/risk-core";
import { useLocale } from "../i18n/locale-context";
import { RiskBadge } from "../ui/risk-badge";
import { MobileNav } from "../ui/mobile-nav";
import { SiteHeader } from "../ui/site-header";

export default function RiskDatabasePage() {
  const { locale, t } = useLocale();
  const entries = listMockRiskDatabaseEntries(locale);

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-4 pb-28 md:px-8">
      <SiteHeader active="intel" />

      <section className="mx-auto mt-8 max-w-lg md:max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#c0c1ff]">
          V0 mock · Risk education
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#f9fafb] md:text-5xl">{t("riskDb.title")}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#c7c4d7] md:text-base">
          {t("riskDb.subtitle")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/leaderboard/high-risk-tokens"
            className="rounded-full border border-[#262932] px-3 py-1.5 text-xs text-[#c7c4d7]"
          >
            {t("common.highRiskCa")}
          </Link>
          <Link
            href="/fake-token-database"
            className="rounded-full border border-[#262932] px-3 py-1.5 text-xs text-[#c7c4d7]"
          >
            {t("common.fakeDb")}
          </Link>
          <Link
            href="/learn"
            className="rounded-full bg-[#6f00be] px-3 py-1.5 text-xs font-semibold text-[#f0dbff]"
          >
            {t("common.riskWiki")}
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-lg gap-3 md:max-w-5xl md:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-2xl border border-[#262932] bg-[#16181d] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#f9fafb]">{entry.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9ca3af]">{t("common.sample")}</span>
                <RiskBadge level={entry.severity} />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#c7c4d7]">{entry.plainLanguage}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.signals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-md bg-[#292932] px-2 py-1 font-mono text-[11px] text-[#c7c4d7]"
                >
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-4 border-t border-[#262932] pt-3 text-sm leading-6 text-[#c0c1ff]">
              {entry.recommendedAction}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-8 max-w-lg rounded-2xl border border-[#8083ff]/30 bg-[#16181d] p-5 text-center md:max-w-5xl">
        <p className="font-semibold text-[#f9fafb]">{t("common.suspiciousCa")}</p>
        <p className="mt-2 text-sm text-[#9ca3af]">{t("common.dontGuess")}</p>
        <Link
          href="/check"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#8083ff] px-5 text-sm font-semibold text-[#0d0096]"
        >
          {t("common.ctaScan")}
        </Link>
      </section>

      <MobileNav active="database" />
    </main>
  );
}
