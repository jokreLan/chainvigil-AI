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
    <main className="min-h-screen px-5 py-8 md:px-8 md:py-10">
      <p className="text-sm font-semibold text-[#c0c1ff]">RISK OPERATIONS</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">高危 CA 审核</h1>
      <p className="mt-3 max-w-2xl text-[#c7c4d7]">
        审核高危 CA、用户举报和误报申诉。所有修正必须记录操作人、对象和理由。
      </p>
      <section className="mt-8 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded border border-red-400/40 bg-red-400/10 px-3 py-1 font-semibold text-red-200">{item.label}</span>
              <span className="text-[#e4e1ed]">{statusLabel[item.status]}</span>
              <span className="text-[#8f8b9e]">{submittedByLabel[item.submittedBy]}</span>
              <span className="text-[#8f8b9e]">Score {item.score ?? "UNKNOWN"}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{item.tokenSymbol}</h2>
            <p className="mt-2 break-all font-mono text-sm text-[#8f8b9e]">
              {item.chain}:{item.tokenAddress}
            </p>
            <p className="mt-4 leading-7 text-[#c7c4d7]">{item.reason}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.signals.map((signal) => (
                <span key={signal} className="rounded border border-[#363944] px-3 py-1 text-xs text-[#c7c4d7]">
                  {signal}
                </span>
              ))}
            </div>
            <a className="mt-4 inline-block text-sm font-semibold text-[#c0c1ff] hover:text-white" href={item.reportUrl}>
              查看公开报告
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
