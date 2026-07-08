import { getMockPointLedgerSummary, listPointRules } from "@chainvigil/points";

export default function PointsPage() {
  const rules = Object.entries(listPointRules());
  const ledger = getMockPointLedgerSummary();

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-semibold text-white">哨点 VP</h1>
      <p className="mt-4 leading-8 text-emerald-50/72">
        Vigil Points 用于记录真实产品使用、安全贡献和推广贡献。VP 不等于未来 token，也不承诺固定兑换。
      </p>
      <section className="mt-8 border border-emerald-300/14 bg-black/20 p-5">
        <h2 className="text-2xl font-semibold text-white">我的哨点摘要</h2>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div className="border border-emerald-300/14 p-3">
            <dt className="text-emerald-50/55">已确认</dt>
            <dd className="mt-1 text-xl font-semibold text-white">{ledger.totalConfirmed} VP</dd>
          </div>
          <div className="border border-emerald-300/14 p-3">
            <dt className="text-emerald-50/55">待确认</dt>
            <dd className="mt-1 text-xl font-semibold text-amber-100">{ledger.totalPending} VP</dd>
          </div>
          <div className="border border-emerald-300/14 p-3">
            <dt className="text-emerald-50/55">已拒绝</dt>
            <dd className="mt-1 text-xl font-semibold text-white">{ledger.totalRejected} VP</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-emerald-50/60">{ledger.disclaimer}</p>
      </section>
      <div className="mt-8 space-y-3">
        {rules.map(([type, rule]) => (
          <div key={type} className="border border-emerald-300/14 bg-black/20 p-4">
            <p className="font-semibold text-white">{type}</p>
            <p className="mt-1 text-sm text-emerald-50/70">
              {rule.reason}：{rule.points} VP / {rule.ledger}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
