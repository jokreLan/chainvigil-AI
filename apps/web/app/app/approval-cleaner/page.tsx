import Link from "next/link";
import { listMockAssetCleanupPolicies } from "@chainvigil/risk-core";
import { MobileNav } from "../../ui/mobile-nav";

export default function ApprovalCleanerPage() {
  const policies = listMockAssetCleanupPolicies().filter((policy) => policy.flow === "approval_cleaner");
  const policy = policies[0];

  if (!policy) return null;

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-10">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#262932] bg-[#0a0b0f]/95 px-5 backdrop-blur md:px-8">
        <Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI</Link>
        <div className="flex items-center gap-4 text-sm text-[#c7c4d7]"><Link href="/wallet-check">钱包</Link><Link href="/app/points">VP</Link></div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8">
        <section className="rounded-xl border border-[#262932] bg-[#16181d] p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-8 border-[#292932] text-2xl font-semibold text-[#f59e0b]">--</div>
              <div><p className="text-sm font-semibold text-[#c0c1ff]">授权扫描</p><h1 className="mt-1 text-2xl font-semibold text-[#f9fafb]">等待钱包地址只读检查</h1><p className="mt-2 text-sm text-[#9ca3af]">V0 不连接钱包、不读取签名，也不会自动执行撤销。</p></div>
            </div>
            <Link href="/wallet-check" className="rounded-lg bg-[#c0c1ff] px-5 py-3 text-center text-sm font-semibold text-[#1000a9]">查看体检范围</Link>
          </div>
        </section>

        <section className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#262932] bg-[#1b1b23] p-4 text-sm text-[#c7c4d7]">
          <span className="rounded-lg border border-[#262932] bg-[#16181d] px-3 py-2">BNB Smart Chain</span>
          <span className="rounded-lg border border-[#262932] bg-[#16181d] px-3 py-2">仅显示高风险</span>
          <span className="rounded-lg border border-[#262932] bg-[#16181d] px-3 py-2">无限额度待扫描</span>
          <span className="ml-auto text-xs text-[#9ca3af]">当前没有已连接钱包</span>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-[#f97316]">执行保护</p><h2 className="mt-1 text-2xl font-semibold text-[#f9fafb]">撤销前必须人工确认</h2></div><span className="rounded bg-[#f97316]/10 px-3 py-1 text-xs font-semibold text-[#f97316]">只读策略</span></div>
          <article className="mt-5 rounded-xl border border-[#262932] bg-[#16181d] p-5 md:p-6">
            <h3 className="text-xl font-semibold text-[#f9fafb]">{policy.title}</h3>
            <p className="mt-3 max-w-3xl leading-7 text-[#c7c4d7]">{policy.description}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-lg bg-[#1b1b23] p-5"><h4 className="font-semibold text-[#c0c1ff]">撤销前检查项</h4><ul className="mt-4 space-y-3 text-sm text-[#c7c4d7]">{policy.requiredChecks.map((check) => <li key={check} className="border-b border-[#262932] pb-3">{check}</li>)}</ul></div>
              <div className="rounded-lg border border-[#ef4444]/25 bg-[#ef4444]/5 p-5"><h4 className="font-semibold text-[#ef4444]">V0 禁止动作</h4><ul className="mt-4 space-y-3 text-sm text-[#c7c4d7]">{policy.prohibitedActions.map((action) => <li key={action} className="border-b border-[#ef4444]/15 pb-3">{action}</li>)}</ul></div>
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-6"><h2 className="text-xl font-semibold text-[#f9fafb]">为什么现在不能一键清理</h2><p className="mt-3 max-w-3xl leading-7 text-[#9ca3af]">撤销授权会产生真实链上交易。正式开放前，必须先让用户核对资产、spender、额度、gas 和交易内容，并在钱包中完成二次确认。</p></section>
      </div>
      <MobileNav active="wallet" />
    </main>
  );
}
