import Link from "next/link";
import { listMockFakeTokenExamples } from "@chainvigil/risk-core";

export default function FakeTokenDatabasePage() {
  const examples = listMockFakeTokenExamples();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/check">查 CA</Link>
      </nav>
      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Fake token database
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">假币数据库</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/72">
          收录假冒主流资产、假空投和社群热传仿盘的识别规则。V0 先提供解释入口，后续接数据库和举报审核。
        </p>
      </section>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {examples.map((example) => (
          <article key={example.id} className="border border-emerald-300/14 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{example.title}</h2>
              <span className="text-sm text-emerald-200">{example.impersonates}</span>
            </div>
            <p className="mt-3 leading-7 text-emerald-50/75">{example.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {example.signals.map((signal) => (
                <span key={signal} className="border border-emerald-300/20 px-2 py-1 text-xs text-emerald-100/70">
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-4 leading-7 text-emerald-100/72">{example.recommendedAction}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
