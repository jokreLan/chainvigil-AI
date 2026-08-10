import {
  listMockTelegramGroups,
  listTelegramCommands,
} from "@chainvigil/telegram";

export const metadata = { title: "Telegram 群组" };

export default function AdminTelegramPage() {
  const groups = listMockTelegramGroups();
  const commands = listTelegramCommands();

  return (
    <main className="admin-page min-h-screen">
      <p className="admin-kicker">TELEGRAM OPERATIONS · BOT NOT VERIFIED</p>
      <h1 className="admin-title">Telegram 群组管理</h1>
      <p className="admin-lead">
        MOCK FALLBACK ·
        READ-ONLY。群组、检测次数、提醒和额度均为配置样例，不代表 Bot
        已上线或群组已接入。
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <article key={group.id} className="admin-panel p-5">
            <h2 className="font-semibold">{group.title}</h2>
            <p className="mt-2 text-sm text-[#8f8b9e]">
              样例检测 {group.checksToday} / 样例高危提醒{" "}
              {group.highRiskAlertsToday}
            </p>
            <p className="mt-2 text-sm text-[#8f8b9e]">
              自动检测 {group.autoDetectEnabled ? "开启" : "关闭"} / 每日上限{" "}
              {group.dailyCheckLimit}
            </p>
          </article>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Bot 命令清单</h2>
        <p className="mt-2 text-sm text-[#8f8b9e]">
          只读展示当前 Bot skeleton 支持的命令，文案来自共享 contract。
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {commands.map((item) => (
            <article key={item.command} className="admin-panel p-5">
              <p className="font-mono text-sm text-[#c0c1ff]">{item.command}</p>
              <p className="mt-2 text-sm text-[#8f8b9e]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
