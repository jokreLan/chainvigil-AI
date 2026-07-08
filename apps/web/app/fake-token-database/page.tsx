import Link from "next/link";

const examples = [
  "假 USDT：名称和 symbol 相似，但合约地址不匹配官方地址。",
  "假 PEPE：借热门币热度传播，常伴随高税或卖出限制。",
  "假空投 Token：诱导授权或访问钓鱼站点。",
];

export default function FakeTokenDatabasePage() {
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
          <article key={example} className="border border-emerald-300/14 bg-black/20 p-5 leading-7 text-emerald-50/75">
            {example}
          </article>
        ))}
      </section>
    </main>
  );
}
