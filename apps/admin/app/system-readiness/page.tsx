import { getCacheHealth } from "@chainvigil/cache";
import { getSystemReadiness } from "@chainvigil/config";
import { getAdapterHealth, listRegisteredLiveProviderClients } from "@chainvigil/data-adapters";
import { getWorkerHealth } from "@chainvigil/worker";

const labelByMode = {
  mock: "V0 mock",
  production: "生产",
} as const;

const launchCodeChecklist = [
  { id: "fail-closed", label: "API/Bot production fail-closed", done: true },
  { id: "admin-auth", label: "Admin + /api/v1/admin 鉴权", done: true },
  { id: "cors", label: "CORS 白名单", done: true },
  { id: "webhook", label: "Telegram webhook secret 钩子", done: true },
  { id: "write-secret", label: "INTERNAL_WRITE_SECRET 写保护", done: true },
  { id: "mode", label: "报告 mode / confidence 契约", done: true },
  { id: "rate-limit", label: "限流 + trustProxy", done: true },
  { id: "bot-api", label: "Bot → API 优先降级", done: true },
  { id: "vp-catalog", label: "VP 权益目录", done: true },
  { id: "live-registry", label: "live provider 注册点", done: true },
] as const;

const launchWeekendChecklist = [
  "填 .env.production（HTTPS URL + 强密钥）",
  "注册 GoPlus / Honeypot / RPC live client",
  "Telegram 正式 webhook + secret",
  "Postgres / Redis 生产实例",
  "反代 TRUST_PROXY 与 CORS 域名",
  "对生产域名跑 smoke:v0 + readiness",
] as const;

export default function SystemReadinessPage() {
  const readiness = getSystemReadiness();
  const adapters = getAdapterHealth();
  const cache = getCacheHealth();
  const worker = getWorkerHealth();
  const rows = [readiness.current, readiness.mock, readiness.production];
  const enabledWorkerJobs = worker.jobs.filter((job) => job.enabled).length;
  const liveClients = listRegisteredLiveProviderClients().length;
  const codeDone = launchCodeChecklist.filter((item) => item.done).length;

  return (
    <main className="min-h-screen px-5 py-8 md:px-8 md:py-10">
      <p className="text-sm font-semibold text-[#c0c1ff]">SYSTEM READINESS · LAUNCH</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">系统就绪状态</h1>
      <p className="mt-3 max-w-2xl text-[#c7c4d7]">
        只展示缺失配置名与依赖状态，不展示密钥。代码侧上线项与周末外部依赖项分开追踪。
      </p>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-[#8083ff]/40 bg-[#16181d] p-5">
          <p className="text-xs font-semibold text-[#c0c1ff]">代码上线就绪</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {codeDone}/{launchCodeChecklist.length}
          </p>
          <p className="mt-2 text-sm text-[#8f8b9e]">无外部 key 可完成的契约</p>
        </article>
        <article className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
          <p className="text-xs font-semibold text-[#eab308]">Live clients 已注册</p>
          <p className="mt-3 text-3xl font-semibold text-white">{liveClients}</p>
          <p className="mt-2 text-sm text-[#8f8b9e]">周末接 provider 后应 &gt; 0</p>
        </article>
        <article className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
          <p className="text-xs font-semibold text-[#fde68a]">生产安全预检</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {readiness.productionSecurity.ok ? "OK" : "待补"}
          </p>
          <p className="mt-2 text-sm text-[#8f8b9e]">
            {readiness.productionSecurity.warnings.length} 项警告（仅名称）
          </p>
        </article>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {rows.map((row) => (
          <section key={row.mode} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">{labelByMode[row.mode]}</h2>
              <span
                className={
                  row.ok
                    ? "rounded border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200"
                    : "rounded border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-sm text-amber-200"
                }
              >
                {row.ok ? "ready" : "missing"}
              </span>
            </div>
            <p className="mt-4 text-sm text-[#8f8b9e]">
              {row.missing.length === 0 ? "配置已满足当前模式。" : `缺少 ${row.missing.length} 项配置。`}
            </p>
            {row.missing.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm text-[#c7c4d7]">
                {row.missing.map((name) => (
                  <li key={name} className="rounded border border-[#363944] px-3 py-2">
                    {name}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-[#262932] bg-[#16181d] p-5">
        <h2 className="text-xl font-semibold text-white">上线清单 · 代码侧</h2>
        <p className="mt-2 text-sm text-[#8f8b9e]">对应 docs/ops/launch_checklist.md A–C 段。</p>
        <ul className="mt-5 grid gap-2 md:grid-cols-2">
          {launchCodeChecklist.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded border border-[#363944] px-3 py-2 text-sm"
            >
              <span className="text-[#c7c4d7]">{item.label}</span>
              <span className="text-emerald-300">{item.done ? "done" : "todo"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-lg border border-[#eab308]/25 bg-[#16181d] p-5">
        <h2 className="text-xl font-semibold text-white">上线清单 · 周末外部依赖</h2>
        <p className="mt-2 text-sm text-[#8f8b9e]">密钥与 RPC 由负责人统一接入，本页不展示任何密钥值。</p>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-[#c7c4d7]">
          {launchWeekendChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-lg border border-[#262932] bg-[#16181d] p-5">
        <h2 className="text-xl font-semibold text-white">依赖摘要</h2>
        <dl className="mt-5 grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded border border-[#363944] p-3">
            <dt className="text-[#8f8b9e]">Cache</dt>
            <dd className="mt-1 font-semibold">
              {cache.name} / {cache.mode}
            </dd>
          </div>
          <div className="rounded border border-[#363944] p-3">
            <dt className="text-[#8f8b9e]">Adapter 数量</dt>
            <dd className="mt-1 font-semibold">{adapters.length}</dd>
          </div>
          <div className="rounded border border-[#363944] p-3">
            <dt className="text-[#8f8b9e]">Live-ready（env 已配）</dt>
            <dd className="mt-1 font-semibold">{adapters.filter((adapter) => adapter.ready).length}</dd>
          </div>
          <div className="rounded border border-[#363944] p-3">
            <dt className="text-[#8f8b9e]">Worker jobs</dt>
            <dd className="mt-1 font-semibold">
              {enabledWorkerJobs} / {worker.jobs.length} enabled
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 rounded-lg border border-[#262932] bg-[#16181d] p-5">
        <h2 className="text-xl font-semibold text-white">Worker 任务 contract</h2>
        <p className="mt-3 text-sm text-[#8f8b9e]">
          V0 只声明后台任务，不启用真实队列消费；后续接 Redis-backed queue 时复用 job 名称。
        </p>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {worker.jobs.map((job) => (
            <article key={job.name} className="rounded border border-[#363944] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-white">{job.name}</h3>
                <span className="rounded border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-xs text-amber-200">
                  {job.enabled ? "enabled" : "mock"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#8f8b9e]">{job.description}</p>
              <p className="mt-3 text-sm text-[#8f8b9e]">Cadence {job.cadenceSeconds}s</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-[#262932] bg-[#16181d] p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">生产安全预检</h2>
          <span
            className={
              readiness.productionSecurity.ok
                ? "rounded border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200"
                : "rounded border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-sm text-amber-200"
            }
          >
            {readiness.productionSecurity.ok ? "ready" : "needs review"}
          </span>
        </div>
        <p className="mt-3 text-sm text-[#8f8b9e]">只展示需要复核的配置名称，不展示真实密钥值。</p>
        {readiness.productionSecurity.warnings.length > 0 ? (
          <ul className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            {readiness.productionSecurity.warnings.map((warning) => (
              <li key={warning.name} className="rounded border border-[#363944] p-3">
                <p className="font-semibold text-white">{warning.name}</p>
                <p className="mt-1 text-[#8f8b9e]">{warning.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
            生产安全预检未发现占位密钥或非 HTTPS 公开地址。
          </p>
        )}
      </section>
    </main>
  );
}
