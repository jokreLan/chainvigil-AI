import Link from "next/link";
import { CheckForm } from "./ui/check-form";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0b0f]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 md:px-8">
        <nav className="flex items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
          <Link href="/" className="font-semibold text-[#f9fafb]">
            <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#8083ff] text-xs text-[#0a0b0f]">CV</span>
            ChainVigil AI <span className="hidden text-[#9ca3af] sm:inline">｜链哨 AI</span>
          </Link>
          <div className="hidden gap-5 md:flex">
            <Link href="/check">CA 安检</Link>
            <Link href="/wallet-check">钱包体检</Link>
            <Link href="/risk-database">风险库</Link>
          </div>
          <Link href="/app/points" className="rounded-md border border-[#464554] px-3 py-2 text-[#eab308]">VP</Link>
        </nav>

        <div className="grid flex-1 gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#c0c1ff]">
              Web3 Security Intelligence
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-[#f9fafb] md:text-7xl">
              买币前，先查 CA。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#c7c4d7]">
              AI 检测貔貅盘、高税、黑名单、LP 风险、Owner 后门和假币风险。免费检测，无需连接钱包。
            </p>
            <div className="mt-8 max-w-2xl rounded-lg border border-[#464554] bg-[#16181d] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
              <CheckForm compact={false} />
            </div>
            <p className="mt-5 text-sm text-[#9ca3af]">
              第一版优先支持 SOL 和 BNB。其它 EVM 链保留 mock contract 兼容，后续按数据源接入推进。
            </p>
          </div>

          <div className="rounded-lg border border-[#262932] bg-[#16181d] p-6 shadow-[0_20px_48px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#9ca3af]">示例风险报告</p>
              <span className="rounded-full border border-[#ef4444]/40 bg-[#ef4444]/10 px-3 py-1 text-xs font-semibold text-[#fca5a5]">BLOCK</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[#f9fafb]">AI 结论：禁买</h2>
            <p className="mt-2 text-[#fca5a5]">疑似貔貅盘，卖出路径存在一票否决风险。</p>
            <div className="mt-6 space-y-3 text-sm leading-6 text-[#c7c4d7]">
              <p className="border-l-2 border-[#ef4444] pl-3">卖出仿真失败，当前路径无法正常卖出。</p>
              <p className="border-l-2 border-[#f97316] pl-3">合约 owner 可修改卖出税。</p>
              <p className="border-l-2 border-[#f59e0b] pl-3">LP 锁定状态未确认，存在撤池风险。</p>
              <p className="border-t border-[#262932] pt-4 text-[#9ca3af]">
                不替你投资，只帮你把交易安全风险讲清楚。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
