import Link from "next/link";
import { listMockWalletWatchlist, listMockRiskMonitorRules } from "@chainvigil/risk-core";
import { getMockPointLedgerSummary } from "@chainvigil/points";
import { MobileNav } from "../ui/mobile-nav";

const modules = [
  { title: "我的钱包", href: "/app/wallets", desc: "只读体检地址与风险摘要", tone: "#c0c1ff" },
  { title: "授权扫描", href: "/app/approvals", desc: "spender、额度和风险理由", tone: "#f97316" },
  { title: "资产理发师", href: "/app/asset-barber", desc: "资产分类与禁止处理策略", tone: "#f59e0b" },
  { title: "风险监控", href: "/app/monitor", desc: "可复查的风险变化规则", tone: "#10b981" },
  { title: "报告历史", href: "/app/reports", desc: "共享 mock 报告索引", tone: "#c0c1ff" },
  { title: "哨点 VP", href: "/app/points", desc: "确认与待确认积分状态", tone: "#eab308" },
];

export default function AppDashboardPage() {
  const wallets = listMockWalletWatchlist("");
  const monitors = listMockRiskMonitorRules();
  const points = getMockPointLedgerSummary();
  return <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-10"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#262932] bg-[#0a0b0f]/95 px-5 backdrop-blur md:px-8"><Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI</Link><Link href="/check" className="text-sm text-[#c0c1ff]">查 CA</Link></header><div className="mx-auto max-w-7xl px-5 py-9 md:px-8"><section><p className="text-sm font-semibold text-[#c0c1ff]">Security workspace</p><h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">安全工作台</h1><p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">统一查看只读钱包体检、风险报告、监控规则和 VP 状态。V0 不要求连接钱包，也不会替用户发起链上操作。</p></section><section className="mt-8 grid gap-4 md:grid-cols-4">{[["只读钱包", wallets.length, "#c0c1ff"],["监控规则", monitors.length, "#10b981"],["已确认 VP", points.totalConfirmed, "#eab308"],["待确认 VP", points.totalPending, "#f59e0b"]].map(([label, value, color]) => <article key={String(label)} className="rounded-xl border border-[#262932] bg-[#16181d] p-5"><p className="text-sm text-[#9ca3af]">{label}</p><p className="mt-3 text-2xl font-semibold" style={{ color: String(color) }}>{value}</p></article>)}</section><section className="mt-10"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-[#c0c1ff]">工作区模块</p><h2 className="mt-1 text-2xl font-semibold text-[#f9fafb]">按风险流程进入</h2></div><span className="text-xs text-[#9ca3af]">V0 read-only</span></div><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{modules.map((module) => <Link key={module.href} href={module.href} className="rounded-xl border border-[#262932] bg-[#16181d] p-5 transition-colors hover:border-[#464554]"><span className="text-sm font-semibold" style={{ color: module.tone }}>●</span><h3 className="mt-5 text-xl font-semibold text-[#f9fafb]">{module.title}</h3><p className="mt-2 leading-7 text-[#9ca3af]">{module.desc}</p><span className="mt-5 block text-sm font-semibold text-[#c0c1ff]">打开模块</span></Link>)}</div></section><section className="mt-10 rounded-xl border border-[#262932] bg-[#1b1b23] p-6"><h2 className="text-xl font-semibold text-[#f9fafb]">V0 安全边界</h2><p className="mt-3 leading-7 text-[#9ca3af]">工作台只呈现风险解释、mock 情报和检查策略。授权撤销、资产处理、自动 swap、bridge 和交易拦截均不在 V0 范围内。</p></section></div><MobileNav active="home" /></main>;
}
