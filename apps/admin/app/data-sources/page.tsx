import {
  getAdapterHealth,
  getRiskEvidenceProviderStatus,
} from "@chainvigil/data-adapters";

export const metadata = { title: "数据源" };

export default function AdminDataSourcesPage() {
  const adapters = getAdapterHealth();
  const evidenceProviders = getRiskEvidenceProviderStatus();

  return (
    <main className="admin-page min-h-screen">
      <p className="admin-kicker">DATA HEALTH · CONFIGURATION ONLY</p>
      <h1 className="admin-title">数据源状态</h1>
      <p className="admin-lead">
        V0 只展示 provider contract
        和配置就绪状态，不在后台直接调用真实外部数据源。
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {adapters.map((adapter) => (
          <section key={adapter.name} className="admin-panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{adapter.name}</h2>
                <p className="mt-2 text-sm text-[#8f8b9e]">
                  {adapter.requiredEnv
                    ? `依赖环境变量：${adapter.requiredEnv}`
                    : "无需外部凭证"}
                </p>
              </div>
              <span
                className={
                  adapter.ready
                    ? "rounded border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200"
                    : "rounded border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-sm text-amber-200"
                }
              >
                {adapter.ready ? "ready" : "mock"}
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded border border-[#363944] p-3">
                <dt className="text-[#8f8b9e]">模式</dt>
                <dd className="mt-1 font-semibold">{adapter.mode}</dd>
              </div>
              <div className="rounded border border-[#363944] p-3">
                <dt className="text-[#8f8b9e]">可用</dt>
                <dd className="mt-1 font-semibold">
                  {adapter.ready ? "是" : "否"}
                </dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">
          SOL / BNB 风险证据 Provider
        </h2>
        <p className="mt-2 text-sm text-[#8f8b9e]">
          只声明链级证据范围、配置状态与 mock 降级策略；V0
          不会因为配置存在就宣称已经完成真实扫描。
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {evidenceProviders.map((provider) => (
            <section key={provider.id} className="admin-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{provider.name}</h3>
                  <p className="mt-2 text-sm text-[#8f8b9e]">{provider.note}</p>
                </div>
                <span className="rounded border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-sm text-amber-200">
                  {provider.mode}
                </span>
              </div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded border border-[#363944] p-3">
                  <dt className="text-[#8f8b9e]">支持链</dt>
                  <dd className="mt-1 font-semibold">
                    {provider.chains.join(", ")}
                  </dd>
                </div>
                <div className="rounded border border-[#363944] p-3">
                  <dt className="text-[#8f8b9e]">降级策略</dt>
                  <dd className="mt-1 font-semibold">{provider.fallback}</dd>
                </div>
              </dl>
              <p className="mt-4 break-words text-sm text-[#8f8b9e]">
                证据：{provider.evidenceTypes.join(", ")}
                {provider.requiredEnv
                  ? `；环境变量：${provider.requiredEnv}`
                  : "；无需外部凭证"}
              </p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
