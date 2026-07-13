import Link from "next/link";
import { CheckForm } from "./ui/check-form";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-12">
        <nav className="mb-16 flex items-center justify-between text-sm text-emerald-100/70">
          <Link href="/" className="font-semibold text-emerald-100">
            ChainVigil AI｜链哨 AI
          </Link>
          <div className="flex gap-5">
            <Link href="/check">CA 安检</Link>
            <Link href="/wallet-check">钱包体检</Link>
            <Link href="/risk-database">风险库</Link>
            <Link href="/learn">风险百科</Link>
            <Link href="/bot">Telegram Bot</Link>
            <Link href="/app/points">哨点 VP</Link>
          </div>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Web3 token risk scanner
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white md:text-7xl">
              买币前，先查 CA。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/78">
              AI 检测貔貅盘、高税、黑名单、LP 风险、Owner 后门和假币风险。免费检测，无需连接钱包。
            </p>
            <div className="mt-8 max-w-2xl">
              <CheckForm compact={false} />
            </div>
            <p className="mt-5 text-sm text-emerald-100/60">
              第一版优先支持 SOL 和 BNB。其它 EVM 链保留 mock contract 兼容，后续按数据源接入推进。
            </p>
          </div>

          <div className="border border-emerald-300/18 bg-black/24 p-6 shadow-2xl shadow-emerald-950/40 backdrop-blur">
            <p className="text-sm text-emerald-200/70">示例报告</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">AI 结论：禁买｜疑似貔貅盘</h2>
            <div className="mt-6 space-y-4 text-sm leading-6 text-emerald-50/78">
              <p>原因 1：卖出仿真失败，当前路径无法正常卖出。</p>
              <p>原因 2：合约 owner 可修改卖出税。</p>
              <p>原因 3：LP 锁定状态未确认，存在撤池风险。</p>
              <p className="border-t border-emerald-300/14 pt-4 text-emerald-100">
                不替你投资，只帮你把交易安全风险讲清楚。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
