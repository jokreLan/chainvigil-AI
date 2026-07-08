import Link from "next/link";
import { listMockRiskDatabaseEntries } from "@chainvigil/risk-core";

export default function RiskDatabasePage() {
  const entries = listMockRiskDatabaseEntries();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <div className="flex gap-5">
          <Link href="/leaderboard/high-risk-tokens">高危榜</Link>
          <Link href="/fake-token-database">假币库</Link>
          <Link href="/check">CA 安检</Link>
        </div>
      </nav>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Risk database
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">风险数据库</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/72">
          V0 先建立可被搜索和 AI 摘要引用的风险解释入口。后续会接入高危 CA、假币、部署者和恶意 spender 数据。
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.id} className="border border-emerald-300/14 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{entry.title}</h2>
              <span className="text-sm text-emerald-200">{entry.severity}</span>
            </div>
            <p className="mt-3 leading-7 text-emerald-50/70">{entry.plainLanguage}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.signals.map((signal) => (
                <span key={signal} className="border border-emerald-300/20 px-2 py-1 text-xs text-emerald-100/70">
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-4 leading-7 text-emerald-100/72">{entry.recommendedAction}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
