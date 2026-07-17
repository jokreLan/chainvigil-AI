"use client";

import Link from "next/link";
import { listMockHighRiskTokens } from "@chainvigil/risk-core";
import { useLocale } from "../../i18n/locale-context";
import { MobileNav } from "../../ui/mobile-nav";
import { RiskBadge } from "../../ui/risk-badge";
import { SiteHeader } from "../../ui/site-header";

function chainLabel(chain: string) {
  if (chain === "bsc") return "BNB";
  if (chain === "solana") return "SOL";
  return chain;
}

export default function HighRiskTokensPage() {
  const { locale, t } = useLocale();
  const tokens = listMockHighRiskTokens("", locale);

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28 text-[#e4e1ed]">
      <SiteHeader active="intel" />

      <div className="mx-auto max-w-lg px-4 py-8 md:max-w-xl">
        <section>
          <h1 className="text-3xl font-bold text-[#f9fafb]">{t("board.title")}</h1>
          <p className="mt-1 text-sm text-[#c0c1ff]">Solana &amp; BSC · High-Risk Samples</p>
          <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{t("board.subtitle")}</p>
          <p className="mt-2 rounded-xl border border-[#eab308]/30 bg-[#eab308]/10 px-3 py-2 text-xs leading-5 text-[#fde68a]">
            {t("board.honesty")}
          </p>
        </section>

        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 rounded-full bg-[#6f00be] px-4 py-2 text-sm font-semibold text-[#f0dbff]">
            {t("common.highRiskCa")}
          </span>
          <Link
            href="/fake-token-database"
            className="shrink-0 rounded-full border border-[#262932] bg-[#16181d] px-4 py-2 text-sm text-[#c7c4d7]"
          >
            {t("common.fakeDb")}
          </Link>
          <span className="shrink-0 rounded-full border border-[#262932] bg-[#16181d] px-4 py-2 text-sm text-[#6b7280]">
            {t("board.deployers")}
          </span>
        </nav>

        <section className="mt-4 space-y-3 rounded-2xl border border-[#262932] bg-[#16181d] p-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            Chain type
          </label>
          <p className="rounded-xl border border-[#464554] bg-[#1b1b23] px-3 py-2.5 text-sm">
            Solana / BNB Smart Chain
          </p>
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            Risk / Update
          </label>
          <p className="rounded-xl border border-[#464554] bg-[#1b1b23] px-3 py-2.5 text-sm">
            {t("board.mockFilter")}
          </p>
        </section>

        <section className="mt-6 space-y-3">
          {tokens.map((token, index) => (
            <article
              key={token.id}
              className="rounded-2xl border border-[#262932] bg-[#16181d] p-4 transition hover:border-[#464554]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl font-bold text-[#ef4444]">#{index + 1}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-[#f9fafb]">{token.tokenSymbol}</h2>
                      <span className="rounded bg-[#292932] px-2 py-0.5 text-[10px] uppercase text-[#c7c4d7]">
                        {chainLabel(token.chain)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#9ca3af]">{token.tokenName}</p>
                    <p className="mt-1 break-all font-mono text-[11px] text-[#c7c4d7]">
                      {token.tokenAddress}
                    </p>
                  </div>
                </div>
                <RiskBadge level={token.riskLevel} label={token.label} />
              </div>
              <p className="mt-3 text-sm text-[#e4e1ed]">{token.reason}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {token.evidenceTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[#292932] px-2 py-1 font-mono text-[10px] text-[#9ca3af]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#262932] pt-3">
                <span className="text-xs text-[#9ca3af]">
                  {t("common.score")} {token.score ?? "--"}
                </span>
                <Link
                  href={token.reportUrl || `/token/${token.chain}/${token.tokenAddress}`}
                  className="rounded-lg border border-[#464554] px-3 py-1.5 text-xs font-semibold text-[#f9fafb]"
                >
                  {t("common.viewReport")}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-[#262932] bg-[#1b1b23] p-4 text-sm leading-6 text-[#9ca3af]">
          <strong className="text-[#f59e0b]">{t("common.important")}</strong>
          {t("board.disclaimer")}
        </section>
      </div>
      <MobileNav active="database" />
    </main>
  );
}
