import Link from "next/link";
import { listMockFakeTokenExamples } from "@chainvigil/risk-core";
import { MobileNav } from "../ui/mobile-nav";
import { RiskBadge } from "../ui/risk-badge";

function getChainLabel(chain: string) {
  if (chain === "bsc") return "BNB Smart Chain";
  if (chain === "solana") return "Solana";
  return chain;
}

export default function FakeTokenDatabasePage() {
  const examples = listMockFakeTokenExamples();

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-8">
      <header className="sticky top-0 z-30 border-b border-[#262932] bg-[#0a0b0f]/95 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="font-semibold text-[#f9fafb]">
            ChainVigil AI
          </Link>
          <div className="flex items-center gap-5 text-sm text-[#c7c4d7]">
            <Link href="/">首页</Link>
            <Link href="/wallet-check">钱包</Link>
            <Link href="/app/points">VP</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-65px)] border-r border-[#262932] bg-[#16181d] px-4 py-7 md:block">
          <nav className="space-y-2 text-sm text-[#c7c4d7]">
            <Link className="block rounded-lg px-4 py-3 hover:bg-[#292932]" href="/">首页</Link>
            <Link className="block rounded-lg px-4 py-3 hover:bg-[#292932]" href="/wallet-check">钱包体检</Link>
            <Link className="block rounded-lg bg-[#6f00be] px-4 py-3 font-semibold text-[#f0dbff]" href="/fake-token-database">威胁数据库</Link>
            <Link className="block rounded-lg px-4 py-3 hover:bg-[#292932]" href="/app/points">哨点 VP</Link>
          </nav>
        </aside>

        <div className="min-w-0 px-5 py-9 md:px-10 md:py-12">
          <section className="max-w-3xl">
            <p className="text-sm font-semibold text-[#c0c1ff]">V0 mock intelligence</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">假币数据库</h1>
            <p className="mt-4 text-base leading-7 text-[#9ca3af] md:text-lg">
              识别冒充热门资产的合约。名称和 Symbol 可以伪造，买币前请始终从官方渠道核对 CA。
            </p>
            <Link
              href="/check"
              className="mt-6 flex h-14 max-w-3xl items-center rounded-lg border border-[#262932] bg-[#16181d] px-4 text-sm text-[#9ca3af] transition-colors hover:border-[#c0c1ff]"
            >
              输入 CA、Token 名称或 Symbol 开始核验...
            </Link>
          </section>

          <section className="mt-8 rounded-xl border border-[#262932] bg-[#16181d] p-5 md:p-6">
            <h2 className="text-xl font-semibold text-[#f9fafb]">官方合约与仿盘的区别</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <article className="relative rounded-lg border border-[#10b981]/30 bg-[#1b1b23] p-5">
                <span className="absolute right-0 top-0 rounded-bl-lg bg-[#10b981]/10 px-3 py-1 text-xs font-semibold text-[#10b981]">已核验示例</span>
                <p className="text-lg font-semibold text-[#f9fafb]">官方资产</p>
                <p className="mt-1 text-sm text-[#9ca3af]">从项目官网或可信行情页复制的唯一 CA</p>
                <p className="mt-4 break-all rounded-md bg-[#0a0b0f] p-3 font-mono text-xs text-[#c7c4d7]">官方来源中的完整合约地址</p>
              </article>
              <article className="relative rounded-lg border border-[#ef4444]/30 bg-[#1b1b23] p-5">
                <span className="absolute right-0 top-0 rounded-bl-lg bg-[#ef4444]/10 px-3 py-1 text-xs font-semibold text-[#ef4444]">仿盘风险</span>
                <p className="text-lg font-semibold text-[#f9fafb]">同名假币</p>
                <p className="mt-1 text-sm text-[#ef4444]">高税、限制卖出或钓鱼引流都可能藏在相似名称下</p>
                <p className="mt-4 rounded-md bg-[#ef4444]/5 p-3 font-mono text-xs text-[#ef4444] line-through">相似名称不等于官方 CA</p>
              </article>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#ef4444]">近期样例</p>
                <h2 className="mt-1 text-2xl font-semibold text-[#f9fafb]">近期发现的仿盘</h2>
              </div>
              <span className="rounded-md border border-[#262932] px-3 py-2 text-xs text-[#9ca3af]">SOL / BNB 优先</span>
            </div>
            <div className="mt-5 space-y-4">
              {examples.map((example) => (
                <article key={example.id} className="flex flex-col gap-4 rounded-xl border border-[#262932] bg-[#16181d] p-5 transition-colors hover:border-[#464554] md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#292932] text-lg text-[#ef4444]">!</div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#f9fafb]">{example.title}</h3>
                        <span className="rounded bg-[#292932] px-2 py-0.5 text-xs text-[#c7c4d7]">{getChainLabel(example.chain)}</span>
                        <RiskBadge level={example.riskLevel} label={example.impersonates} />
                      </div>
                      <p className="mt-1 text-sm text-[#9ca3af]">冒充 {example.impersonates}：{example.description}</p>
                    </div>
                  </div>
                  <div className="min-w-0 md:max-w-xs md:border-l md:border-[#262932] md:px-5">
                    <p className="text-xs font-semibold uppercase text-[#ef4444]">风险信号</p>
                    <p className="mt-1 text-sm text-[#e4e1ed]">{example.signals.join(" · ")}</p>
                  </div>
                  <Link href="/check" className="shrink-0 rounded-lg border border-[#262932] bg-[#1f1f27] px-4 py-2 text-center text-sm font-semibold text-[#f9fafb] hover:bg-[#292932]">
                    查 CA
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-5 md:p-6">
            <h2 className="text-xl font-semibold text-[#f9fafb]">如何核对合约地址</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[#c7c4d7]">
              <li><span className="mr-3 font-semibold text-[#c0c1ff]">01</span>从项目官网、官方社媒或可信行情页取得 CA。</li>
              <li><span className="mr-3 font-semibold text-[#c0c1ff]">02</span>粘贴到链哨 AI 安检入口，先看是否可卖、税率和 LP 状态。</li>
              <li><span className="mr-3 font-semibold text-[#c0c1ff]">03</span>不要因名称、头像或群聊截图相同就相信它是官方资产。</li>
            </ol>
          </section>
        </div>
      </div>
      <MobileNav active="database" />
    </main>
  );
}
