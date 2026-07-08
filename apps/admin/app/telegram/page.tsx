import { listMockTelegramGroups, listTelegramCommands } from "@chainvigil/telegram";

export default function AdminTelegramPage() {
  const groups = listMockTelegramGroups();
  const commands = listTelegramCommands();

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">Telegram 群组管理</h1>
      <p className="mt-3 text-slate-300">管理群检测额度、自动提醒和群主设置。</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <article key={group.id} className="border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold">{group.title}</h2>
            <p className="mt-2 text-sm text-slate-400">
              检测 {group.checksToday} / 高危提醒 {group.highRiskAlertsToday}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              自动检测 {group.autoDetectEnabled ? "开启" : "关闭"} / 每日上限 {group.dailyCheckLimit}
            </p>
          </article>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Bot 命令清单</h2>
        <p className="mt-2 text-sm text-slate-400">只读展示当前 Bot skeleton 支持的命令，文案来自共享 contract。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {commands.map((item) => (
            <article key={item.command} className="border border-slate-700 bg-slate-950 p-4">
              <p className="font-mono text-sm text-emerald-200">{item.command}</p>
              <p className="mt-2 text-sm text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
