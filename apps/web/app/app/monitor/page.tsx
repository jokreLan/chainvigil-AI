"use client";

import Link from "next/link";
import { listMockRiskMonitorRules } from "@chainvigil/risk-core";
import { useLocale } from "../../i18n/locale-context";
import { WorkspaceHeader } from "../../ui/workspace-header";
import { WorkspaceMobileNav } from "../../ui/workspace-mobile-nav";

const severityColor = {
  BLOCK: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#f59e0b",
  LOW: "#10b981",
  UNKNOWN: "#9ca3af",
} as const;

export default function MonitorPage() {
  const { locale, t } = useLocale();
  const monitors = listMockRiskMonitorRules(locale);
  const statusLabel = {
    watching: t("monitor.statusWatching"),
    needs_review: t("monitor.statusReview"),
    paused: t("monitor.statusPaused"),
  } as const;

  return (
    <main className="cv-workspace-page min-h-screen pb-24 text-[#e4e1ed] md:pb-10">
      <WorkspaceHeader desktopActive="monitor" />
      <div className="mx-auto max-w-6xl px-5 py-9 md:px-8">
        <section>
          <p className="cv-font-mono text-xs font-semibold tracking-[0.1em] text-[#00e5ff]">MOCK RULE LIBRARY · READ-ONLY · NOT LIVE ALERTS</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">{t("monitor.title")}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">{t("monitor.subtitle")}</p>
          <p className="mt-2 text-sm text-[#c7c4d7]">{t("monitor.headerHint")}</p>
        </section>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            [t("monitor.statRules"), monitors.length, "#c0c1ff"],
            [
              t("monitor.statWatching"),
              monitors.filter((item) => item.status === "watching").length,
              "#10b981",
            ],
            [
              t("monitor.statReview"),
              monitors.filter((item) => item.status === "needs_review").length,
              "#f59e0b",
            ],
          ].map(([label, value, color]) => (
            <article key={String(label)} className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
              <p className="text-sm text-[#9ca3af]">{label}</p>
              <p className="mt-3 text-2xl font-semibold" style={{ color: String(color) }}>
                {value}
              </p>
            </article>
          ))}
        </section>
        <section className="mt-8 space-y-4">
          {monitors.map((monitor) => (
            <article key={monitor.id} className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-[#f9fafb]">{monitor.title}</h2>
                    <span
                      className="rounded px-2 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: `${severityColor[monitor.severity]}1a`,
                        color: severityColor[monitor.severity],
                      }}
                    >
                      {monitor.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#9ca3af]">
                    {t("common.target")}
                    {monitor.targetType} · {t("common.cadence")}
                    {monitor.cadenceLabel}
                  </p>
                </div>
                <span className="rounded-lg border border-[#464554] px-3 py-2 text-sm text-[#c7c4d7]">
                  {statusLabel[monitor.status]}
                </span>
              </div>
              <p className="mt-5 leading-7 text-[#c7c4d7]">{monitor.explanation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {monitor.signals.map((signal) => (
                  <span key={signal} className="rounded bg-[#292932] px-2 py-1 font-mono text-xs text-[#9ca3af]">
                    {signal}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#9ca3af]">
                {locale === "zh" ? "样例状态，不代表实时监控事件" : "Sample state — not a live monitoring event"}
              </p>
            </article>
          ))}
        </section>
        <section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-5 text-sm leading-7 text-[#9ca3af]">
          {t("monitor.footer")}
        </section>
        <Link href="/check" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#c0c1ff]">
          {t("points.goCheck")}
        </Link>
      </div>
      <WorkspaceMobileNav />
    </main>
  );
}
