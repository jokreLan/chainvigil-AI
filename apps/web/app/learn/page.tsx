import Link from "next/link";

const lessons = [
  {
    title: "什么是貔貅盘？",
    desc: "能买不能卖，或卖出成本极高的 token 风险。",
  },
  {
    title: "为什么 LP 未锁有风险？",
    desc: "流动性可被撤走时，用户可能无法按预期退出。",
  },
  {
    title: "无限授权为什么危险？",
    desc: "spender 被攻击或作恶时，可能转走授权范围内资产。",
  },
  {
    title: "相对低风险不等于推荐买入",
    desc: "ChainVigil 只判断交易安全风险，不判断价格和收益。",
  },
];

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
          <article key={lesson.title} className="border border-emerald-300/14 bg-black/20 p-5">
            <h2 className="text-xl font-semibold text-white">{lesson.title}</h2>
            <p className="mt-3 leading-7 text-emerald-50/70">{lesson.desc}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
