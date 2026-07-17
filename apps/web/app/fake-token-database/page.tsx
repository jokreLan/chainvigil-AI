"use client";

import Link from "next/link";
import { listMockFakeTokenExamples } from "@chainvigil/risk-core";
import { useLocale } from "../i18n/locale-context";
import { MobileNav } from "../ui/mobile-nav";
import { RiskBadge } from "../ui/risk-badge";
import { SiteHeader } from "../ui/site-header";

function getChainLabel(chain: string) {
  if (chain === "bsc") return "BNB Smart Chain";
  if (chain === "solana") return "Solana";
  return chain;
}

export default function FakeTokenDatabasePage() {
  const { locale, t } = useLocale();
  const examples = listMockFakeTokenExamples(locale);

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-8">
      <SiteHeader active="intel" />

      <div className="mx-auto grid max-w-7xl md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-65px)] border-r border-[#262932] bg-[#16181d] px-4 py-7 md:block">
          <nav className="space-y-2 text-sm text-[#c7c4d7]">
            <Link className="block rounded-lg px-4 py-3 hover:bg-[#292932]" href="/">
              {t("nav.home")}
            </Link>
            <Link className="block rounded-lg px-4 py-3 hover:bg-[#292932]" href="/wallet-check">
              {t("nav.wallet")}
            </Link>
            <Link
              className="block rounded-lg bg-[#6f00be] px-4 py-3 font-semibold text-[#f0dbff]"
              href="/fake-token-database"
            >
              {t("fakeDb.threatDb")}
            </Link>
            <Link className="block rounded-lg px-4 py-3 hover:bg-[#292932]" href="/app/points">
              {t("nav.points")}
            </Link>
          </nav>
        </aside>

        <div className="min-w-0 px-5 py-9 md:px-10 md:py-12">
          <section className="max-w-3xl">
            <p className="text-sm font-semibold text-[#c0c1ff]">Fake Token Database · V0 mock</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">
              {t("fakeDb.title")}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#9ca3af] md:text-lg">
              {t("fakeDb.subtitle")}
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/leaderboard/high-risk-tokens"
                className="rounded-full border border-[#262932] px-3 py-1.5 text-xs text-[#c7c4d7]"
              >
                {t("common.highRiskCa")}
              </Link>
              <span className="rounded-full bg-[#6f00be] px-3 py-1.5 text-xs font-semibold text-[#f0dbff]">
                {t("common.fakeDb")}
              </span>
            </div>
            <Link
              href="/check"
              className="mt-6 flex h-14 max-w-3xl items-center rounded-lg border border-[#262932] bg-[#16181d] px-4 text-sm text-[#9ca3af] transition-colors hover:border-[#c0c1ff]"
            >
              {t("fakeDb.search")}
            </Link>
          </section>

          <section className="mt-8 rounded-xl border border-[#262932] bg-[#16181d] p-5 md:p-6">
            <h2 className="text-xl font-semibold text-[#f9fafb]">{t("fakeDb.diffTitle")}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <article className="relative rounded-lg border border-[#10b981]/30 bg-[#1b1b23] p-5">
                <span className="absolute right-0 top-0 rounded-bl-lg bg-[#10b981]/10 px-3 py-1 text-xs font-semibold text-[#10b981]">
                  {t("fakeDb.officialBadge")}
                </span>
                <p className="text-lg font-semibold text-[#f9fafb]">{t("fakeDb.officialTitle")}</p>
                <p className="mt-1 text-sm text-[#9ca3af]">{t("fakeDb.officialDesc")}</p>
                <p className="mt-4 break-all rounded-md bg-[#0a0b0f] p-3 font-mono text-xs text-[#c7c4d7]">
                  {t("fakeDb.officialAddr")}
                </p>
              </article>
              <article className="relative rounded-lg border border-[#ef4444]/30 bg-[#1b1b23] p-5">
                <span className="absolute right-0 top-0 rounded-bl-lg bg-[#ef4444]/10 px-3 py-1 text-xs font-semibold text-[#ef4444]">
                  {t("fakeDb.fakeBadge")}
                </span>
                <p className="text-lg font-semibold text-[#f9fafb]">{t("fakeDb.fakeTitle")}</p>
                <p className="mt-1 text-sm text-[#ef4444]">{t("fakeDb.fakeDesc")}</p>
                <p className="mt-4 rounded-md bg-[#ef4444]/5 p-3 font-mono text-xs text-[#ef4444] line-through">
                  {t("fakeDb.fakeAddr")}
                </p>
              </article>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#ef4444]">{t("fakeDb.sampleLabel")}</p>
                <h2 className="mt-1 text-2xl font-semibold text-[#f9fafb]">{t("fakeDb.sampleTitle")}</h2>
              </div>
              <span className="rounded-md border border-[#262932] px-3 py-2 text-xs text-[#9ca3af]">
                SOL / BNB
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {examples.map((example) => (
                <article
                  key={example.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#262932] bg-[#16181d] p-5 transition-colors hover:border-[#464554] md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#292932] text-lg text-[#ef4444]">
                      !
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#f9fafb]">{example.title}</h3>
                        <span className="rounded bg-[#292932] px-2 py-0.5 text-xs text-[#c7c4d7]">
                          {getChainLabel(example.chain)}
                        </span>
                        <RiskBadge level={example.riskLevel} label={example.impersonates} />
                      </div>
                      <p className="mt-1 text-sm text-[#9ca3af]">
                        {example.impersonates}: {example.description}
                      </p>
                    </div>
                  </div>
                  <div className="min-w-0 md:max-w-xs md:border-l md:border-[#262932] md:px-5">
                    <p className="text-xs font-semibold uppercase text-[#ef4444]">
                      {t("fakeDb.riskSignals")}
                    </p>
                    <p className="mt-1 text-sm text-[#e4e1ed]">{example.signals.join(" · ")}</p>
                  </div>
                  <Link
                    href="/check"
                    className="shrink-0 rounded-lg border border-[#262932] bg-[#1f1f27] px-4 py-2 text-center text-sm font-semibold text-[#f9fafb] hover:bg-[#292932]"
                  >
                    {t("points.goCheck")}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-5 md:p-6">
            <h2 className="text-xl font-semibold text-[#f9fafb]">{t("fakeDb.howTitle")}</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[#c7c4d7]">
              <li>
                <span className="mr-3 font-semibold text-[#c0c1ff]">01</span>
                {t("fakeDb.how1")}
              </li>
              <li>
                <span className="mr-3 font-semibold text-[#c0c1ff]">02</span>
                {t("fakeDb.how2")}
              </li>
              <li>
                <span className="mr-3 font-semibold text-[#c0c1ff]">03</span>
                {t("fakeDb.how3")}
              </li>
            </ol>
          </section>
        </div>
      </div>
      <MobileNav active="database" />
    </main>
  );
}
