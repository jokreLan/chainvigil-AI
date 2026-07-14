import Link from "next/link";
import { listMockAssetCleanupPolicies } from "@chainvigil/risk-core";
import { MobileNav } from "../../ui/mobile-nav";

const decisionStyle = {
  review: "border-[#c0c1ff]/30 text-[#c0c1ff]",
  hide: "border-[#f59e0b]/30 text-[#f59e0b]",
  block: "border-[#ef4444]/30 text-[#ef4444]",
  manual_confirm: "border-[#f97316]/30 text-[#f97316]",
} as const;

export default function AssetBarberPage() {
  const policies = listMockAssetCleanupPolicies().filter((policy) => policy.flow === "asset_barber");

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-10">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#262932] bg-[#0a0b0f]/95 px-5 backdrop-blur md:px-8">
        <Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI</Link>
        <Link href="/wallet-check" className="text-sm text-[#c7c4d7]">钱包体检</Link>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8">
        <section>
          <p className="text-sm font-semibold text-[#c0c1ff]">Read-only strategy</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">资产理发师</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#9ca3af] md:text-lg">帮助你识别粉尘、垃圾资产和高风险合约。V0 只展示处理策略，不连接钱包、不签名、不自动交易。</p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-12">
          <article className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-[#c0c1ff]/20 bg-[#16181d] p-6 text-center md:col-span-4">
            <p className="text-xs font-semibold uppercase text-[#9ca3af]">钱包整洁度</p>
            <div className="mt-4 flex size-32 items-center justify-center rounded-full border-8 border-[#292932] text-3xl font-semibold text-[#f59e0b]">--</div>
            <p className="mt-4 text-sm text-[#f59e0b]">等待只读扫描</p>
          </article>
          <div className="grid gap-4 sm:grid-cols-2 md:col-span-8 lg:grid-cols-4">
            {[
              ["风险授权", "需钱包扫描", "#f97316"],
              ["粉尘资产", "策略可回收", "#c0c1ff"],
              ["垃圾 Token", "建议隐藏", "#f59e0b"],
              ["垃圾 NFT", "谨慎处理", "#9ca3af"],
            ].map(([title, value, color]) => (
              <article key={title} className="flex min-h-36 flex-col justify-between rounded-xl border border-[#262932] bg-[#16181d] p-5">
                <span className="text-lg" style={{ color }}>!</span>
                <div><p className="text-sm text-[#9ca3af]">{title}</p><p className="mt-1 font-semibold text-[#f9fafb]">{value}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-[#c0c1ff]/20 bg-[#1b1b23] p-6">
          <h2 className="text-xl font-semibold text-[#c0c1ff]">推荐的清理策略</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#c7c4d7]">先识别风险和流动性，再决定是否隐藏或人工复查。对于疑似貔貅、钓鱼空投和未知合约，最安全的策略是不要交互。</p>
          <Link href="/wallet-check" className="mt-5 inline-block rounded-lg bg-[#c0c1ff] px-5 py-3 text-sm font-semibold text-[#1000a9]">查看钱包体检范围</Link>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-[#f9fafb]">资产分类策略</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {policies.map((policy) => (
              <article key={policy.id} className={`rounded-xl border bg-[#16181d] ${decisionStyle[policy.decision]}`}>
                <div className="border-b border-[#262932] p-5"><p className="text-xs font-semibold uppercase">{policy.decision.replace("_", " ")}</p><h3 className="mt-2 text-xl font-semibold text-[#f9fafb]">{policy.title}</h3></div>
                <div className="p-5"><p className="leading-7 text-[#c7c4d7]">{policy.description}</p><div className="mt-4 flex flex-wrap gap-2">{policy.requiredChecks.map((check) => <span key={check} className="rounded bg-[#292932] px-2 py-1 text-xs text-[#c7c4d7]">{check}</span>)}</div><p className="mt-5 text-sm font-semibold text-[#ef4444]">禁止：{policy.prohibitedActions.join("、")}</p></div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <MobileNav active="wallet" />
    </main>
  );
}
