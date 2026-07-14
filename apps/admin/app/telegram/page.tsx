import { listMockTelegramGroups, listTelegramCommands } from "@chainvigil/telegram";

export default function AdminTelegramPage() {
  const groups = listMockTelegramGroups();
  const commands = listTelegramCommands();

  return (
    <main className="min-h-screen px-5 py-8 md:px-8 md:py-10">
      <p className="text-sm font-semibold text-[#c0c1ff]">TELEGRAM OPERATIONS</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Telegram 群组管理</h1>
      <p className="mt-3 text-[#c7c4d7]">管理群检测额度、自动提醒和群主设置。</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <article key={group.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
            <h2 className="font-semibold">{group.title}</h2>
            <p className="mt-2 text-sm text-[#8f8b9e]">
              检测 {group.checksToday} / 高危提醒 {group.highRiskAlertsToday}
            </p>
            <p className="mt-2 text-sm text-[#8f8b9e]">
              自动检测 {group.autoDetectEnabled ? "开启" : "关闭"} / 每日上限 {group.dailyCheckLimit}
            </p>
          </article>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Bot 命令清单</h2>
        <p className="mt-2 text-sm text-[#8f8b9e]">只读展示当前 Bot skeleton 支持的命令，文案来自共享 contract。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {commands.map((item) => (
            <article key={item.command} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
              <p className="font-mono text-sm text-[#c0c1ff]">{item.command}</p>
              <p className="mt-2 text-sm text-[#8f8b9e]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
