"use client";

import Link from "next/link";
import { listMockWalletWatchlist } from "@chainvigil/risk-core";
import { useLocale } from "../../i18n/locale-context";
import { WorkspaceHeader } from "../../ui/workspace-header";
import { WorkspaceMobileNav } from "../../ui/workspace-mobile-nav";

export default function WalletsPage() {
  const { locale, t } = useLocale();
  const wallets = listMockWalletWatchlist("", locale);
  const statusLabel = {
    checked: t("wallets.statusChecked"),
    pending_check: t("wallets.statusPending"),
    watching: t("wallets.statusWatching"),
  } as const;

  return (
    <main className="cv-workspace-page min-h-screen pb-24 text-[#e4e1ed] md:pb-10">
      <WorkspaceHeader desktopActive="wallets" />
      <div className="mx-auto max-w-6xl px-5 py-9 md:px-8">
        <section>
          <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#00e5ff]">Mock watchlist · Read-only</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">{t("wallets.title")}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">{t("wallets.subtitle")}</p>
          <Link
            href="/wallet-check"
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#8083ff] px-4 text-sm font-semibold text-[#0d0096]"
          >
            {t("wallets.cta")}
          </Link>
        </section>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [t("wallets.statSamples"), wallets.length],
            [t("wallets.statChecked"), wallets.filter((w) => w.status === "checked").length],
            [
              t("wallets.statHigh"),
              wallets.reduce((sum, w) => sum + (w.highRiskApprovals ?? 0), 0),
            ],
          ].map(([label, value]) => (
            <article key={String(label)} className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
              <p className="text-sm text-[#9ca3af]">{label}</p>
              <p className="mt-3 text-2xl font-semibold text-[#f9fafb]">{value}</p>
            </article>
          ))}
        </section>
        <section className="mt-8 space-y-4">
          {wallets.map((wallet) => (
            <article key={wallet.address} className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-[#f9fafb]">{wallet.label}</h2>
                    <span className="rounded bg-[#292932] px-2 py-1 text-xs text-[#c7c4d7]">
                      {wallet.chain}
                    </span>
                  </div>
                  <p className="mt-2 break-all font-mono text-xs text-[#c7c4d7]">{wallet.address}</p>
                </div>
                <span className="rounded-lg border border-[#464554] px-3 py-2 text-sm text-[#c7c4d7]">
                  {statusLabel[wallet.status]}
                </span>
              </div>
              <p className="mt-4 text-sm text-[#c0c1ff]">{wallet.summaryLabel}</p>
              <p className="mt-2 leading-7 text-[#9ca3af]">{wallet.note}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#262932] pt-4">
                <span className="text-sm text-[#9ca3af]">
                  {t("common.highRiskApprovals")}{" "}
                  {wallet.highRiskApprovals ?? t("common.pendingLookup")}
                </span>
                <Link
                  href={wallet.reportUrl}
                  className="inline-flex min-h-11 items-center rounded-lg border border-[#464554] bg-[#1f1f27] px-4 py-2 text-sm font-semibold text-[#f9fafb]"
                >
                  {t("wallets.viewHealth")}
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
      <WorkspaceMobileNav active="wallets" />
    </main>
  );
}
