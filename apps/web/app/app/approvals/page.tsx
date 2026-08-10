import Link from "next/link";
import { buildMockWalletHealthReport } from "@chainvigil/risk-core";
import { getServerLocale } from "../../i18n/server";
import { CopyValueButton } from "../../ui/copy-value-button";
import { ProviderCoverage } from "../../ui/provider-coverage";
import { WorkspaceHeader } from "../../ui/workspace-header";
import { WorkspaceMobileNav } from "../../ui/workspace-mobile-nav";

const riskTone = {
  HIGH: "border-[#ffb4ab]/45 text-[#ffb4ab]",
  MEDIUM: "border-[#ffc775]/45 text-[#ffc775]",
  LOW: "border-[#9de32e]/45 text-[#9de32e]",
  UNKNOWN: "border-[#849396]/45 text-[#bac9cc]",
} as const;

export default async function WorkspaceApprovalsPage({
  searchParams,
}: {
  searchParams?: Promise<{ state?: string }>;
}) {
  const locale = await getServerLocale();
  const isZh = locale === "zh";
  const { state } = (await searchParams) ?? {};
  const baseReport = buildMockWalletHealthReport({
    address: "0x1111111111111111111111111111111111111110",
    locale,
  });
  const report =
    state === "empty" ? { ...baseReport, approvals: [] } : baseReport;
  const shortAddress = `${report.address.slice(0, 8)}...${report.address.slice(-6)}`;
  const hasApprovals = report.approvals.length > 0;

  return (
    <main className="cv-workspace-page min-h-screen pb-24 text-[#dce4e5] md:pb-10">
      <WorkspaceHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <p className="cv-font-mono text-[10px] uppercase tracking-[0.12em] text-[#00e5ff]">
              WORKSPACE APPROVAL REVIEW · MOCK WATCHLIST
            </p>
            <h1 className="mt-3 cv-font-display text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
              {isZh ? "授权复查工作台" : "Approval review workspace"}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#9dacad] md:text-base">
              {isZh
                ? "面向持续管理的公开地址观察视图。当前仅展示样例授权证据，不连接钱包、不签名、不自动撤销。"
                : "A public-address watch view for ongoing review. It shows sample approval evidence only—no wallet connection, signing, or automatic revocation."}
            </p>
          </div>
          <div className="border border-[#3b494c]/70 bg-[#0d1516] p-4">
            <p className="cv-font-mono text-[9px] uppercase text-[#849396]">
              WATCHED ADDRESS · SAMPLE
            </p>
            <div className="mt-2 flex min-w-0 items-center gap-2">
              <span className="min-w-0 flex-1 truncate cv-font-mono text-sm">
                {shortAddress}
              </span>
              <CopyValueButton
                value={report.address}
                label={isZh ? "复制" : "Copy"}
                className="border-[#3b494c] text-[#c3f5ff]"
              />
            </div>
          </div>
        </header>

        <div className="mt-7">
          <ProviderCoverage mode="mock" chain="bnb" variant="strip" />
        </div>

        {hasApprovals ? (
          <section className="mt-7 grid gap-4 lg:grid-cols-3">
            {report.approvals.map((approval) => (
              <article
                key={approval.id}
                className="min-w-0 border border-[#3b494c]/70 bg-[#0d1516]/90 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="cv-font-mono text-[9px] uppercase text-[#849396]">
                      {approval.assetType}
                    </p>
                    <h2 className="mt-1 cv-font-display text-xl font-semibold">
                      {approval.assetSymbol}
                    </h2>
                  </div>
                  <span
                    className={`border px-2 py-1 cv-font-mono text-[9px] font-semibold ${riskTone[approval.riskLevel]}`}
                  >
                    {approval.riskLevel}
                  </span>
                </div>
                <div className="mt-4 border border-[#3b494c]/45 bg-[#071012] p-3">
                  <p className="cv-font-mono text-[9px] uppercase text-[#849396]">
                    SPENDER · SAMPLE
                  </p>
                  <p className="mt-2 font-semibold">{approval.spenderLabel}</p>
                  <p className="mt-1 truncate cv-font-mono text-xs text-[#9dacad]">
                    {approval.spenderAddress}
                  </p>
                </div>
                <dl className="mt-3 grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 text-xs">
                  <div className="border border-[#3b494c]/40 p-3">
                    <dt className="cv-font-mono text-[9px] uppercase text-[#849396]">
                      ALLOWANCE
                    </dt>
                    <dd className="mt-1">{approval.allowanceLabel}</dd>
                  </div>
                  <div className="border border-[#3b494c]/40 p-3">
                    <dt className="cv-font-mono text-[9px] uppercase text-[#849396]">
                      EVIDENCE
                    </dt>
                    <dd className="mt-1 text-[#ffc775]">UNVERIFIED</dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm leading-6 text-[#9dacad]">
                  {approval.recommendedAction}
                </p>
                <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
                  <CopyValueButton
                    value={approval.spenderAddress}
                    label={isZh ? "复制 Spender" : "Copy spender"}
                    className="flex min-h-11 min-w-0 items-center justify-center border-[#3b494c] text-[#c3f5ff]"
                  />
                  <Link
                    href="/app/approval-cleaner"
                    className="flex min-h-11 min-w-0 items-center justify-center border border-[#3b494c] px-2 text-center cv-font-mono text-[9px] uppercase text-[#dce4e5] sm:px-3 sm:text-[10px]"
                  >
                    {isZh ? "处理边界" : "Safety policy"}
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section
            role="status"
            className="mt-7 border border-[#3b494c]/70 bg-[#0d1516]/90 p-6 md:p-8"
          >
            <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">
              {isZh
                ? "观察地址暂无授权证据"
                : "No approval evidence for this watched address"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9dacad]">
              {isZh
                ? "空结果不等于零风险。请先核对 Provider Coverage，并在数据源恢复后重新检查。"
                : "An empty result is not a zero-risk result. Review Provider Coverage and check again after the required sources recover."}
            </p>
            <Link
              href="/app/wallets"
              className="mt-5 inline-flex min-h-11 items-center border border-[#3b494c] px-4 cv-font-mono text-xs uppercase text-[#c3f5ff]"
            >
              {isZh ? "返回钱包中心" : "Return to wallet center"}
            </Link>
          </section>
        )}

        <aside className="mt-7 border border-[#ffc775]/30 bg-[#ffc775]/7 p-5 text-sm leading-7 text-[#ffddb1]">
          {isZh
            ? "当前列表是 Mock watchlist，不代表真实钱包状态。生产 Provider 未完成前，不显示检查时间、来源成功率、风险总分或可执行撤销按钮。"
            : "This is a mock watchlist, not a real wallet state. Until production providers run, the workspace shows no scan time, provider success rate, aggregate score, or executable revoke action."}
        </aside>
      </section>
      <WorkspaceMobileNav />
    </main>
  );
}
