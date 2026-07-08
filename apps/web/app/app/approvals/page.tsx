import { buildMockWalletHealthReport } from "@chainvigil/risk-core";

export default function ApprovalsPage() {
  const report = buildMockWalletHealthReport({
    address: "0x1111111111111111111111111111111111111110",
  });

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">授权扫描</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        V0 展示 mock 授权风险结构。正式撤销前必须显示 spender、资产、额度、gas 和二次确认。
      </p>
      <div className="mt-8 space-y-4">
        {report.approvals.map((approval) => (
          <article key={approval.id} className="border border-emerald-300/14 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{approval.spenderLabel}</h2>
              <span className="text-emerald-200">{approval.riskLevel}</span>
            </div>
            <p className="mt-3 break-all text-sm text-emerald-50/60">{approval.spenderAddress}</p>
            <p className="mt-3 text-emerald-50/72">
              {approval.assetSymbol} / {approval.allowanceLabel}
            </p>
            <button className="mt-4 min-h-10 border border-emerald-300/30 px-4 text-sm text-emerald-100">
              查看撤销说明
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
