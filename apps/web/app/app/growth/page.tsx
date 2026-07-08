import { listMockGrowthChannels } from "@chainvigil/points";

export default function GrowthPage() {
  const channels = listMockGrowthChannels();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">推广中心</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        推广奖励只记录真实转化，不奖励空动作。所有高价值 VP 默认先进入 pending 状态。
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {channels.map((channel) => (
          <article key={channel.id} className="border border-emerald-300/14 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{channel.name}</h2>
              <span className="text-sm text-emerald-200">{channel.referralCode}</span>
            </div>
            <p className="mt-3 text-sm text-emerald-100/65">{channel.type}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-emerald-50/70">
              <p>有效访问 {channel.effectiveVisits}</p>
              <p>有效 CA {channel.effectiveCaChecks}</p>
              <p>待确认 VP {channel.pendingVp}</p>
              <p>已确认 VP {channel.confirmedVp}</p>
            </div>
            <p className="mt-4 leading-7 text-emerald-50/68">{channel.note}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
