import Link from "next/link";
import { listMockRiskEducationLessons } from "@chainvigil/risk-core";
import { MobileNav } from "../ui/mobile-nav";

const categoryLabels = ["貔貅盘", "卖出税", "黑名单", "LP 锁定", "授权风险", "空投钓鱼"];

export default function LearnPage() {
  const lessons = listMockRiskEducationLessons();
  const [featured, ...recent] = lessons;

  if (!featured) return null;

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-12">
      <header className="sticky top-0 z-30 border-b border-[#262932] bg-[#0a0b0f]/95 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI</Link>
          <div className="flex items-center gap-5 text-sm text-[#c7c4d7]">
            <Link href="/">首页</Link>
            <Link href="/wallet-check">钱包</Link>
            <Link className="text-[#c0c1ff]" href="/risk-database">风险库</Link>
            <Link href="/app/points">VP</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8 md:py-12">
        <section className="max-w-2xl text-center md:text-left">
          <p className="text-sm font-semibold text-[#c0c1ff]">Risk intelligence</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">风险百科</h1>
          <p className="mt-4 text-base leading-7 text-[#9ca3af] md:text-lg">用人话解释合约漏洞、链上风险和常见骗局。先理解风险，再决定是否继续。</p>
        </section>

        <Link href="/check" className="mt-8 flex h-14 max-w-3xl items-center rounded-lg border border-[#262932] bg-[#16181d] px-4 text-sm text-[#9ca3af] hover:border-[#c0c1ff]">
          搜索风险、漏洞或术语，或直接查 CA...
        </Link>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[#f9fafb]">探索分类</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {categoryLabels.map((label, index) => (
              <span key={label} className={index === 0 ? "rounded-full border border-[#c0c1ff]/30 bg-[#8083ff]/10 px-4 py-2 text-sm font-semibold text-[#c0c1ff]" : "rounded-full border border-[#262932] bg-[#16181d] px-4 py-2 text-sm text-[#c7c4d7]"}>{label}</span>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="text-xl font-semibold text-[#f9fafb]">主推解读</h2>
            <article className="mt-5 overflow-hidden rounded-xl border border-[#262932] bg-[#16181d]">
              <div className="flex h-48 items-center justify-center bg-[#292932] text-5xl font-semibold text-[#c0c1ff] md:h-64">!</div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="rounded bg-[#ef4444]/10 px-2.5 py-1 text-[#ef4444]">核心风险</span>
                  <span className="text-[#9ca3af]">风险教育</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-[#f9fafb]">{featured.title}</h3>
                <p className="mt-3 max-w-2xl leading-7 text-[#9ca3af]">{featured.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {featured.relatedSignals.map((signal) => <span key={signal} className="rounded bg-[#292932] px-2 py-1 font-mono text-xs text-[#c7c4d7]">{signal}</span>)}
                </div>
                <p className="mt-5 border-l-2 border-[#8083ff] pl-3 text-sm leading-6 text-[#c0c1ff]">{featured.recommendedAction}</p>
              </div>
            </article>
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-xl font-semibold text-[#f9fafb]">近期解读</h2>
            <div className="mt-5 space-y-4">
              {recent.map((lesson, index) => (
                <article key={lesson.id} className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
                  <div className="flex gap-4">
                    <div className={index === 0 ? "flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#292932] text-xl text-[#f97316]" : "flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#292932] text-xl text-[#ef4444]"}>!</div>
                    <div>
                      <h3 className="font-semibold text-[#f9fafb]">{lesson.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#9ca3af]">{lesson.summary}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12 flex flex-col items-center justify-between gap-6 rounded-xl border border-[#262932] bg-[#1b1b23] p-6 md:flex-row md:p-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl font-semibold text-[#f9fafb]">发现可疑 CA？</h2>
            <p className="mt-3 leading-7 text-[#9ca3af]">不要只凭名称或群聊消息判断。使用链哨 AI 的 CA 安检入口先看基础风险报告。</p>
          </div>
          <Link href="/check" className="w-full rounded-lg bg-[#c0c1ff] px-6 py-4 text-center text-sm font-semibold text-[#1000a9] md:w-auto">现在查 CA</Link>
        </section>
      </div>
      <MobileNav active="database" />
    </main>
  );
}
