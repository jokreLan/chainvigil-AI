import Link from "next/link";
import { getSystemReadiness } from "@chainvigil/config";
import { listRegisteredLiveProviderClients } from "@chainvigil/data-adapters";

const modules = [
  {
    title: "系统就绪 / 上线清单",
    href: "/system-readiness",
    note: "代码侧 done + 周末外部依赖清单",
    priority: true,
  },
  { title: "数据源状态", href: "/data-sources", note: "Provider readiness，不含密钥" },
  { title: "Token 报告索引", href: "/reports", note: "只读 mock 报告目录" },
  { title: "高危 CA 审核", href: "/risk-review", note: "人工复核队列 skeleton" },
  { title: "风险标签", href: "/risk-labels", note: "标签目录，写入待权限" },
  { title: "后台审计日志", href: "/audit", note: "脱敏 metadata 只读" },
  { title: "哨点 VP", href: "/points", note: "第二曲线账本审核入口" },
  { title: "Telegram 群组", href: "/telegram", note: "群配置与命令 contract" },
  { title: "KOL 渠道", href: "/channels", note: "增长归因只读" },
];

export default function AdminHomePage() {
  const readiness = getSystemReadiness();
  const liveClients = listRegisteredLiveProviderClients().length;

  return (
    <main className="min-h-screen px-5 py-8 md:px-8 md:py-10">
      <p className="text-sm font-semibold text-[#c0c1ff]">CONTROL ROOM</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">ChainVigil AI Admin</h1>
      <p className="mt-3 max-w-2xl text-[#c7c4d7]">
        控制台聚焦上线与运营只读视图。人工修正必须记录操作人、对象和理由；生产写操作仍关闭。
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#262932] bg-[#16181d] p-4">
          <p className="text-xs text-[#8f8b9e]">当前运行模式</p>
          <p className="mt-2 text-xl font-semibold text-white">{readiness.current.mode}</p>
        </div>
        <div className="rounded-lg border border-[#262932] bg-[#16181d] p-4">
          <p className="text-xs text-[#8f8b9e]">生产安全预检</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {readiness.productionSecurity.ok ? "ready" : "needs review"}
          </p>
        </div>
        <div className="rounded-lg border border-[#262932] bg-[#16181d] p-4">
          <p className="text-xs text-[#8f8b9e]">Live clients</p>
          <p className="mt-2 text-xl font-semibold text-white">{liveClients}</p>
        </div>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {modules.map((module) => (
          <section
            key={module.title}
            className={`rounded-lg border bg-[#16181d] p-5 ${
              module.priority ? "border-[#8083ff]/45" : "border-[#262932]"
            }`}
          >
            <h2 className="font-semibold text-white">{module.title}</h2>
            <p className="mt-2 text-sm text-[#8f8b9e]">{module.note}</p>
            <Link
              href={module.href}
              className="mt-4 inline-block text-sm font-semibold text-[#c0c1ff] hover:text-white"
            >
              打开
            </Link>
          </section>
        ))}
      </div>
    </main>
  );
}
