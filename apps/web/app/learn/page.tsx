import Link from "next/link";
import { listMockRiskEducationLessons } from "@chainvigil/risk-core";

const lessons = listMockRiskEducationLessons();

export default function LearnPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/risk-database">风险数据库</Link>
      </nav>
      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Learn
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">风险百科</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/72">
          用人话解释链上风险，让用户知道为什么危险，而不是只看到技术字段。
        </p>
      </section>
      <section className="mt-10 space-y-4">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="border border-emerald-300/14 bg-black/20 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
              {lesson.category} · {lesson.difficulty}
            </p>
            <h2 className="text-xl font-semibold text-white">{lesson.title}</h2>
            <p className="mt-3 leading-7 text-emerald-50/70">{lesson.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lesson.relatedSignals.map((signal) => (
                <span
                  key={signal}
                  className="border border-emerald-300/15 bg-emerald-300/8 px-2.5 py-1 text-xs text-emerald-50/70"
                >
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-4 border-l-2 border-emerald-300/40 pl-3 text-sm leading-6 text-emerald-50/75">
              {lesson.recommendedAction}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
