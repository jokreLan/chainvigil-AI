import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerLocale } from "../../i18n/server";
import {
  buildGeoArticleJsonLd,
  geoArticleSlugs,
  getGeoArticle,
  type GeoArticleSlug,
  type SignalSeverity,
} from "../../lib/geo-articles";
import { buildBreadcrumbJsonLd, getSiteUrl } from "../../lib/seo";
import { JsonLd } from "../../ui/json-ld";
import { MobileNav } from "../../ui/mobile-nav";
import { SiteHeader } from "../../ui/site-header";

interface Props {
  params: Promise<{ slug: string }>;
}

const severityStyles: Record<SignalSeverity, string> = {
  BLOCK: "bg-[#ef4444]/15 text-[#fca5a5] border-[#ef4444]/35",
  CAUTION: "bg-[#f59e0b]/15 text-[#fde68a] border-[#f59e0b]/35",
  INFO: "bg-[#6b7280]/20 text-[#d1d5db] border-[#6b7280]/35",
};

export function generateStaticParams() {
  return geoArticleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const article = getGeoArticle(slug, locale);
  if (!article) return {};

  const url = `${getSiteUrl()}/learn/${slug}`;
  return {
    title: `${article.title}｜ChainVigil AI`,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      siteName: "ChainVigil AI",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function GeoArticlePage({ params }: Props) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const article = getGeoArticle(slug, locale);
  if (!article) notFound();

  const site = getSiteUrl();
  const url = `${site}/learn/${slug}`;
  const isZh = locale === "zh";
  const jsonLd = buildGeoArticleJsonLd(article, url, locale);
  const crumbs = buildBreadcrumbJsonLd([
    { name: "ChainVigil AI", path: "/" },
    { name: isZh ? "风险百科" : "Learn", path: "/learn" },
    { name: article.title, path: `/learn/${slug}` },
  ]);

  const severityLabel =
    locale === "zh"
      ? { BLOCK: "禁买/阻断", CAUTION: "谨慎", INFO: "提示" }
      : { BLOCK: "Block", CAUTION: "Caution", INFO: "Info" };

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28 text-[#e4e1ed]">
      <JsonLd data={jsonLd} />
      <JsonLd data={crumbs} />
      <SiteHeader active="intel" />

      <article className="mx-auto max-w-2xl px-4 py-8 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#c0c1ff]">
          GEO · Risk education
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#f9fafb] md:text-4xl">{article.title}</h1>
        <p className="mt-4 text-base leading-7 text-[#c7c4d7]">{article.description}</p>

        {/* Assertion-first block for AI extractors */}
        <section className="mt-8 rounded-2xl border border-[#8083ff]/40 bg-[#8083ff]/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-[#c0c1ff]">
            {isZh ? "一句话定义（可引用）" : "One-line definition (citable)"}
          </h2>
          <p className="mt-3 text-lg font-semibold leading-8 text-[#f9fafb]">{article.assertion}</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#c7c4d7]">
            {article.relatedSignals.slice(0, 3).map((signal) => (
              <li key={signal}>
                <code className="rounded bg-[#0d0d15] px-1.5 py-0.5 font-mono text-[12px] text-[#c0c1ff]">
                  {signal}
                </code>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 rounded-2xl border border-[#262932] bg-[#16181d] p-5">
          <h2 className="text-lg font-semibold text-[#f9fafb]">{isZh ? "定义" : "Definition"}</h2>
          <p className="mt-3 leading-7 text-[#c7c4d7]">{article.definition}</p>
        </section>

        <section className="mt-4 rounded-2xl border border-[#f59e0b]/30 bg-[#16181d] p-5">
          <h2 className="text-lg font-semibold text-[#fde68a]">{isZh ? "为什么危险" : "Why it matters"}</h2>
          <p className="mt-3 leading-7 text-[#c7c4d7]">{article.risk}</p>
        </section>

        {/* GEO-friendly comparison table */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-[#262932] bg-[#16181d]">
          <div className="border-b border-[#262932] px-5 py-4">
            <h2 className="text-lg font-semibold text-[#f9fafb]">
              {isZh ? "风险信号对照表" : "Risk signal table"}
            </h2>
            <p className="mt-1 text-xs text-[#9ca3af]">
              {isZh ? "便于搜索与 AI 引用的结构化对照" : "Structured rows for search & AI citation"}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="bg-[#0d0d15] text-[11px] uppercase tracking-wide text-[#9ca3af]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{isZh ? "风险信号" : "Signal"}</th>
                  <th className="px-4 py-3 font-semibold">{isZh ? "严重程度" : "Severity"}</th>
                  <th className="px-4 py-3 font-semibold">{isZh ? "人话解释" : "Plain meaning"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262932]">
                {article.signalTable.map((row) => (
                  <tr key={`${row.signal}-${row.plain}`} className="align-top">
                    <td className="px-4 py-3 font-mono text-[12px] text-[#c0c1ff]">{row.signal}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${severityStyles[row.severity]}`}
                      >
                        {severityLabel[row.severity]}
                      </span>
                    </td>
                    <td className="px-4 py-3 leading-6 text-[#c7c4d7]">{row.plain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#262932] bg-[#16181d] p-5">
          <h2 className="text-lg font-semibold text-[#f9fafb]">{isZh ? "怎么查" : "How to check"}</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-[#c7c4d7]">
            {article.howToDetect.map((step) => (
              <li key={step} className="leading-7">
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 rounded-2xl border border-[#262932] bg-[#16181d] p-5">
          <h2 className="text-lg font-semibold text-[#f9fafb]">FAQ</h2>
          <div className="mt-4 divide-y divide-[#262932]">
            {article.faq.map(([q, a]) => (
              <div key={q} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-[#f9fafb]">{q}</h3>
                <p className="mt-2 leading-7 text-[#c7c4d7]">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href={article.ctaHref}
            className="flex min-h-12 items-center justify-center rounded-xl bg-[#8083ff] text-sm font-semibold text-[#0d0096]"
          >
            {article.ctaLabel}
          </Link>
          {article.secondaryCta ? (
            <Link
              href={article.secondaryCta.href}
              className="flex min-h-12 items-center justify-center rounded-xl border border-[#464554] text-sm font-semibold text-[#f9fafb]"
            >
              {article.secondaryCta.label}
            </Link>
          ) : (
            <Link
              href="/learn"
              className="flex min-h-12 items-center justify-center rounded-xl border border-[#464554] text-sm font-semibold text-[#f9fafb]"
            >
              {isZh ? "返回百科" : "Back to encyclopedia"}
            </Link>
          )}
        </div>

        <p className="mt-6 text-xs leading-5 text-[#6b7280]">
          {isZh
            ? "免责声明：仅用于交易安全风险教育，不构成投资建议。链上状态会变化，请独立复核。"
            : "Disclaimer: risk education only. Not investment advice. On-chain state changes — verify independently."}
        </p>
      </article>
      <MobileNav active="database" />
    </main>
  );
}

export type { GeoArticleSlug };
