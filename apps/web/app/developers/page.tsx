import Link from "next/link";

const sdkItems = [
  "Token Risk API",
  "Wallet Health API",
  "High-risk Address Labels",
  "Telegram/Discord Bot Integration",
];

export default function DevelopersPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/api">API 文档</Link>
      </nav>
      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Developers
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">开发者中心</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/72">
          后续开放风险标签和安全 API，帮助钱包、交易工具、Bot 和社区产品接入 ChainVigil 风险能力。
        </p>
      </section>
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {sdkItems.map((item) => (
          <article key={item} className="border border-emerald-300/14 bg-black/20 p-5 text-xl font-semibold text-white">
            {item}
          </article>
        ))}
      </section>
    </main>
  );
}
