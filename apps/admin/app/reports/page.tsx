import Link from "next/link";

const sampleReports = [
  {
    chain: "base",
    address: "0x1111111111111111111111111111111111111110",
    label: "禁买",
    reason: "mock 卖出仿真失败",
  },
  {
    chain: "base",
    address: "0x2222222222222222222222222222222222222223",
    label: "高危",
    reason: "mock owner 权限偏高",
  },
];

export default function AdminReportsPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <nav className="flex items-center justify-between text-sm text-slate-400">
        <Link href="/" className="font-semibold text-white">
          ChainVigil Admin
        </Link>
        <span>Token 报告查询 skeleton</span>
      </nav>

      <section className="mt-10">
        <h1 className="text-3xl font-semibold">Token 报告查询</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          V0 后台先展示只读查询结构。后续接入数据库后，这里会支持风险标签人工修正、误报记录和操作审计。
        </p>
      </section>

      <section className="mt-8 border border-slate-700 bg-slate-900 p-4">
        <label className="text-sm text-slate-300" htmlFor="token-query">
          CA / Chain / Symbol
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="token-query"
            placeholder="0x..."
            className="min-h-11 flex-1 border border-slate-700 bg-slate-950 px-3 text-white outline-none"
          />
          <button className="min-h-11 bg-emerald-300 px-5 font-semibold text-emerald-950">
            查询
          </button>
        </div>
      </section>

      <section className="mt-6 overflow-hidden border border-slate-700">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3">Chain</th>
              <th className="p-3">Address</th>
              <th className="p-3">风险</th>
              <th className="p-3">原因</th>
              <th className="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {sampleReports.map((report) => (
              <tr key={report.address} className="border-t border-slate-800">
                <td className="p-3 text-slate-300">{report.chain}</td>
                <td className="p-3 font-mono text-slate-300">{report.address}</td>
                <td className="p-3 text-emerald-200">{report.label}</td>
                <td className="p-3 text-slate-400">{report.reason}</td>
                <td className="p-3">
                  <a
                    className="text-emerald-200"
                    href={`http://localhost:3000/token/${report.chain}/${report.address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看报告
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
