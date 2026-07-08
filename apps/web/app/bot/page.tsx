export default function BotPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-semibold text-white">Telegram Bot skeleton</h1>
      <p className="mt-4 leading-8 text-emerald-50/72">
        V0 Bot 支持 mock `/check 0x...` 调用，复用 ChainVigil AI 的风险报告文案。正式群内自动检测、频控和积分归因会在下一阶段接入。
      </p>
    </main>
  );
}
