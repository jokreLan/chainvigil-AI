"use client";

import Link from "next/link";
import { listMockWalletWatchlist, listMockRiskMonitorRules } from "@chainvigil/risk-core";
import { getMockPointLedgerSummary } from "@chainvigil/points";
import { useLocale } from "../i18n/locale-context";
import { MobileNav } from "../ui/mobile-nav";
import { SiteHeader } from "../ui/site-header";

export default function AppDashboardPage() {
  const { locale, t } = useLocale();
  const wallets = listMockWalletWatchlist("", locale);
  const monitors = listMockRiskMonitorRules(locale);
  const points = getMockPointLedgerSummary("visitor:mock", locale);

  const modules = [
    { title: t("ws.modWallets"), href: "/app/wallets", desc: t("ws.modWalletsDesc"), tone: "#c0c1ff" },
    { title: t("ws.modApprovals"), href: "/app/approvals", desc: t("ws.modApprovalsDesc"), tone: "#f97316" },
    { title: t("ws.modBarber"), href: "/app/asset-barber", desc: t("ws.modBarberDesc"), tone: "#f59e0b" },
    { title: t("ws.modMonitor"), href: "/app/monitor", desc: t("ws.modMonitorDesc"), tone: "#10b981" },
    { title: t("ws.modReports"), href: "/app/reports", desc: t("ws.modReportsDesc"), tone: "#c0c1ff" },
    { title: t("ws.modPoints"), href: "/app/points", desc: t("ws.modPointsDesc"), tone: "#eab308" },
  ];

  const stats = [
    [t("ws.statWallets"), wallets.length, "#c0c1ff"],
    [t("ws.statMonitors"), monitors.length, "#10b981"],
    [t("ws.statVpOk"), points.totalConfirmed, "#eab308"],
    [t("ws.statVpPending"), points.totalPending, "#f59e0b"],
  ] as const;

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-10">
      <SiteHeader active="other" />
      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8">
        <section>
          <p className="text-sm font-semibold text-[#c0c1ff]">Security workspace</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">{t("ws.title")}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">{t("ws.subtitle")}</p>
        </section>
        <section className="mt-8 grid gap-4 md:grid-cols-4">
          {stats.map(([label, value, color]) => (
            <article key={label} className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
              <p className="text-sm text-[#9ca3af]">{label}</p>
              <p className="mt-3 text-2xl font-semibold" style={{ color }}>
                {value}
              </p>
            </article>
          ))}
        </section>
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#c0c1ff]">{t("ws.modules")}</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#f9fafb]">{t("ws.modulesHint")}</h2>
            </div>
            <span className="text-xs text-[#9ca3af]">V0 read-only</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="rounded-xl border border-[#262932] bg-[#16181d] p-5 transition-colors hover:border-[#464554]"
              >
                <span className="text-sm font-semibold" style={{ color: module.tone }}>
                  ●
                </span>
                <h3 className="mt-5 text-xl font-semibold text-[#f9fafb]">{module.title}</h3>
                <p className="mt-2 leading-7 text-[#9ca3af]">{module.desc}</p>
                <span className="mt-5 block text-sm font-semibold text-[#c0c1ff]">
                  {t("common.openModule")}
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="mt-10 rounded-xl border border-[#262932] bg-[#1b1b23] p-6">
          <h2 className="text-xl font-semibold text-[#f9fafb]">{t("ws.boundaryTitle")}</h2>
          <p className="mt-3 leading-7 text-[#9ca3af]">{t("ws.boundaryBody")}</p>
        </section>
      </div>
      <MobileNav active="home" />
    </main>
  );
}
