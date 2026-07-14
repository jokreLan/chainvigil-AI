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
    <main className="min-h-screen px-5 py-8 md:px-8 md:py-10">
      <p className="text-sm font-semibold text-[#c0c1ff]">GROWTH ATTRIBUTION</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">KOL 渠道管理</h1>
      <p className="mt-3 text-[#c7c4d7]">推广奖励按真实转化结算，不奖励空动作。</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {channels.map((channel) => (
          <article key={channel.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5 text-[#e4e1ed]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#8f8b9e]">{typeLabel[channel.type]}</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{channel.name}</h2>
              </div>
              <span className="rounded border border-[#363944] px-3 py-1 text-xs text-[#c7c4d7]">
                {statusLabel[channel.status]}
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded border border-[#363944] p-3">
                <dt className="text-[#8f8b9e]">有效访问</dt>
                <dd className="mt-1 font-semibold">{channel.effectiveVisits}</dd>
              </div>
              <div className="rounded border border-[#363944] p-3">
                <dt className="text-[#8f8b9e]">有效 CA</dt>
                <dd className="mt-1 font-semibold">{channel.effectiveCaChecks}</dd>
              </div>
              <div className="rounded border border-[#363944] p-3">
                <dt className="text-[#8f8b9e]">待确认 VP</dt>
                <dd className="mt-1 font-semibold">{channel.pendingVp}</dd>
              </div>
              <div className="rounded border border-[#363944] p-3">
                <dt className="text-[#8f8b9e]">已确认 VP</dt>
                <dd className="mt-1 font-semibold">{channel.confirmedVp}</dd>
              </div>
            </dl>
            <p className="mt-4 font-mono text-sm text-[#c0c1ff]">{channel.referralCode}</p>
            <p className="mt-3 text-sm leading-6 text-[#8f8b9e]">{channel.note}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
