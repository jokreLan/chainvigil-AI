import { listMockRiskLabels } from "@chainvigil/risk-core";

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
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">风险标签管理</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        管理 deployer、spender、假币和高危 CA 标签。风险修正必须可追踪。
      </p>
      <section className="mt-8 grid gap-4">
        {labels.map((item) => (
          <article key={item.id} className="border border-slate-700 bg-slate-900 p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="bg-emerald-300 px-3 py-1 font-semibold text-emerald-950">
                {targetTypeLabel[item.targetType]}
              </span>
              <span className="text-slate-300">{item.label}</span>
              <span className="text-slate-400">{statusLabel[item.status]}</span>
              <span className="text-slate-400">Confidence {item.confidence}</span>
            </div>
            <p className="mt-4 break-all font-mono text-sm text-slate-400">
              {item.chain ?? "global"}:{item.target}
            </p>
            <p className="mt-4 leading-7 text-slate-300">{item.reason}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.evidenceTags.map((tag) => (
                <span key={tag} className="border border-slate-700 px-3 py-1 text-xs text-slate-300">
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
