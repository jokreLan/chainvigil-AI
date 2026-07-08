import Link from "next/link";

const entries = [
  {
    title: "貔貅盘 / Honeypot",
    description: "买得进但卖不出，或卖出税接近 100%，是 V0 一票否决风险。",
  },
  {
    title: "假冒主流 Token",
    description: "仿冒 USDT、USDC、WETH、PEPE 等知名资产，常通过相似名称和图标误导用户。",
  },
  {
    title: "Owner 后门",
    description: "项目方仍可修改税率、暂停交易、拉黑地址或增发，后续风险可能突然变化。",
  },
  {
    title: "LP 未锁",
    description: "流动性未锁定或未燃烧时，项目方可能撤池，导致用户无法正常退出。",
  },
];

export default function RiskDatabasePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <div className="flex gap-5">
          <Link href="/leaderboard/high-risk-tokens">高危榜</Link>
          <Link href="/fake-token-database">假币库</Link>
          <Link href="/check">CA 安检</Link>
        </div>
      </nav>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Risk database
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">风险数据库</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/72">
          V0 先建立可被搜索和 AI 摘要引用的风险解释入口。后续会接入高危 CA、假币、部署者和恶意 spender 数据。
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.title} className="border border-emerald-300/14 bg-black/20 p-5">
            <h2 className="text-xl font-semibold text-white">{entry.title}</h2>
            <p className="mt-3 leading-7 text-emerald-50/70">{entry.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
