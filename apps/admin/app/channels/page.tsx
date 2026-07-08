import { listMockGrowthChannels } from "@chainvigil/points";

const statusLabel = {
  active: "生效中",
  paused: "已暂停",
  pending_review: "待复核",
};

const typeLabel = {
  kol: "KOL",
  telegram_group: "Telegram 群组",
  x_thread: "X 内容",
};

export default function AdminChannelsPage() {
  const channels = listMockGrowthChannels();

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">KOL 渠道管理</h1>
      <p className="mt-3 text-slate-300">推广奖励按真实转化结算，不奖励空动作。</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {channels.map((channel) => (
          <article key={channel.id} className="border border-slate-700 bg-slate-900 p-5 text-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">{typeLabel[channel.type]}</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{channel.name}</h2>
              </div>
              <span className="border border-slate-700 px-3 py-1 text-xs text-slate-300">
                {statusLabel[channel.status]}
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="border border-slate-700 p-3">
                <dt className="text-slate-500">有效访问</dt>
                <dd className="mt-1 font-semibold">{channel.effectiveVisits}</dd>
              </div>
              <div className="border border-slate-700 p-3">
                <dt className="text-slate-500">有效 CA</dt>
                <dd className="mt-1 font-semibold">{channel.effectiveCaChecks}</dd>
              </div>
              <div className="border border-slate-700 p-3">
                <dt className="text-slate-500">待确认 VP</dt>
                <dd className="mt-1 font-semibold">{channel.pendingVp}</dd>
              </div>
              <div className="border border-slate-700 p-3">
                <dt className="text-slate-500">已确认 VP</dt>
                <dd className="mt-1 font-semibold">{channel.confirmedVp}</dd>
              </div>
            </dl>
            <p className="mt-4 font-mono text-sm text-emerald-200">{channel.referralCode}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{channel.note}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
