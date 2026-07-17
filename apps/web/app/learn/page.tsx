"use client";

import Link from "next/link";
import { listMockRiskEducationLessons } from "@chainvigil/risk-core";
import { useLocale } from "../i18n/locale-context";
import { listGeoArticles } from "../lib/geo-articles";
import { MobileNav } from "../ui/mobile-nav";
import { SiteHeader } from "../ui/site-header";

export default function LearnPage() {
  const { locale, t } = useLocale();
  const lessons = listMockRiskEducationLessons(locale);
  const geoArticles = listGeoArticles(locale);
  const [featured, ...recent] = lessons;

  if (!featured) return null;

  const categoryLabels = [
    { name: t("learn.catHoneypot"), href: "/learn/honeypot" },
    { name: t("learn.catTax"), href: "/learn/sell-tax" },
    { name: t("learn.catBlacklist"), href: "/learn/blacklist" },
    { name: t("learn.catLp"), href: "/learn/lp-unlocked" },
    { name: t("learn.catApproval"), href: "/learn/unlimited-approval" },
    { name: t("learn.catPhish"), href: "/learn/fake-usdt" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28 text-[#e4e1ed]">
      <SiteHeader active="intel" />

      <div className="mx-auto max-w-lg px-4 py-8 md:max-w-xl">
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#c0c1ff]">Risk Encyclopedia</p>
          <h1 className="mt-2 text-3xl font-bold text-[#f9fafb]">{t("learn.title")}</h1>
          <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{t("learn.subtitle")}</p>
        </section>

        <Link
          href="/check"
          className="mt-6 flex h-12 items-center rounded-2xl border border-[#262932] bg-[#16181d] px-4 text-sm text-[#9ca3af]"
        >
          {t("learn.search")}
        </Link>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#f9fafb]">{t("learn.categories")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {categoryLabels.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-full border border-[#262932] bg-[#16181d] px-3 py-1.5 text-xs text-[#c7c4d7]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#f9fafb]">
            {locale === "zh" ? "GEO 核心词条" : "Core GEO articles"}
          </h2>
          <div className="mt-3 space-y-2">
            {geoArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="block rounded-2xl border border-[#262932] bg-[#16181d] p-4 transition hover:border-[#464554]"
              >
                <p className="font-semibold text-[#f9fafb]">{article.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#9ca3af]">{article.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#f9fafb]">{t("learn.featured")}</h2>
          <article className="mt-3 rounded-2xl border border-[#ef4444]/30 bg-[#16181d] p-5">
            <span className="rounded-full bg-[#ef4444]/15 px-2.5 py-1 text-[10px] font-semibold text-[#fca5a5]">
              CRITICAL RISK
            </span>
            <h3 className="mt-3 text-xl font-semibold text-[#f9fafb]">{featured.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{featured.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {featured.relatedSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded bg-[#292932] px-2 py-1 font-mono text-[10px] text-[#9ca3af]"
                >
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-[#c0c1ff]">{featured.recommendedAction}</p>
            <Link href="/risk-database" className="mt-4 inline-flex text-sm font-semibold text-[#c0c1ff]">
              {t("learn.readMore")}
            </Link>
          </article>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#f9fafb]">{t("learn.recent")}</h2>
          <div className="mt-3 space-y-3">
            {(recent.length ? recent : lessons).map((lesson) => (
              <article key={lesson.id} className="rounded-2xl border border-[#262932] bg-[#16181d] p-4">
                <p className="text-[11px] uppercase text-[#9ca3af]">{lesson.category}</p>
                <h3 className="mt-1 font-semibold text-[#f9fafb]">{lesson.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{lesson.summary}</p>
              </article>
            ))}
          </div>
          <Link href="/risk-database" className="mt-4 block text-center text-sm font-semibold text-[#c0c1ff]">
            {t("learn.viewAll")}
          </Link>
        </section>

        <section className="mt-8 rounded-2xl border border-[#8083ff]/30 bg-[#16181d] p-5 text-center">
          <p className="font-semibold text-[#f9fafb]">{t("common.suspiciousCa")}</p>
          <p className="mt-2 text-sm text-[#9ca3af]">{t("common.dontGuessLong")}</p>
          <Link
            href="/check"
            className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#8083ff] px-5 text-sm font-semibold text-[#0d0096]"
          >
            {t("common.ctaScan")}
          </Link>
        </section>
      </div>
      <MobileNav active="database" />
    </main>
  );
}
