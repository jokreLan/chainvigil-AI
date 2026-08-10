import { listMockTokenReportIndex } from "@chainvigil/risk-core";

export const metadata = { title: "Token 报告索引" };

export default function AdminReportsPage() {
  const reports = listMockTokenReportIndex();

  return (
    <main className="admin-page min-h-screen">
      <p className="admin-kicker">REPORT INDEX · MOCK / READ-ONLY</p>
      <section className="mt-2">
        <h1 className="admin-title">Token 报告查询</h1>
        <p className="admin-lead">
          V0
          后台先展示只读查询结构。后续接入数据库后，这里会支持风险标签人工修正、误报记录和操作审计。
        </p>
      </section>

      <section className="admin-panel mt-8 p-4 text-sm text-[#c7c4d7]">
        V0 展示固定 mock
        报告索引。生产查询与人工修正会在数据库、权限和审计链路就绪后开放。
      </section>

      <section className="admin-panel admin-scroll mt-6">
        <table className="min-w-[52rem] w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Mock Token 风险报告索引；当前仅供内部只读核对
          </caption>
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
                <td className="p-3 font-mono text-[#c7c4d7]">
                  {report.tokenAddress}
                </td>
                <td className="p-3 text-[#c0c1ff]">{report.label}</td>
                <td className="p-3 text-[#8f8b9e]">{report.summary}</td>
                <td className="p-3">
                  <a
                    className="admin-action text-[#c0c1ff] hover:text-white"
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
