"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { MobileNav } from "../ui/mobile-nav";
import { SiteHeader } from "../ui/site-header";

export default function IntelHubPage() {
  const { locale, t } = useLocale();
  const isZh = locale === "zh";

  const hubs = [
    {
      href: "/leaderboard/high-risk-tokens",
      title: isZh ? "高危 CA 榜单" : "High-risk CA list",
      desc: isZh
        ? "禁买 / 高危样例，先看案例再查自己的 CA。"
        : "Block / high-risk samples — learn cases before scanning your CA.",
      badge: "BLOCK / HIGH",
      tone: "border-[#ef4444]/35",
    },
    {
      href: "/fake-token-database",
      title: isZh ? "假币数据库" : "Fake token DB",
      desc: isZh
        ? "官方 vs 仿盘对照，买前核对合约地址。"
        : "Official vs impostor contracts — verify address before buy.",
      badge: "Fake",
      tone: "border-[#f97316]/35",
    },
    {
      href: "/risk-database",
      title: isZh ? "风险数据库" : "Risk database",
      desc: isZh
        ? "风险类型人话解释与信号清单。"
        : "Plain-language risk types and signal checklist.",
      badge: "Edu",
      tone: "border-[#8083ff]/35",
    },
    {
      href: "/learn",
      title: isZh ? "风险百科" : "Risk encyclopedia",
      desc: isZh
        ? "貔貅、LP、授权等专题文章入口。"
        : "Honeypot, LP, approvals and more guides.",
      badge: "Learn",
      tone: "border-[#c0c1ff]/35",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28">
      <SiteHeader active="intel" />
      <div className="mx-auto max-w-lg px-4 py-8 md:max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#c0c1ff]">Intelligence hub</p>
        <h1 className="mt-2 text-3xl font-bold text-[#f9fafb]">{t("intel.title")}</h1>
        <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{t("intel.subtitle")}</p>

        <Link
          href="/check"
          className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-[#8083ff] text-sm font-semibold text-[#0d0096]"
        >
          {t("intel.goCheck")}
        </Link>

        <section className="mt-8 space-y-3">
          {hubs.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl border bg-[#16181d] p-5 transition hover:border-[#464554] ${item.tone}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#f9fafb]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{item.desc}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#292932] px-2 py-1 text-[10px] text-[#9ca3af]">
                  {item.badge}
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold text-[#c0c1ff]">{t("intel.open")}</p>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-[#262932] bg-[#1b1b23] p-4 text-sm leading-6 text-[#9ca3af]">
          <strong className="text-[#fde68a]">{t("intel.emptyHint")}</strong>
          {t("intel.emptyBody")}
        </section>
      </div>
      <MobileNav active="database" />
    </main>
  );
}
