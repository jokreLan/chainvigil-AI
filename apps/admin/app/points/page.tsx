import { getMockPointLedgerSummary } from "@chainvigil/points";

export default function AdminPointsPage() {
  const ledger = getMockPointLedgerSummary();

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">哨点 VP 事件审核</h1>
      <p className="mt-3 text-slate-300">高价值贡献和推广奖励必须支持 pending / confirmed / rejected。</p>
      <section className="mt-8 border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-xl font-semibold">Mock ledger 摘要</h2>
        <dl className="mt-5 grid gap-3 text-sm md:grid-cols-3">
          <div className="border border-slate-700 p-3">
            <dt className="text-slate-500">已确认</dt>
            <dd className="mt-1 text-lg font-semibold">{ledger.totalConfirmed} VP</dd>
          </div>
          <div className="border border-slate-700 p-3">
            <dt className="text-slate-500">待确认</dt>
            <dd className="mt-1 text-lg font-semibold text-amber-200">{ledger.totalPending} VP</dd>
          </div>
          <div className="border border-slate-700 p-3">
            <dt className="text-slate-500">已拒绝</dt>
            <dd className="mt-1 text-lg font-semibold">{ledger.totalRejected} VP</dd>
          </div>
        </dl>
      </section>
      <div className="mt-8 space-y-3">
        {ledger.recentEvents.map((event) => (
          <div key={event.id} className="border border-slate-700 bg-slate-900 p-4">
            <p className="font-semibold">{event.type}</p>
            <p className="mt-2 text-sm text-slate-400">
              {event.points} VP / {event.status}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
