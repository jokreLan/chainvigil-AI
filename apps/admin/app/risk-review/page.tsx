import { listMockRiskReviewQueue } from "@chainvigil/risk-core";

const statusLabel = {
  pending: "待复核",
  needs_data: "待补证",
  escalated: "已升级",
};

const submittedByLabel = {
  system: "系统触发",
  user_report: "用户举报",
  telegram_group: "Telegram 群组",
};

export default function AdminRiskReviewPage() {
  const items = listMockRiskReviewQueue();

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">高危 CA 审核</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        审核高危 CA、用户举报和误报申诉。所有修正必须记录操作人、对象和理由。
      </p>
      <section className="mt-8 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="border border-slate-700 bg-slate-900 p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="bg-red-300 px-3 py-1 font-semibold text-red-950">{item.label}</span>
              <span className="text-slate-300">{statusLabel[item.status]}</span>
              <span className="text-slate-400">{submittedByLabel[item.submittedBy]}</span>
              <span className="text-slate-400">Score {item.score ?? "UNKNOWN"}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{item.tokenSymbol}</h2>
            <p className="mt-2 break-all font-mono text-sm text-slate-400">
              {item.chain}:{item.tokenAddress}
            </p>
            <p className="mt-4 leading-7 text-slate-300">{item.reason}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.signals.map((signal) => (
                <span key={signal} className="border border-slate-700 px-3 py-1 text-xs text-slate-300">
                  {signal}
                </span>
              ))}
            </div>
            <a className="mt-4 inline-block text-sm font-semibold text-emerald-300" href={item.reportUrl}>
              查看公开报告
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
