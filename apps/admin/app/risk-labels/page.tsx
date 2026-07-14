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
    <main className="min-h-screen px-5 py-8 md:px-8 md:py-10">
      <p className="text-sm font-semibold text-[#c0c1ff]">LABEL INTELLIGENCE</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">风险标签管理</h1>
      <p className="mt-3 max-w-2xl text-[#c7c4d7]">
        管理 deployer、spender、假币和高危 CA 标签。风险修正必须可追踪。
      </p>
      <section className="mt-8 grid gap-4">
        {labels.map((item) => (
          <article key={item.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded border border-[#8083ff]/30 bg-[#8083ff]/10 px-3 py-1 font-semibold text-[#c0c1ff]">
                {targetTypeLabel[item.targetType]}
              </span>
              <span className="text-[#e4e1ed]">{item.label}</span>
              <span className="text-[#8f8b9e]">{statusLabel[item.status]}</span>
              <span className="text-[#8f8b9e]">Confidence {item.confidence}</span>
            </div>
            <p className="mt-4 break-all font-mono text-sm text-[#8f8b9e]">
              {item.chain ?? "global"}:{item.target}
            </p>
            <p className="mt-4 leading-7 text-[#c7c4d7]">{item.reason}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.evidenceTags.map((tag) => (
                <span key={tag} className="rounded border border-[#363944] px-3 py-1 text-xs text-[#c7c4d7]">
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
