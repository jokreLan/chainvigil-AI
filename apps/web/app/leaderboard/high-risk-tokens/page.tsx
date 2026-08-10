"use client";

import Link from "next/link";
import { listMockHighRiskTokens } from "@chainvigil/risk-core";
import { useLocale } from "../../i18n/locale-context";
import { IntelligenceSubnav } from "../../ui/intelligence-subnav";
import { RiskBadge } from "../../ui/risk-badge";
import { WebsiteFooter } from "../../ui/website-footer";
import { WebsiteHeader } from "../../ui/website-header";

function chainLabel(chain: string) {
  if (chain === "bsc") return "BNB";
  if (chain === "solana") return "SOL";
  return chain;
}

export default function HighRiskTokensPage() {
  const { locale, t } = useLocale();
  const tokens = listMockHighRiskTokens("", locale);

  return (
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader active="intel" />
      <IntelligenceSubnav active="high-risk" />

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section>
          <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
            Solana &amp; BNB · Sample evidence index
          </p>
          <h1 className="mt-3 cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl lg:text-6xl">
            {t("board.title")}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#9dacad] sm:text-lg">
            {t("board.subtitle")}
          </p>
          <p className="mt-5 max-w-3xl border border-[#e7b900]/30 bg-[#e7b900]/6 px-4 py-3 text-xs leading-5 text-[#f3d36b]">
            {t("board.honesty")}
          </p>
        </section>

        <nav className="mt-8 flex gap-2 overflow-x-auto pb-1">
          <span className="flex min-h-11 shrink-0 items-center bg-[#00d9f2] px-4 cv-font-mono text-[11px] font-semibold uppercase text-[#002b31]">
            {t("common.highRiskCa")}
          </span>
          <Link
            href="/fake-token-database"
            className="flex min-h-11 shrink-0 items-center border border-[#3b494c] bg-[#0d1516] px-4 cv-font-mono text-[11px] uppercase text-[#bac9cc]"
          >
            {t("common.fakeDb")}
          </Link>
          <span className="flex min-h-11 shrink-0 items-center border border-[#3b494c] bg-[#0d1516] px-4 cv-font-mono text-[11px] uppercase text-[#849396]">
            {t("board.deployers")}
          </span>
        </nav>

        <section className="mt-5 grid gap-4 border border-[#3b494c]/65 bg-[#0d1516]/88 p-5 md:grid-cols-2">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            Chain type
          </label>
          <p className="border border-[#3b494c] bg-[#071012] px-3 py-3 text-sm">
            Solana / BNB Smart Chain
          </p>
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            Risk / Update
          </label>
          <p className="border border-[#3b494c] bg-[#071012] px-3 py-3 text-sm">
            {t("board.mockFilter")}
          </p>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          {tokens.map((token, index) => (
            <article
              key={token.id}
              className="cv-website-panel border border-[#3b494c]/70 bg-[#0d1516]/88 p-5 transition hover:border-[#00d9f2]/45"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="cv-font-mono text-lg font-bold text-[#ff8a80]">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-[#dce4e5]">
                        {token.tokenSymbol}
                      </h2>
                      <span className="border border-[#3b494c] bg-[#071012] px-2 py-0.5 cv-font-mono text-[10px] uppercase text-[#bac9cc]">
                        {chainLabel(token.chain)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#9ca3af]">
                      {token.tokenName}
                    </p>
                    <p className="mt-1 break-all cv-font-mono text-[11px] text-[#bac9cc]">
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
                    className="border border-[#3b494c]/60 bg-[#071012] px-2 py-1 cv-font-mono text-[10px] text-[#849396]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#3b494c]/55 pt-4">
                <span className="text-xs text-[#9ca3af]">
                  SAMPLE LABEL · {token.riskLevel.toUpperCase()}
                </span>
                <Link
                  href={
                    token.reportUrl ||
                    `/token/${token.chain}/${token.tokenAddress}`
                  }
                  className="inline-flex min-h-11 items-center border border-[#3b494c] px-3 cv-font-mono text-[11px] font-semibold uppercase text-[#dce4e5]"
                >
                  {t("common.viewReport")}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 border border-[#3b494c] bg-[#071012] p-5 text-sm leading-6 text-[#9dacad]">
          <strong className="text-[#f3d36b]">{t("common.important")}</strong>
          {t("board.disclaimer")}
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
