import Link from "next/link";
import { listMockHighRiskTokens } from "@chainvigil/risk-core";

export default function HighRiskTokensPage() {
  const tokens = listMockHighRiskTokens("");

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-12">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/risk-database">风险数据库</Link>
      </nav>
      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          High-risk tokens
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">高危 CA 榜单</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/72">
          V0 使用 mock 榜单建立页面结构。真实榜单必须基于可复查证据、检测时间和人工复核机制。
        </p>
      </section>
      <section className="mt-10 space-y-4">
        {tokens.map((token) => (
          <Link
            key={token.id}
            href={token.reportUrl}
            className="block border border-emerald-300/14 bg-black/20 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-mono text-lg text-white">{token.tokenAddress}</h2>
              <span className="border border-red-300/40 px-3 py-1 text-sm text-red-100">
                {token.label}
              </span>
            </div>
            <p className="mt-3 text-emerald-50/70">
              {token.chain}｜{token.reason}
            </p>
            <p className="mt-2 text-sm text-emerald-100/60">
              {token.tokenName} · {token.tokenSymbol} · 风险分 {token.score}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {token.evidenceTags.map((tag) => (
                <span key={tag} className="border border-emerald-300/20 px-2 py-1 text-xs text-emerald-100/70">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
