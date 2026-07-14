import Link from "next/link";
import { listMockHighRiskTokens } from "@chainvigil/risk-core";
import { RiskBadge } from "../../ui/risk-badge";

export default function HighRiskTokensPage() {
  const tokens = listMockHighRiskTokens("");

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/risk-database">风险数据库</Link>
      </nav>
      <section className="mx-auto mt-12 max-w-7xl">
        <p className="text-sm font-semibold text-[#c0c1ff]">High-risk tokens</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f9fafb] sm:text-5xl">高危 CA 榜单</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#c7c4d7]">
          V0 使用 mock 榜单建立页面结构。真实榜单必须基于可复查证据、检测时间和人工复核机制。
        </p>
      </section>
      <section className="mx-auto mt-10 max-w-7xl space-y-4">
        {tokens.map((token) => (
          <Link
            key={token.id}
            href={token.reportUrl}
            className="block rounded-lg border border-[#262932] bg-[#16181d] p-5 transition hover:border-[#464554]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="break-all font-mono text-lg text-[#f9fafb]">{token.tokenAddress}</h2>
              <RiskBadge level={token.riskLevel} label={token.label} />
            </div>
            <p className="mt-3 text-[#c7c4d7]">
              {token.chain}｜{token.reason}
            </p>
            <p className="mt-2 text-sm text-[#9ca3af]">
              {token.tokenName} · {token.tokenSymbol} · 风险分 {token.score}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {token.evidenceTags.map((tag) => (
                <span key={tag} className="rounded-md bg-[#292932] px-2 py-1 font-mono text-xs text-[#c7c4d7]">
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
