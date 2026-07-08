import { getAdapterHealth } from "@chainvigil/data-adapters";

export default function AdminDataSourcesPage() {
  const adapters = getAdapterHealth();

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">数据源状态</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        V0 只展示 provider contract 和配置就绪状态，不在后台直接调用真实外部数据源。
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {adapters.map((adapter) => (
          <section key={adapter.name} className="border border-slate-700 bg-slate-900 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{adapter.name}</h2>
                <p className="mt-2 text-sm text-slate-400">
                  {adapter.requiredEnv ? `依赖环境变量：${adapter.requiredEnv}` : "无需外部凭证"}
                </p>
              </div>
              <span
                className={
                  adapter.ready
                    ? "border border-emerald-400/40 px-3 py-1 text-sm text-emerald-200"
                    : "border border-amber-400/40 px-3 py-1 text-sm text-amber-200"
                }
              >
                {adapter.ready ? "ready" : "mock"}
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="border border-slate-700 p-3">
                <dt className="text-slate-500">模式</dt>
                <dd className="mt-1 font-semibold">{adapter.mode}</dd>
              </div>
              <div className="border border-slate-700 p-3">
                <dt className="text-slate-500">可用</dt>
                <dd className="mt-1 font-semibold">{adapter.ready ? "是" : "否"}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}
