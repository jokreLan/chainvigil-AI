import { listMockAssetCleanupPolicies } from "@chainvigil/risk-core";

export default function ApprovalCleanerPage() {
  const policies = listMockAssetCleanupPolicies().filter((policy) => policy.flow === "approval_cleaner");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">授权清理</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        授权清理属于执行类能力。正式开放前必须展示资产、spender、额度、撤销方式、gas 估算和二次确认。
      </p>
      <section className="mt-8 border border-emerald-300/14 bg-black/20 p-5">
        <h2 className="text-xl font-semibold text-white">执行保护机制</h2>
        {policies.map((policy) => (
          <article key={policy.id} className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-white">{policy.title}</h3>
              <span className="text-sm text-emerald-200">{policy.decision}</span>
            </div>
            <p className="mt-3 leading-7 text-emerald-50/72">{policy.description}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-emerald-200/70">必须检查</p>
                <ul className="mt-3 space-y-2 text-emerald-50/72">
                  {policy.requiredChecks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm text-emerald-200/70">禁止动作</p>
                <ul className="mt-3 space-y-2 text-emerald-50/72">
                  {policy.prohibitedActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
