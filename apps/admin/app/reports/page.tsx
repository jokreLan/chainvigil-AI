import { listMockTokenReportIndex } from "@chainvigil/risk-core";

export default function AdminReportsPage() {
  const reports = listMockTokenReportIndex();

  return (
    <main className="min-h-screen px-5 py-8 md:px-8 md:py-10">
      <p className="text-sm font-semibold text-[#c0c1ff]">REPORT INDEX</p>
      <section className="mt-2">
        <h1 className="text-3xl font-semibold text-white">Token 报告查询</h1>
        <p className="mt-3 max-w-2xl text-[#c7c4d7]">
          V0 后台先展示只读查询结构。后续接入数据库后，这里会支持风险标签人工修正、误报记录和操作审计。
        </p>
      </section>

      <section className="mt-8 rounded-lg border border-[#262932] bg-[#16181d] p-4 text-sm text-[#c7c4d7]">
        V0 展示固定 mock 报告索引。生产查询与人工修正会在数据库、权限和审计链路就绪后开放。
      </section>

      <section className="mt-6 overflow-x-auto rounded-lg border border-[#262932] bg-[#16181d]">
        <table className="min-w-[52rem] w-full border-collapse text-left text-sm">
          <thead className="bg-[#1d2027] text-[#e4e1ed]">
            <tr>
              <th className="p-3">Chain</th>
              <th className="p-3">Token</th>
              <th className="p-3">Address</th>
              <th className="p-3">风险</th>
              <th className="p-3">原因</th>
              <th className="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t border-[#262932]">
                <td className="p-3 text-[#c7c4d7]">{report.chain}</td>
                <td className="p-3 text-[#c7c4d7]">
                  {report.tokenSymbol} / {report.tokenName}
                </td>
                <td className="p-3 font-mono text-[#c7c4d7]">{report.tokenAddress}</td>
                <td className="p-3 text-[#c0c1ff]">{report.label}</td>
                <td className="p-3 text-[#8f8b9e]">{report.summary}</td>
                <td className="p-3">
                  <a
                    className="text-[#c0c1ff] hover:text-white"
                    href={report.reportUrl}
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
