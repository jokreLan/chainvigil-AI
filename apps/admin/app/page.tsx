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
    <main className="min-h-screen px-5 py-8 md:px-8 md:py-10">
      <p className="text-sm font-semibold text-[#c0c1ff]">CONTROL ROOM</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">ChainVigil AI Admin</h1>
      <p className="mt-3 max-w-2xl text-[#c7c4d7]">
        V0 先提供后台信息架构骨架。后续所有人工修正必须记录操作人、对象和理由。
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {modules.map((module) => (
          <section key={module.title} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
            <h2 className="font-semibold">{module.title}</h2>
            <p className="mt-2 text-sm text-[#8f8b9e]">待接入权限、审计日志和数据表。</p>
            {module.href ? (
              <Link href={module.href} className="mt-4 inline-block text-sm font-semibold text-[#c0c1ff] hover:text-white">
                打开
              </Link>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
