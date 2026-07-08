const channels = ["KOL-001", "TG-GROUP-BASE", "X-THREAD-WEEKLY"];

export default function AdminChannelsPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">KOL 渠道管理</h1>
      <p className="mt-3 text-slate-300">推广奖励按真实转化结算，不奖励空动作。</p>
      <div className="mt-8 space-y-3">
        {channels.map((channel) => (
          <div key={channel} className="border border-slate-700 bg-slate-900 p-4 text-slate-200">
            {channel}
          </div>
        ))}
      </div>
    </main>
  );
}
