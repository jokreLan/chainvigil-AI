import Link from "next/link";

const engines = [
  ["Token Risk API", "对 SOL/BNB 合约地址返回 V0 风险报告与人话解释。", "风险报告"],
  ["Public Intelligence API", "读取高危 CA、假币示例和风险教育等公开 mock 情报。", "公开情报"],
  ["Wallet Health API", "提供 BNB Smart Chain 的只读钱包体检能力范围，不连接钱包、不签名。", "只读体检"],
];

const example = `import { ChainVigilClient } from "@chainvigil/sdk";

const client = new ChainVigilClient({ baseUrl: "http://localhost:4000" });
const report = await client.checkToken({
  chain: "bsc",
  address: "0x...",
});

console.log(report.report.riskLevel);
console.log(report.report.humanSummary);`;

export default function DevelopersPage() {
  return (
    <main className="min-h-screen bg-[#0a0b0f] text-[#e4e1ed]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#262932] bg-[#0a0b0f]/95 px-5 backdrop-blur md:px-8"><Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI</Link><Link href="/api" className="text-sm text-[#c0c1ff]">API 文档</Link></header>
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <section className="max-w-3xl"><p className="text-sm font-semibold text-[#c0c1ff]">Developer preview</p><h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">开发者中心</h1><p className="mt-5 text-base leading-7 text-[#9ca3af] md:text-lg">为钱包、工具、Bot 和社区产品提供可解释的风险信息。当前是可运行的 V0 mock API，不提供自动交易阻断、签名拦截或生产计费承诺。</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/api" className="rounded-lg bg-[#c0c1ff] px-5 py-3 text-sm font-semibold text-[#1000a9]">查看 API 文档</Link><Link href="/check" className="rounded-lg border border-[#464554] px-5 py-3 text-sm font-semibold text-[#f9fafb]">体验 CA 安检</Link></div></section>
        <section className="mt-12"><h2 className="text-2xl font-semibold text-[#f9fafb]">可用引擎</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{engines.map(([name, description, status]) => <article key={name} className="flex min-h-60 flex-col rounded-xl border border-[#262932] bg-[#16181d] p-6"><span className="text-lg text-[#c0c1ff]">{status}</span><h3 className="mt-5 text-xl font-semibold text-[#f9fafb]">{name}</h3><p className="mt-3 flex-1 leading-7 text-[#9ca3af]">{description}</p><Link href="/api" className="mt-6 text-sm font-semibold text-[#c0c1ff]">阅读 contract</Link></article>)}</div></section>
        <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"><div><h2 className="text-2xl font-semibold text-[#f9fafb]">几分钟接入</h2><p className="mt-4 leading-7 text-[#9ca3af]">REST API 和 TypeScript SDK 都复用同一份 contract。样例仅检查风险报告，不会替应用做任何交易决定。</p><div className="mt-5 flex gap-2"><span className="rounded border border-[#262932] bg-[#292932] px-2 py-1 font-mono text-xs">npm</span><span className="rounded border border-[#262932] px-2 py-1 font-mono text-xs text-[#9ca3af]">REST</span></div></div><pre className="overflow-x-auto rounded-xl border border-[#262932] bg-[#16181d] p-6 text-sm leading-7 text-[#c7c4d7]"><code>{example}</code></pre></section>
        <section className="mt-12 rounded-xl border border-[#262932] bg-[#1b1b23] p-6"><h2 className="text-xl font-semibold text-[#f9fafb]">V0 接入边界</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-[#c7c4d7]"><li>支持链优先为 Solana 与 BNB Smart Chain，风险数据仍是 mock 降级闭环。</li><li>不承诺生产 SLA、调用额度、Webhook 或付费计划。</li><li>风险结果应作为解释和辅助判断，不能替代用户自己的交易决策。</li></ul></section>
      </div>
    </main>
  );
}
