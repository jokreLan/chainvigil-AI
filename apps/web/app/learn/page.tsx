"use client";

import Link from "next/link";
import { listMockRiskEducationLessons } from "@chainvigil/risk-core";
import { useLocale } from "../i18n/locale-context";
import { listGeoArticles } from "../lib/geo-articles";
import {
  countLongTailByStatus,
  longTailCategories,
  longTailCategoryMeta,
  listLongTailByCategory,
} from "../lib/long-tail-keywords";
import { IntelligenceSubnav } from "../ui/intelligence-subnav";
import { WebsiteFooter } from "../ui/website-footer";
import { WebsiteHeader } from "../ui/website-header";

export default function LearnPage() {
  const { locale, t } = useLocale();
  const lessons = listMockRiskEducationLessons(locale);
  const geoArticles = listGeoArticles(locale);
  const [featured, ...recent] = lessons;
  const longTailCounts = countLongTailByStatus();

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
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader active="learn" />
      <IntelligenceSubnav active="learn" />

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section>
          <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
            Risk Encyclopedia · GEO knowledge base
          </p>
          <h1 className="mt-3 max-w-4xl cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl lg:text-6xl">
            {t("learn.title")}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#9dacad] sm:text-lg">
            {t("learn.subtitle")}
          </p>
          <p className="mt-2 text-xs text-[#6b7280]">
            {locale === "zh"
              ? `长尾矩阵 ${longTailCounts.live + longTailCounts.mapped} 条可访问 · ${longTailCounts.deferred} 条后置 · GEO 词条 ${geoArticles.length}`
              : `Long-tail matrix: ${longTailCounts.live + longTailCounts.mapped} available · ${longTailCounts.deferred} deferred · ${geoArticles.length} GEO articles`}
          </p>
        </section>

        <Link
          href="/check"
          className="mt-7 flex min-h-14 max-w-3xl items-center border border-[#3b494c] bg-[#0d1516] px-4 text-sm text-[#849396] transition hover:border-[#00d9f2]"
        >
          {t("learn.search")}
        </Link>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#f9fafb]">
            {t("learn.categories")}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {categoryLabels.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex min-h-11 items-center border border-[#3b494c] bg-[#0d1516] px-4 cv-font-mono text-[11px] uppercase text-[#bac9cc] transition hover:border-[#00d9f2]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#f9fafb]">
            {locale === "zh"
              ? "长尾搜索矩阵（按转化路径）"
              : "Long-tail matrix (by conversion path)"}
          </h2>
          <p className="mt-2 text-xs leading-5 text-[#9ca3af]">
            {locale === "zh"
              ? "固定 URL 截获搜索意图 → CA 安检 / 钱包体检 / 资产理发师。不含单 CA SEO。"
              : "Fixed URLs capture search intent → CA check / wallet health / asset barber. No per-CA SEO."}
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {longTailCategories.map((cat) => {
              const meta = longTailCategoryMeta[cat][locale];
              const rows = listLongTailByCategory(cat);
              return (
                <article
                  key={cat}
                  className="cv-website-panel border border-[#3b494c]/70 bg-[#0d1516]/88 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[#f9fafb]">
                        {meta.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#9ca3af]">
                        {meta.subtitle}
                      </p>
                    </div>
                    <Link
                      href={meta.ctaHref}
                      className="inline-flex min-h-11 shrink-0 items-center bg-[#00d9f2]/10 px-3 cv-font-mono text-[10px] font-semibold uppercase text-[#c3f5ff]"
                    >
                      {meta.ctaLabel}
                    </Link>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {rows.map((row) => (
                      <li key={row.id}>
                        {row.status === "deferred" ? (
                          <div className="border border-dashed border-[#3b494c] px-3 py-3">
                            <p className="text-sm text-[#6b7280]">
                              {locale === "zh" ? row.zh : row.en}
                            </p>
                            <p className="mt-1 text-[10px] text-[#eab308]">
                              {locale === "zh" ? "后置" : "Deferred"}
                              {row.note ? ` · ${row.note}` : ""}
                            </p>
                          </div>
                        ) : (
                          <Link
                            href={row.href}
                            className="block min-h-11 border border-[#3b494c]/55 bg-[#071012] px-3 py-3 transition hover:border-[#00d9f2]/55"
                          >
                            <p className="text-sm font-medium text-[#e4e1ed]">
                              {locale === "zh" ? row.zh : row.en}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-[#6b7280]">
                              {row.en}
                            </p>
                            {row.note ? (
                              <p className="mt-1 text-[10px] text-[#9ca3af]">
                                {row.note}
                              </p>
                            ) : null}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#f9fafb]">
            {locale === "zh" ? "GEO 核心词条" : "Core GEO articles"}
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {geoArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="cv-website-panel block border border-[#3b494c]/70 bg-[#0d1516]/88 p-5 transition hover:border-[#00d9f2]/45"
              >
                <p className="font-semibold text-[#f9fafb]">{article.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#9ca3af]">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#f9fafb]">
            {t("learn.featured")}
          </h2>
          <article className="cv-website-panel mt-3 border border-[#ef4444]/30 bg-[#0d1516]/88 p-6">
            <span className="rounded-full bg-[#ef4444]/15 px-2.5 py-1 text-[10px] font-semibold text-[#fca5a5]">
              CRITICAL RISK
            </span>
            <h3 className="mt-3 text-xl font-semibold text-[#f9fafb]">
              {featured.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">
              {featured.summary}
            </p>
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
            <p className="mt-3 text-sm text-[#c0c1ff]">
              {featured.recommendedAction}
            </p>
            <Link
              href="/risk-database"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#c0c1ff]"
            >
              {t("learn.readMore")}
            </Link>
          </article>
        </section>

        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#f9fafb]">
            {t("learn.recent")}
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {(recent.length ? recent : lessons).map((lesson) => (
              <article
                key={lesson.id}
                className="cv-website-panel border border-[#3b494c]/70 bg-[#0d1516]/88 p-5"
              >
                <p className="text-[11px] uppercase text-[#9ca3af]">
                  {lesson.category}
                </p>
                <h3 className="mt-1 font-semibold text-[#f9fafb]">
                  {lesson.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">
                  {lesson.summary}
                </p>
              </article>
            ))}
          </div>
          <Link
            href="/risk-database"
            className="mt-4 flex min-h-11 items-center justify-center text-center text-sm font-semibold text-[#c0c1ff]"
          >
            {t("learn.viewAll")}
          </Link>
        </section>

        <section className="mt-10 border border-[#00d9f2]/30 bg-[#00d9f2]/6 p-6 text-center">
          <p className="font-semibold text-[#f9fafb]">
            {t("common.suspiciousCa")}
          </p>
          <p className="mt-2 text-sm text-[#9ca3af]">
            {t("common.dontGuessLong")}
          </p>
          <Link
            href="/check"
            className="mt-5 inline-flex min-h-11 items-center bg-[#00d9f2] px-5 cv-font-mono text-xs font-semibold uppercase text-[#002b31]"
          >
            {t("common.ctaScan")}
          </Link>
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
