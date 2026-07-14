import Link from "next/link";
import { listTelegramCommands } from "@chainvigil/telegram";

export default function BotPage() {
  const commands = listTelegramCommands();

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <nav className="mx-auto flex max-w-5xl items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI｜链哨 AI</Link>
        <Link href="/check">CA 安检</Link>
      </nav>
      <section className="mx-auto mt-12 max-w-5xl">
        <p className="text-sm font-semibold text-[#c0c1ff]">Telegram Bot</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#f9fafb]">群内先查 CA</h1>
        <p className="mt-4 max-w-3xl leading-8 text-[#c7c4d7]">
          V0 Bot 支持 mock `/check &lt;CA&gt;` 调用，优先覆盖 SOL 和 BNB Token CA，复用 ChainVigil AI 的风险报告文案。正式群内自动检测、频控和积分归因会在下一阶段接入。
        </p>
      </section>
      <section className="mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="rounded-lg border border-[#34343d] bg-[#16181d] p-5">
          <h2 className="text-xl font-semibold text-[#f9fafb]">可用命令</h2>
          <div className="mt-4 space-y-3">
        {commands.map((item) => (
          <article key={item.command} className="rounded-md border border-[#262932] bg-[#0d0d15] p-4">
            <code className="font-mono text-[#c0c1ff]">{item.command}</code>
            <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{item.description}</p>
          </article>
        ))}
          </div>
        </div>
        <aside className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
          <p className="text-xs font-semibold text-[#9ca3af]">V0 状态</p>
          <p className="mt-3 text-lg font-semibold text-[#f9fafb]">Webhook mock 已就绪</p>
          <p className="mt-3 text-sm leading-6 text-[#c7c4d7]">不自动识别群消息，不代替人工判断，不执行任何交易或钱包操作。</p>
        </aside>
      </section>
    </main>
  );
}
