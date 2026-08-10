import { listMockRiskLabels } from "@chainvigil/risk-core";

export const metadata = { title: "风险标签" };

const statusLabel = {
  active: "生效中",
  pending_review: "待复核",
  retired: "已停用",
};

const targetTypeLabel = {
  token: "Token",
  deployer: "部署者",
  spender: "授权对象",
  domain: "域名",
};

export default function AdminRiskLabelsPage() {
  const labels = listMockRiskLabels();

  return (
    <main className="admin-page min-h-screen">
      <p className="admin-kicker">LABEL INTELLIGENCE · WRITE DISABLED</p>
      <h1 className="admin-title">风险标签管理</h1>
      <p className="admin-lead">
        MOCK FALLBACK ·
        READ-ONLY。当前标签、状态与置信度均为样例；生产写入和人工修正尚未开放。
      </p>
      <section className="admin-grid-single mt-8 grid gap-4">
        {labels.map((item) => (
          <article key={item.id} className="admin-panel admin-min-zero p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded border border-[#8083ff]/30 bg-[#8083ff]/10 px-3 py-1 font-semibold text-[#c0c1ff]">
                {targetTypeLabel[item.targetType]}
              </span>
              <span className="text-[#e4e1ed]">{item.label}</span>
              <span className="text-[#8f8b9e]">{statusLabel[item.status]}</span>
              <span className="text-[#8f8b9e]">
                SAMPLE CONFIDENCE · UNVERIFIED
              </span>
            </div>
            <p className="admin-break-chip mt-4 font-mono text-sm text-[#8f8b9e]">
              {item.chain ?? "global"}:{item.target}
            </p>
            <p className="mt-4 leading-7 text-[#c7c4d7]">{item.reason}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.evidenceTags.map((tag) => (
                <span
                  key={tag}
                  className="admin-break-chip rounded border border-[#363944] px-3 py-1 text-xs text-[#c7c4d7]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
