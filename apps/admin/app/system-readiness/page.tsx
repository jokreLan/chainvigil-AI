import { getCacheHealth } from "@chainvigil/cache";
import { getSystemReadiness } from "@chainvigil/config";
import { getAdapterHealth } from "@chainvigil/data-adapters";

const labelByMode = {
  mock: "V0 mock",
  production: "生产",
} as const;

export default function SystemReadinessPage() {
  const readiness = getSystemReadiness();
  const adapters = getAdapterHealth();
  const cache = getCacheHealth();
  const rows = [readiness.current, readiness.mock, readiness.production];

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">系统就绪状态</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        这里只展示缺失的配置名称和依赖状态，不展示任何密钥、连接串或 Bot token。
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {rows.map((row) => (
          <section key={row.mode} className="border border-slate-700 bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">{labelByMode[row.mode]}</h2>
              <span
                className={
                  row.ok
                    ? "border border-emerald-400/40 px-3 py-1 text-sm text-emerald-200"
                    : "border border-amber-400/40 px-3 py-1 text-sm text-amber-200"
                }
              >
                {row.ok ? "ready" : "missing"}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              {row.missing.length === 0 ? "配置已满足当前模式。" : `缺少 ${row.missing.length} 项配置。`}
            </p>
            {row.missing.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {row.missing.map((name) => (
                  <li key={name} className="border border-slate-700 px-3 py-2">
                    {name}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <section className="mt-8 border border-slate-700 bg-slate-900 p-5">
        <h2 className="text-xl font-semibold">依赖摘要</h2>
        <dl className="mt-5 grid gap-3 text-sm md:grid-cols-3">
          <div className="border border-slate-700 p-3">
            <dt className="text-slate-500">Cache</dt>
            <dd className="mt-1 font-semibold">
              {cache.name} / {cache.mode}
            </dd>
          </div>
          <div className="border border-slate-700 p-3">
            <dt className="text-slate-500">Adapter 数量</dt>
            <dd className="mt-1 font-semibold">{adapters.length}</dd>
          </div>
          <div className="border border-slate-700 p-3">
            <dt className="text-slate-500">Live-ready</dt>
            <dd className="mt-1 font-semibold">{adapters.filter((adapter) => adapter.ready).length}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 border border-slate-700 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">生产安全预检</h2>
          <span
            className={
              readiness.productionSecurity.ok
                ? "border border-emerald-400/40 px-3 py-1 text-sm text-emerald-200"
                : "border border-amber-400/40 px-3 py-1 text-sm text-amber-200"
            }
          >
            {readiness.productionSecurity.ok ? "ready" : "needs review"}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          这里只展示需要复核的配置名称，不展示真实密钥值。
        </p>
        {readiness.productionSecurity.warnings.length > 0 ? (
          <ul className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            {readiness.productionSecurity.warnings.map((warning) => (
              <li key={warning.name} className="border border-slate-700 p-3">
                <p className="font-semibold text-slate-100">{warning.name}</p>
                <p className="mt-1 text-slate-400">{warning.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 border border-emerald-400/30 px-3 py-2 text-sm text-emerald-200">
            生产安全预检未发现占位密钥或非 HTTPS 公开地址。
          </p>
        )}
      </section>
    </main>
  );
}
