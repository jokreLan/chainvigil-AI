const groups = [
  { title: "Base Alpha Group", checks: 128, alerts: 12 },
  { title: "Meme Watch CN", checks: 86, alerts: 9 },
];

export default function AdminTelegramPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">Telegram 群组管理</h1>
      <p className="mt-3 text-slate-300">管理群检测额度、自动提醒和群主设置。</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <article key={group.title} className="border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold">{group.title}</h2>
            <p className="mt-2 text-sm text-slate-400">
              检测 {group.checks} / 高危提醒 {group.alerts}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
