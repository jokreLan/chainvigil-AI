import { getMockPointLedgerSummary } from "@chainvigil/points";

export default function AdminPointsPage() {
  const ledger = getMockPointLedgerSummary();

  return (
    <main className="min-h-screen px-5 py-8 md:px-8 md:py-10">
      <p className="text-sm font-semibold text-[#eab308]">VIGIL POINTS</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">哨点 VP 事件审核</h1>
      <p className="mt-3 text-[#c7c4d7]">高价值贡献和推广奖励必须支持 pending / confirmed / rejected。</p>
      <section className="mt-8 rounded-lg border border-[#262932] bg-[#16181d] p-5">
        <h2 className="text-xl font-semibold text-white">Mock ledger 摘要</h2>
        <dl className="mt-5 grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded border border-[#363944] p-3">
            <dt className="text-[#8f8b9e]">已确认</dt>
            <dd className="mt-1 text-lg font-semibold text-[#eab308]">{ledger.totalConfirmed} VP</dd>
          </div>
          <div className="rounded border border-[#363944] p-3">
            <dt className="text-[#8f8b9e]">待确认</dt>
            <dd className="mt-1 text-lg font-semibold text-[#fde68a]">{ledger.totalPending} VP</dd>
          </div>
          <div className="rounded border border-[#363944] p-3">
            <dt className="text-[#8f8b9e]">已拒绝</dt>
            <dd className="mt-1 text-lg font-semibold">{ledger.totalRejected} VP</dd>
          </div>
        </dl>
      </section>
      <div className="mt-8 space-y-3">
        {ledger.recentEvents.map((event) => (
          <div key={event.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-4">
            <p className="font-semibold text-[#e4e1ed]">{event.type}</p>
            <p className="mt-2 text-sm text-[#8f8b9e]">
              {event.points} VP / {event.status}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
