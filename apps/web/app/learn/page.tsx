import Link from "next/link";
import { listMockRiskEducationLessons } from "@chainvigil/risk-core";

const lessons = listMockRiskEducationLessons();

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/risk-database">风险数据库</Link>
      </nav>
      <section className="mx-auto mt-12 max-w-7xl">
        <p className="text-sm font-semibold text-[#c0c1ff]">Learn</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f9fafb] sm:text-5xl">风险百科</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#c7c4d7]">
          用人话解释链上风险，让用户知道为什么危险，而不是只看到技术字段。
        </p>
      </section>
      <section className="mx-auto mt-10 max-w-7xl space-y-4">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
            <p className="text-xs font-semibold text-[#c0c1ff]">
              {lesson.category} · {lesson.difficulty}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#f9fafb]">{lesson.title}</h2>
            <p className="mt-3 leading-7 text-[#c7c4d7]">{lesson.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lesson.relatedSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-md bg-[#292932] px-2.5 py-1 font-mono text-xs text-[#c7c4d7]"
                >
                  {signal}
                </span>
              ))}
            </div>
            <p className="mt-4 border-l-2 border-[#8083ff] pl-3 text-sm leading-6 text-[#c0c1ff]">
              {lesson.recommendedAction}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
