import { listMockAssetCleanupPolicies } from "@chainvigil/risk-core";

export default function DustPage() {
  const policies = listMockAssetCleanupPolicies().filter((policy) => policy.flow === "dust_scan");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">粉尘扫描</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        V0/V1 不做粉尘归集和自动 swap。当前页面只建立扫描、估算和风险分类的信息结构。
      </p>
      <section className="mt-8 border border-emerald-300/14 bg-black/20 p-5">
        <h2 className="text-xl font-semibold text-white">归集前必须满足</h2>
        {policies.map((policy) => (
          <article key={policy.id} className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-white">{policy.title}</h3>
              <span className="text-sm text-emerald-200">{policy.decision}</span>
            </div>
            <p className="mt-3 leading-7 text-emerald-50/72">{policy.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {policy.requiredChecks.map((check) => (
                <span key={check} className="border border-emerald-300/20 px-2 py-1 text-xs text-emerald-100/70">
                  {check}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {policy.prohibitedActions.map((action) => (
                <span key={action} className="border border-red-300/25 px-2 py-1 text-xs text-red-100/80">
                  {action}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
