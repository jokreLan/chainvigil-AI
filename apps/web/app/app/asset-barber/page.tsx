import { listMockAssetCleanupPolicies } from "@chainvigil/risk-core";

export default function AssetBarberPage() {
  const policies = listMockAssetCleanupPolicies().filter((policy) => policy.flow === "asset_barber");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">资产理发师</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        买后清理中枢，先判断资产类别和风险，再决定是否隐藏、复查或进入后续归集候选。
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {policies.map((policy) => (
          <article key={policy.id} className="border border-emerald-300/14 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{policy.title}</h2>
              <span className="text-sm text-emerald-200">{policy.decision}</span>
            </div>
            <p className="mt-3 leading-7 text-emerald-50/75">{policy.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {policy.requiredChecks.map((check) => (
                <span key={check} className="border border-emerald-300/20 px-2 py-1 text-xs text-emerald-100/70">
                  {check}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
