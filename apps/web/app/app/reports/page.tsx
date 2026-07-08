import Link from "next/link";

const reports = [
  {
    title: "Mock Vigil Token",
    href: "/token/base/0x1111111111111111111111111111111111111110",
    type: "CA 安检",
    status: "禁买",
  },
  {
    title: "示例钱包",
    href: "/wallet/0x1111111111111111111111111111111111111110/health",
    type: "钱包体检",
    status: "需要关注",
  },
];

export default function AppReportsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">报告历史</h1>
      <p className="mt-4 text-emerald-50/72">V0 先展示报告历史信息架构，后续接入账户和数据库。</p>
      <div className="mt-8 space-y-4">
        {reports.map((report) => (
          <Link key={report.href} href={report.href} className="block border border-emerald-300/14 bg-black/20 p-5">
            <p className="text-sm text-emerald-200/70">{report.type}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{report.title}</h2>
            <p className="mt-2 text-emerald-50/70">{report.status}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
