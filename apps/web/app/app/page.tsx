import Link from "next/link";

const modules = [
  { title: "我的钱包", href: "/app/wallets", desc: "管理只读体检地址和未来连接钱包列表。" },
  { title: "授权扫描", href: "/app/approvals", desc: "查看 ERC20/NFT 授权和 spender 风险。" },
  { title: "授权清理", href: "/app/approval-cleaner", desc: "执行前必须二次确认的撤销流程。" },
  { title: "资产理发师", href: "/app/asset-barber", desc: "识别粉尘、垃圾资产和禁止处理资产。" },
  { title: "粉尘扫描", href: "/app/dust", desc: "估算可回收价值，不自动 swap 或 bridge。" },
  { title: "风险监控", href: "/app/monitor", desc: "跟踪高危 token、授权和 LP 变化。" },
  { title: "哨点 VP", href: "/app/points", desc: "查看产品使用、安全贡献和推广规则。" },
  { title: "推广中心", href: "/app/growth", desc: "管理报告分享和渠道归因。" },
  { title: "报告历史", href: "/app/reports", desc: "集中查看 CA 安检和钱包体检报告。" },
  { title: "设置", href: "/app/settings", desc: "配置语言、隐私和提醒阈值。" },
];

export default function AppDashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">ChainVigil App 控制台</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        V0 控制台先建立信息架构和入口。执行类能力必须等用户明确连接钱包并确认每一步后再开放。
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <Link key={module.href} href={module.href} className="border border-emerald-300/14 bg-black/20 p-5">
            <h2 className="text-xl font-semibold text-white">{module.title}</h2>
            <p className="mt-3 leading-7 text-emerald-50/70">{module.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
