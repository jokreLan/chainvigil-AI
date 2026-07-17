import Link from "next/link";
import { getMockPointLedgerSummary, getPointProgram, listPointRules } from "@chainvigil/points";
import { getServerT } from "../../i18n/server";
import { MobileNav } from "../../ui/mobile-nav";
import { SiteHeader } from "../../ui/site-header";



export default async function PointsPage({
  searchParams,
}: {
  searchParams?: Promise<{ done?: string }>;
}) {
  const { done } = (await searchParams) ?? {};
  const { t, locale } = await getServerT();
  const ledger = getMockPointLedgerSummary("visitor:mock", locale);
  const program = getPointProgram(locale);
  const rules = listPointRules(locale);
  const redemptions = program.redemptions;
  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";
  const ledgerNames = {
    xp: t("points.ledgerGrowth"),
    security_contribution: t("points.ledgerContrib"),
    growth_reward: t("points.ledgerReferral"),
  } as const;
  const statusLabel = {
    preview: t("points.statusPreview"),
    coming_soon: t("points.statusComing"),
    active: t("points.statusActive"),
  } as const;
  const tasks = [
    { type: "FIRST_CA_CHECK" as const, href: "/check?from=task", icon: "▣", cta: "SCAN" },
    { type: "REPORT_SHARED" as const, href: "/check", icon: "⌯", cta: "GO" },
    {
      type: "RISK_REPORT_SUBMITTED" as const,
      href: "/risk-database",
      icon: "⌁",
      cta: "REPORT",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28 text-[#e4e1ed]">
      <SiteHeader active="points" />

      <div className="mx-auto max-w-lg px-4 pb-8 md:max-w-xl">
        {done === "check" ? (
          <p
            role="status"
            className="mt-4 rounded-xl border border-[#10b981]/35 bg-[#10b981]/10 px-3 py-2 text-sm text-[#6ee7b7]"
          >
            {t("points.taskDone")}
          </p>
        ) : null}
        <section className="mt-4 rounded-2xl border border-[#262932] bg-[#16181d] p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#8083ff]/15 text-xs text-[#c0c1ff]">
              CV
            </span>
            <div>
              <p className="font-mono text-xs text-[#9ca3af]">visitor:mock</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6ee7b7]">
                Security contributor
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#c7c4d7]">{program.tagline}</p>
          <p className="mt-2 text-xs leading-5 text-[#9ca3af]">{program.disclaimer}</p>
        </section>

        <section className="mt-5 rounded-2xl border border-[#34343d] bg-[#16181d] p-6 text-center shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
          <p className="text-xs font-medium tracking-[0.16em] text-[#c7c4d7]">TOTAL VIGIL POINTS</p>
          <p className="mt-4 text-5xl font-bold tracking-tight text-[#eab308]">
            {ledger.totalConfirmed}
            <span className="ml-2 text-lg font-medium">VP</span>
          </p>
          <p className="mt-3 text-sm text-[#fde68a]">
            {t("points.pendingLine")} {ledger.totalPending} · {t("points.pendingOnly")}
          </p>
          <p className="mt-2 text-xs text-[#9ca3af]">
            {t("points.cashCap")} {program.cashOffsetCapPercent}% · {t("points.notToken")}
          </p>
        </section>

        <section className="mt-5 rounded-2xl border border-[#262932] bg-[#16181d] p-5">
          <h2 className="text-base font-semibold text-[#f9fafb]">Points Breakdown</h2>
          <div className="mt-4 space-y-4">
            {ledger.balances.map((balance, index) => (
              <div key={balance.ledger} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      index === 0 ? "text-[#c0c1ff]" : index === 1 ? "text-[#eab308]" : "text-[#ddb7ff]"
                    }
                  >
                    {index === 0 ? "✧" : index === 1 ? "⌁" : "⌘"}
                  </span>
                  <span className="text-sm text-[#c7c4d7]">{ledgerNames[balance.ledger]}</span>
                </div>
                <strong className="text-[#f9fafb]">{balance.confirmed} VP</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#f9fafb]">{t("points.redeem")}</h2>
            <span className="rounded bg-[#292932] px-2 py-1 text-[10px] font-semibold text-[#eab308]">
              {t("points.second")}
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {redemptions.map((item) => (
              <article
                key={item.id}
                className={`rounded-2xl border bg-[#16181d] p-4 ${
                  item.highlight ? "border-[#eab308]/35" : "border-[#262932]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[#f9fafb]">{item.title}</h3>
                      <span className="rounded border border-[#34343d] px-2 py-0.5 text-[10px] text-[#9ca3af]">
                        {statusLabel[item.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#eab308]">{item.costVp} VP</p>
                    <button
                      type="button"
                      disabled
                      className="mt-2 rounded-lg border border-[#34343d] bg-[#292932] px-3 py-1.5 text-[11px] font-semibold text-[#9ca3af]"
                    >
                      {t("points.coming")}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#f9fafb]">{t("points.tasks")}</h2>
            <span className="text-[11px] text-[#9ca3af]">{t("points.defaultPending")}</span>
          </div>
          <div className="mt-3 space-y-3">
            {tasks.map(({ type, href, icon, cta }) => {
              const rule = rules[type];
              return (
                <article
                  key={type}
                  className="flex items-center gap-3 rounded-2xl border border-[#262932] bg-[#16181d] p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#292932] text-[#c0c1ff]">
                    {icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#f9fafb]">{rule.reason}</h3>
                    <p className="mt-0.5 text-xs text-[#9ca3af]">+{rule.points} VP</p>
                  </div>
                  <Link
                    href={href}
                    className="rounded-lg bg-[#8083ff] px-3 py-2 text-[11px] font-bold text-[#0d0096]"
                  >
                    {cta}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-base font-semibold text-[#f9fafb]">{t("points.history")}</h2>
          <div className="mt-3 rounded-2xl border border-[#262932] bg-[#16181d] p-4">
            {ledger.recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between gap-3 border-b border-[#34343d] py-3 first:pt-0 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-[#f9fafb]">{event.reason}</p>
                  <p className="mt-1 text-[11px] text-[#9ca3af]">
                    {new Date(event.createdAt).toLocaleString(dateLocale)} · {event.status}
                  </p>
                </div>
                <strong
                  className={event.status === "confirmed" ? "text-[#10b981]" : "text-[#fde68a]"}
                >
                  +{event.points}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#262932] bg-[#16181d] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#f9fafb]">Vigilance Tier</h2>
            <span className="text-sm font-semibold text-[#eab308]">V0</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#34343d]">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#6f00be] to-[#8083ff]" />
          </div>
          <p className="mt-3 text-xs text-[#9ca3af]">{t("points.tierHint")}</p>
        </section>
      </div>
      <MobileNav active="points" />
    </main>
  );
}
