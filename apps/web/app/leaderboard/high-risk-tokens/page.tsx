import Link from "next/link";
import { listMockHighRiskTokens } from "@chainvigil/risk-core";
import { MobileNav } from "../../ui/mobile-nav";
import { RiskBadge } from "../../ui/risk-badge";

function chainLabel(chain: string) {
  if (chain === "bsc") return "BNB Smart Chain";
  if (chain === "solana") return "Solana";
  return chain;
}

export default function HighRiskTokensPage() {
  const tokens = listMockHighRiskTokens("");

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-10">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#262932] bg-[#0a0b0f]/95 px-5 backdrop-blur md:px-8"><Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI</Link><div className="flex gap-4 text-sm text-[#c7c4d7]"><Link href="/wallet-check">钱包</Link><Link href="/app/points">VP</Link></div></header>
      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8">
        <section><p className="text-sm font-semibold text-[#ef4444]">V0 mock intelligence</p><h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">高危 CA 榜单</h1><p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">展示需要重点核验的 SOL/BNB 合约样例。真实榜单必须在可复查证据、检测时间和人工复核机制完善后上线。</p></section>
        <nav className="mt-8 flex gap-2 overflow-x-auto pb-1"><span className="shrink-0 rounded-lg bg-[#6f00be] px-4 py-2 text-sm font-semibold text-[#f0dbff]">高危 CA</span><Link href="/fake-token-database" className="shrink-0 rounded-lg border border-[#262932] bg-[#16181d] px-4 py-2 text-sm text-[#c7c4d7]">假币数据库</Link><span className="shrink-0 rounded-lg border border-[#262932] bg-[#16181d] px-4 py-2 text-sm text-[#9ca3af]">高危部署者（待接入）</span></nav>
        <section className="mt-5 grid gap-3 rounded-xl border border-[#262932] bg-[#16181d] p-4 md:grid-cols-3"><div><p className="text-xs font-semibold uppercase text-[#9ca3af]">链范围</p><p className="mt-2 rounded-lg border border-[#464554] bg-[#1b1b23] px-3 py-2 text-sm">Solana / BNB Smart Chain</p></div><div><p className="text-xs font-semibold uppercase text-[#9ca3af]">风险范围</p><p className="mt-2 rounded-lg border border-[#464554] bg-[#1b1b23] px-3 py-2 text-sm">BLOCK / HIGH</p></div><div><p className="text-xs font-semibold uppercase text-[#9ca3af]">更新机制</p><p className="mt-2 rounded-lg border border-[#464554] bg-[#1b1b23] px-3 py-2 text-sm">V0 mock 样例</p></div></section>
        <section className="mt-8 space-y-4"><div className="hidden grid-cols-12 gap-4 border-b border-[#262932] px-4 py-2 text-xs font-semibold uppercase text-[#9ca3af] md:grid"><span>排名</span><span className="col-span-4">Token 与 CA</span><span className="col-span-2">风险等级</span><span className="col-span-3">核心风险</span><span className="col-span-2 text-right">报告</span></div>{tokens.map((token, index) => <article key={token.id} className="rounded-xl border border-[#262932] bg-[#16181d] p-5 transition-colors hover:border-[#464554] md:grid md:grid-cols-12 md:items-center md:gap-4"><div className="text-2xl font-semibold text-[#ef4444]">#{index + 1}</div><div className="mt-4 min-w-0 md:col-span-4 md:mt-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-[#f9fafb]">{token.tokenSymbol}</h2><span className="rounded bg-[#292932] px-2 py-0.5 text-xs text-[#c7c4d7]">{chainLabel(token.chain)}</span></div><p className="mt-1 text-sm text-[#9ca3af]">{token.tokenName}</p><p className="mt-2 break-all font-mono text-xs text-[#c7c4d7]">{token.tokenAddress}</p></div><div className="mt-4 md:col-span-2 md:mt-0"><RiskBadge level={token.riskLevel} label={token.label} /></div><div className="mt-4 md:col-span-3 md:mt-0"><p className="text-sm text-[#e4e1ed]">{token.reason}</p><div className="mt-2 flex flex-wrap gap-1">{token.evidenceTags.map((tag) => <span key={tag} className="rounded bg-[#292932] px-2 py-1 font-mono text-[10px] text-[#9ca3af]">{tag}</span>)}</div></div><div className="mt-5 md:col-span-2 md:mt-0 md:text-right"><Link href={token.reportUrl} className="inline-block rounded-lg border border-[#464554] bg-[#1f1f27] px-4 py-2 text-sm font-semibold text-[#f9fafb]">查看报告</Link><p className="mt-2 text-xs text-[#9ca3af]">风险分 {token.score ?? "--"}</p></div></article>)}</section>
        <section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-5 text-sm leading-7 text-[#9ca3af]"><strong className="text-[#f59e0b]">重要提示：</strong>本页仅用于风险教育与产品联调，不构成投资建议。请自行核对官方 CA 与链上证据，切勿仅凭榜单决定交易。</section>
      </div>
      <MobileNav active="database" />
    </main>
  );
}
