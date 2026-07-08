import { listTelegramCommands } from "@chainvigil/telegram";

export default function BotPage() {
  const commands = listTelegramCommands();

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-semibold text-white">Telegram Bot skeleton</h1>
      <p className="mt-4 leading-8 text-emerald-50/72">
        V0 Bot 支持 mock `/check 0x...` 调用，复用 ChainVigil AI 的风险报告文案。正式群内自动检测、频控和积分归因会在下一阶段接入。
      </p>
      <section className="mt-8 space-y-3">
        {commands.map((item) => (
          <article key={item.command} className="border border-emerald-300/14 bg-black/20 p-4">
            <code className="text-emerald-100">{item.command}</code>
            <p className="mt-2 text-sm leading-6 text-emerald-50/70">{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
