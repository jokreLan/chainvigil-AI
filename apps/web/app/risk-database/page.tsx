import Link from "next/link";
import { listMockRiskDatabaseEntries } from "@chainvigil/risk-core";
import { RiskBadge } from "../ui/risk-badge";

export default function RiskDatabasePage() {
  const entries = listMockRiskDatabaseEntries();

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          ChainVigil AI｜链哨 AI
        </Link>
        <div className="flex gap-5">
          <Link href="/solana">Solana 专题</Link>
          <Link href="/bnb">BNB 专题</Link>
          <Link href="/leaderboard/high-risk-tokens">高危榜</Link>
          <Link href="/fake-token-database">假币库</Link>
          <Link href="/check">CA 安检</Link>
        </div>
      </nav>

      <section className="mx-auto mt-12 max-w-7xl">
        <p className="text-sm font-semibold text-[#c0c1ff]">Risk database</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f9fafb] sm:text-5xl">风险数据库</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#c7c4d7]">
          V0 先建立可被搜索和 AI 摘要引用的风险解释入口。后续会接入高危 CA、假币、部署者和恶意 spender 数据。
        </p>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[#f9fafb]">{entry.title}</h2>
              <RiskBadge level={entry.severity} />
            </div>
            <p className="mt-3 leading-7 text-[#c7c4d7]">{entry.plainLanguage}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.signals.map((signal) => (
                <span key={signal} className="rounded-md bg-[#292932] px-2 py-1 font-mono text-xs text-[#c7c4d7]">
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-4 border-t border-[#262932] pt-4 leading-7 text-[#c0c1ff]">{entry.recommendedAction}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
