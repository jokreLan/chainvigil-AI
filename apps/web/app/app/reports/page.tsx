import Link from "next/link";
import { listMockTokenReportIndex } from "@chainvigil/risk-core";

export default function AppReportsPage() {
  const reports = listMockTokenReportIndex();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">报告历史</h1>
      <p className="mt-4 text-emerald-50/72">
        V0 复用只读 mock 报告索引，后续接入账户、分页检索和数据库落库。
      </p>
      <div className="mt-8 space-y-4">
        {reports.map((report) => (
          <Link key={report.id} href={report.reportUrl} className="block border border-emerald-300/14 bg-black/20 p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-200/70">
              <span>CA 安检</span>
              <span>{report.chain}</span>
              <span>{report.source}</span>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {report.tokenName} · {report.tokenSymbol}
            </h2>
            <p className="mt-2 text-emerald-50/70">
              {report.label} · 风险分 {report.score}
            </p>
            <p className="mt-3 leading-7 text-emerald-50/68">{report.summary}</p>
            <p className="mt-3 break-all text-sm text-emerald-100/55">{report.tokenAddress}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
