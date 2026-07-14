import Link from "next/link";
import { getMockPointLedgerSummary, listPointRules } from "@chainvigil/points";

export default function PointsPage() {
  const rules = Object.entries(listPointRules());
  const ledger = getMockPointLedgerSummary();

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <nav className="mx-auto flex max-w-5xl items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI｜链哨 AI</Link>
        <Link href="/app">App 控制台</Link>
      </nav>
      <section className="mx-auto mt-12 max-w-5xl">
        <p className="text-sm font-semibold text-[#eab308]">Vigil Points</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#f9fafb]">哨点 VP</h1>
        <p className="mt-4 max-w-3xl leading-8 text-[#c7c4d7]">
          Vigil Points 用于记录真实产品使用、安全贡献和推广贡献。VP 不等于未来 token，也不承诺固定兑换。
        </p>
      </section>
      <section className="mx-auto mt-8 max-w-5xl rounded-lg border border-[#34343d] bg-[#16181d] p-5 sm:p-6">
        <h2 className="text-2xl font-semibold text-[#f9fafb]">我的哨点摘要</h2>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-md border border-[#262932] bg-[#0d0d15] p-4">
            <dt className="text-[#9ca3af]">已确认</dt>
            <dd className="mt-1 text-xl font-semibold text-[#f9fafb]">{ledger.totalConfirmed} VP</dd>
          </div>
          <div className="rounded-md border border-[#eab308]/30 bg-[#eab308]/10 p-4">
            <dt className="text-[#fde68a]">待确认</dt>
            <dd className="mt-1 text-xl font-semibold text-[#fde68a]">{ledger.totalPending} VP</dd>
          </div>
          <div className="rounded-md border border-[#262932] bg-[#0d0d15] p-4">
            <dt className="text-[#9ca3af]">已拒绝</dt>
            <dd className="mt-1 text-xl font-semibold text-[#f9fafb]">{ledger.totalRejected} VP</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-[#9ca3af]">{ledger.disclaimer}</p>
      </section>
      <div className="mx-auto mt-8 max-w-5xl space-y-3">
        {rules.map(([type, rule]) => (
          <div key={type} className="rounded-lg border border-[#262932] bg-[#16181d] p-4">
            <p className="font-semibold text-[#f9fafb]">{type}</p>
            <p className="mt-1 text-sm text-[#c7c4d7]">
              {rule.reason}：{rule.points} VP / {rule.ledger}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
