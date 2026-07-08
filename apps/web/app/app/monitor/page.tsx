const monitors = ["高危 token 复查", "授权变更提醒", "部署者画像变化", "LP 撤出风险"];

export default function MonitorPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">风险监控</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        监控用于提醒风险变化，不做自动交易拦截，不替用户执行资产操作。
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {monitors.map((monitor) => (
          <article key={monitor} className="border border-emerald-300/14 bg-black/20 p-5 text-white">
            {monitor}
          </article>
        ))}
      </section>
    </main>
  );
}
