"use client";

import Link from "next/link";
import { listMockFakeTokenExamples } from "@chainvigil/risk-core";
import { useLocale } from "../i18n/locale-context";
import { IntelligenceSubnav } from "../ui/intelligence-subnav";
import { RiskBadge } from "../ui/risk-badge";
import { WebsiteFooter } from "../ui/website-footer";
import { WebsiteHeader } from "../ui/website-header";

function getChainLabel(chain: string) {
  if (chain === "bsc") return "BNB Smart Chain";
  if (chain === "solana") return "Solana";
  return chain;
}

export default function FakeTokenDatabasePage() {
  const { locale, t } = useLocale();
  const examples = listMockFakeTokenExamples(locale);

  return (
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader active="intel" />
      <IntelligenceSubnav active="fake" />

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="max-w-3xl">
          <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
            Impostor examples · V0 mock · Educational
          </p>
          <h1 className="mt-3 cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl lg:text-6xl">
            {t("fakeDb.title")}
          </h1>
          <p className="mt-5 text-base leading-7 text-[#9dacad] sm:text-lg">
            {t("fakeDb.subtitle")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/leaderboard/high-risk-tokens"
              className="inline-flex min-h-11 items-center border border-[#3b494c] px-4 cv-font-mono text-[11px] uppercase text-[#bac9cc]"
            >
              {t("common.highRiskCa")}
            </Link>
            <span className="inline-flex min-h-11 items-center bg-[#00d9f2] px-4 cv-font-mono text-[11px] font-semibold uppercase text-[#002b31]">
              {t("common.fakeDb")}
            </span>
          </div>
          <Link
            href="/check"
            className="mt-7 flex min-h-14 max-w-3xl items-center border border-[#3b494c] bg-[#0d1516] px-4 text-sm text-[#849396] transition-colors hover:border-[#00d9f2]"
          >
            {t("fakeDb.search")}
          </Link>
        </section>

        <section className="cv-website-panel mt-10 border border-[#3b494c]/70 bg-[#0d1516]/88 p-5 md:p-6">
          <h2 className="cv-font-display text-2xl font-semibold text-[#dce4e5]">
            {t("fakeDb.diffTitle")}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="relative border border-[#10b981]/30 bg-[#071012] p-5">
              <span className="absolute right-0 top-0 rounded-bl-lg bg-[#10b981]/10 px-3 py-1 text-xs font-semibold text-[#10b981]">
                {t("fakeDb.officialBadge")}
              </span>
              <p className="text-lg font-semibold text-[#f9fafb]">
                {t("fakeDb.officialTitle")}
              </p>
              <p className="mt-1 text-sm text-[#9ca3af]">
                {t("fakeDb.officialDesc")}
              </p>
              <p className="mt-4 break-all rounded-md bg-[#0a0b0f] p-3 font-mono text-xs text-[#c7c4d7]">
                {t("fakeDb.officialAddr")}
              </p>
            </article>
            <article className="relative border border-[#ef4444]/30 bg-[#071012] p-5">
              <span className="absolute right-0 top-0 rounded-bl-lg bg-[#ef4444]/10 px-3 py-1 text-xs font-semibold text-[#ef4444]">
                {t("fakeDb.fakeBadge")}
              </span>
              <p className="text-lg font-semibold text-[#f9fafb]">
                {t("fakeDb.fakeTitle")}
              </p>
              <p className="mt-1 text-sm text-[#ef4444]">
                {t("fakeDb.fakeDesc")}
              </p>
              <p className="mt-4 rounded-md bg-[#ef4444]/5 p-3 font-mono text-xs text-[#ef4444] line-through">
                {t("fakeDb.fakeAddr")}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#ef4444]">
                {t("fakeDb.sampleLabel")}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[#f9fafb]">
                {t("fakeDb.sampleTitle")}
              </h2>
            </div>
            <span className="rounded-md border border-[#262932] px-3 py-2 text-xs text-[#9ca3af]">
              SOL / BNB
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {examples.map((example) => (
              <article
                key={example.id}
                className="cv-website-panel flex flex-col gap-4 border border-[#3b494c]/70 bg-[#0d1516]/88 p-5 transition-colors hover:border-[#00d9f2]/45 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#292932] text-lg text-[#ef4444]">
                    !
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#f9fafb]">
                        {example.title}
                      </h3>
                      <span className="rounded bg-[#292932] px-2 py-0.5 text-xs text-[#c7c4d7]">
                        {getChainLabel(example.chain)}
                      </span>
                      <RiskBadge
                        level={example.riskLevel}
                        label={example.impersonates}
                      />
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
                  <p className="mt-1 text-sm text-[#e4e1ed]">
                    {example.signals.join(" · ")}
                  </p>
                </div>
                <Link
                  href="/check"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center border border-[#3b494c] bg-[#071012] px-4 text-center cv-font-mono text-[11px] font-semibold uppercase text-[#dce4e5] hover:border-[#00d9f2]"
                >
                  {t("points.goCheck")}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 border border-[#3b494c] bg-[#071012] p-5 md:p-6">
          <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">
            {t("fakeDb.howTitle")}
          </h2>
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
      <WebsiteFooter />
    </main>
  );
}
