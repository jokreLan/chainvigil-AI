import { listMockRiskReviewQueue } from "@chainvigil/risk-core";

export const metadata = { title: "高危 CA 审核" };

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
    <main className="admin-page min-h-screen">
      <p className="admin-kicker">RISK OPERATIONS · MOCK FALLBACK</p>
      <h1 className="admin-title">高危 CA 审核</h1>
      <p className="admin-lead">
        MOCK FALLBACK ·
        READ-ONLY。当前展示审核队列结构，不代表真实举报、真实高危数量或已执行修正。
      </p>
      <section className="admin-grid-single mt-8 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="admin-panel admin-min-zero p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded border border-red-400/40 bg-red-400/10 px-3 py-1 font-semibold text-red-200">
                {item.label}
              </span>
              <span className="text-[#e4e1ed]">{statusLabel[item.status]}</span>
              <span className="text-[#8f8b9e]">
                {submittedByLabel[item.submittedBy]}
              </span>
              <span className="text-[#8f8b9e]">
                SAMPLE LABEL · {item.label}
              </span>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">
              {item.tokenSymbol}
            </h2>
            <p className="admin-break-chip mt-2 font-mono text-sm text-[#8f8b9e]">
              {item.chain}:{item.tokenAddress}
            </p>
            <p className="mt-4 leading-7 text-[#c7c4d7]">{item.reason}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.signals.map((signal) => (
                <span
                  key={signal}
                  className="admin-break-chip rounded border border-[#363944] px-3 py-1 text-xs text-[#c7c4d7]"
                >
                  {signal}
                </span>
              ))}
            </div>
            <a
              className="admin-action mt-4 font-mono text-xs font-semibold uppercase text-[#c3f5ff] hover:text-white"
              href={item.reportUrl}
            >
              查看公开报告
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
