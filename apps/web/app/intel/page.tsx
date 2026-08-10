"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { IntelligenceSubnav } from "../ui/intelligence-subnav";
import { WebsiteFooter } from "../ui/website-footer";
import { WebsiteHeader } from "../ui/website-header";

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
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader active="intel" />
      <IntelligenceSubnav active="hub" />
      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
          Intelligence hub · Read-only
        </p>
        <h1 className="mt-3 max-w-4xl cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl lg:text-6xl">
          {t("intel.title")}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-[#9dacad] sm:text-lg">
          {t("intel.subtitle")}
        </p>

        <Link
          href="/check"
          className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#00d9f2] px-6 cv-font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#002b31] transition hover:bg-[#9cf0ff]"
        >
          {t("intel.goCheck")}
        </Link>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          {hubs.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`cv-website-panel group block border bg-[#0d1516]/88 p-6 transition hover:-translate-y-0.5 hover:border-[#00d9f2]/55 ${item.tone}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#9dacad]">
                    {item.desc}
                  </p>
                </div>
                <span className="shrink-0 border border-[#3b494c] bg-[#071012] px-2 py-1 cv-font-mono text-[10px] uppercase text-[#849396]">
                  {item.badge}
                </span>
              </div>
              <p className="mt-5 cv-font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#00d9f2]">
                {t("intel.open")} →
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-8 border border-[#e7b900]/30 bg-[#e7b900]/6 p-5 text-sm leading-6 text-[#9dacad]">
          <strong className="text-[#f3d36b]">{t("intel.emptyHint")}</strong>
          {t("intel.emptyBody")}
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
