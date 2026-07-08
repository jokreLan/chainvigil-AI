import Link from "next/link";

const modules = [
  { title: "Token 报告查询", href: "/reports" },
  { title: "高危 CA 审核", href: "/risk-review" },
  { title: "风险标签人工修正", href: "/risk-labels" },
  { title: "数据源状态", href: "/data-sources" },
  { title: "系统就绪状态", href: "/system-readiness" },
  { title: "后台审计日志", href: "/audit" },
  { title: "哨点 VP 事件审核", href: "/points" },
  { title: "Telegram 群组管理", href: "/telegram" },
  { title: "KOL 渠道管理", href: "/channels" },
];

export default function AdminHomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">ChainVigil AI Admin skeleton</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        V0 先提供后台信息架构骨架。后续所有人工修正必须记录操作人、对象和理由。
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {modules.map((module) => (
          <section key={module.title} className="border border-slate-700 bg-slate-900 p-4">
            <h2 className="font-semibold">{module.title}</h2>
            <p className="mt-2 text-sm text-slate-400">待接入权限、审计日志和数据表。</p>
            {module.href ? (
              <Link href={module.href} className="mt-4 inline-block text-sm text-emerald-200">
                打开
              </Link>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
