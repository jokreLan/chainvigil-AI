import Link from "next/link";
import { listMockFakeTokenExamples } from "@chainvigil/risk-core";
import { RiskBadge } from "../ui/risk-badge";

export default function FakeTokenDatabasePage() {
  const examples = listMockFakeTokenExamples();

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/check">查 CA</Link>
      </nav>
      <section className="mx-auto mt-12 max-w-7xl">
        <p className="text-sm font-semibold text-[#c0c1ff]">Fake token database</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f9fafb] sm:text-5xl">假币数据库</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#c7c4d7]">
          收录假冒主流资产、假空投和社群热传仿盘的识别规则。V0 先提供解释入口，后续接数据库和举报审核。
        </p>
      </section>
      <section className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-3">
        {examples.map((example) => (
          <article key={example.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[#f9fafb]">{example.title}</h2>
              <RiskBadge level={example.riskLevel} label={example.impersonates} />
            </div>
            <p className="mt-3 leading-7 text-[#c7c4d7]">{example.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {example.signals.map((signal) => (
                <span key={signal} className="rounded-md bg-[#292932] px-2 py-1 font-mono text-xs text-[#c7c4d7]">
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-4 border-t border-[#262932] pt-4 leading-7 text-[#c0c1ff]">{example.recommendedAction}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
