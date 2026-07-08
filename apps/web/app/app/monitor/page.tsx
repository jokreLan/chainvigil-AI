import { listMockRiskMonitorRules } from "@chainvigil/risk-core";

export default function MonitorPage() {
  const monitors = listMockRiskMonitorRules();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">风险监控</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        监控用于提醒风险变化，不做自动交易拦截，不替用户执行资产操作。
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {monitors.map((monitor) => (
          <article key={monitor.id} className="border border-emerald-300/14 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{monitor.title}</h2>
              <span className="text-sm text-emerald-200">{monitor.status}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-emerald-100/68">
              <span>{monitor.targetType}</span>
              <span>{monitor.severity}</span>
              <span>{monitor.cadenceLabel}</span>
            </div>
            <p className="mt-4 leading-7 text-emerald-50/70">{monitor.explanation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {monitor.signals.map((signal) => (
                <span key={signal} className="border border-emerald-300/20 px-2 py-1 text-xs text-emerald-100/70">
                  {signal}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
