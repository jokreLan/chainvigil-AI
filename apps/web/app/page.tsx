import Link from "next/link";
import { CheckForm } from "./ui/check-form";
import { MobileNav } from "./ui/mobile-nav";

const defenseModules = [
  { title: "貔貅检测", description: "识别只能买不能卖的陷阱", href: "/risk-database" },
  { title: "黑名单风险", description: "检测 Owner 是否可冻结账户", href: "/risk-database" },
  { title: "LP 锁仓分析", description: "查看流动性池是否已锁定", href: "/risk-database" },
  { title: "权限后门", description: "扫描隐藏的高危治理权限", href: "/risk-database" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28">
      <header className="sticky top-0 z-20 border-b border-[#262932] bg-[#0a0b0f]">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[#f9fafb]">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#8083ff] text-xs text-[#0d0096]">CV</span>
            ChainVigil AI
          </Link>
          <div className="hidden items-center gap-5 text-sm text-[#9ca3af] md:flex">
            <Link href="/app" className="font-semibold text-[#c0c1ff]">安全工作台</Link><Link href="/check">CA 安检</Link><Link href="/wallet-check">钱包体检</Link><Link href="/risk-database">风险库</Link>
          </div>
          <Link href="/app/points" className="text-sm font-semibold text-[#eab308]">VP</Link>
        </nav>
      </header>

      <div className="mx-auto max-w-md space-y-8 px-4 pt-10 md:max-w-7xl md:px-8">
        <section className="text-center">
          <h1 className="text-4xl font-semibold leading-tight text-[#f9fafb] sm:text-5xl">买币前，<br /><span className="text-[#c0c1ff]">先查 CA。</span></h1>
          <p className="mt-4 leading-7 text-[#c7c4d7]">AI 检测貔貅盘、高税、黑名单、LP 未锁、Owner 后门、假币与授权风险。</p>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-[#464554] bg-[#16181d] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)]"><CheckForm compact /></div>
          <Link href="/wallet-check" className="flex h-12 items-center justify-center rounded-xl border border-[#464554] text-sm font-semibold text-[#f9fafb]">检查我的钱包</Link>
          <p className="text-center text-xs text-[#9ca3af]">免费检测 · 无需连接钱包 · 优先支持 SOL 与 BNB</p>
        </section>

        <Link href="/app" className="flex items-center justify-between gap-4 rounded-xl border border-[#8083ff]/40 bg-[#16181d] p-5 transition-colors hover:border-[#c0c1ff]">
          <div>
            <p className="text-xs font-semibold uppercase text-[#c0c1ff]">Security workspace</p>
            <h2 className="mt-2 text-xl font-semibold text-[#f9fafb]">打开安全工作台</h2>
            <p className="mt-2 text-sm leading-6 text-[#9ca3af]">钱包体检、报告历史、风险监控和哨点 VP 都在这里。</p>
          </div>
          <span aria-hidden="true" className="shrink-0 text-2xl font-semibold text-[#c0c1ff]">&rarr;</span>
        </Link>

        <section>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-[#f9fafb]">高风险预警示例</h2><span className="text-xs font-semibold text-[#c0c1ff]">LIVE SCAN</span></div>
          <div className="rounded-xl border border-[#ef4444]/35 bg-[#16181d] p-4">
            <div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#f9fafb]">Honeypot Token</p><p className="mt-1 font-mono text-xs text-[#9ca3af]">0x71C...492E</p></div><span className="rounded-md border border-[#ef4444]/30 bg-[#ef4444]/10 px-2 py-1 text-xs font-semibold text-[#fca5a5]">高风险</span></div>
            <div className="mt-4 rounded-lg border border-[#262932] bg-[#1b1b23] p-3"><p className="text-xs font-semibold text-[#9ca3af]">AI 智能诊断</p><p className="mt-2 text-sm leading-6 text-[#f9fafb]">该合约存在典型的貔貅逻辑。Owner 已关闭卖出开关，且流动性池存在异常，建议立即远离。</p></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg border border-[#262932] bg-[#0d0d15] p-2 text-[#fca5a5]">貔貅盘风险</div><div className="rounded-lg border border-[#262932] bg-[#0d0d15] p-2 text-[#fde68a]">卖出税 99%</div></div>
          </div>
        </section>

        <section><h2 className="mb-4 text-lg font-semibold text-[#f9fafb]">核心防御模块</h2><div className="grid grid-cols-2 gap-3">{defenseModules.map((module) => <Link key={module.title} href={module.href} className="rounded-xl border border-[#262932] bg-[#16181d] p-4"><p className="font-semibold text-[#f9fafb]">{module.title}</p><p className="mt-2 text-xs leading-5 text-[#9ca3af]">{module.description}</p></Link>)}</div></section>

        <Link href="/app/points" className="flex items-center justify-between rounded-xl border border-[#eab308]/25 bg-[#16181d] p-4"><div><p className="font-semibold text-[#eab308]">Vigil Points (VP)</p><p className="mt-1 text-xs text-[#9ca3af]">完成安检，记录安全贡献点数</p></div><span className="text-[#eab308]">VP</span></Link>
      </div>

      <MobileNav active="home" />
    </main>
  );
}
