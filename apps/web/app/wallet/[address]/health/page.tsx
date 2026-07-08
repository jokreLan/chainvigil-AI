import type { Metadata } from "next";
import Link from "next/link";
import { buildMockWalletHealthReport } from "@chainvigil/risk-core";

interface WalletHealthPageProps {
  params: Promise<{
    address: string;
  }>;
}

export async function generateMetadata({ params }: WalletHealthPageProps): Promise<Metadata> {
  const { address } = await params;
  const report = buildMockWalletHealthReport({ address });

  return {
    title: `钱包健康报告｜${report.summary.label}｜ChainVigil AI`,
    description: `钱包健康分 ${report.summary.score}，高危授权 ${report.summary.highRiskApprovals} 个。只读检测，不构成投资建议。`,
  };
}

export default async function WalletHealthPage({ params }: WalletHealthPageProps) {
  const { address } = await params;
  const report = buildMockWalletHealthReport({ address });

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/wallet-check">重新体检</Link>
      </nav>

      <section className="mt-12 grid gap-8 lg:grid-cols-[22rem_1fr]">
        <aside className="h-fit border border-emerald-300/16 bg-black/24 p-5">
          <p className="text-sm text-emerald-200/70">钱包健康分</p>
          <p className="mt-3 text-6xl font-semibold text-white">{report.summary.score}</p>
          <p className="mt-3 text-xl text-emerald-100">{report.summary.label}</p>
          <p className="mt-5 break-all text-sm leading-6 text-emerald-50/60">{report.address}</p>
          <p className="mt-6 border-t border-emerald-300/12 pt-5 text-xs leading-5 text-emerald-100/55">
            {report.disclaimer}
          </p>
        </aside>

        <div>
          <h1 className="text-4xl font-semibold text-white">钱包体检报告</h1>
          <p className="mt-4 text-emerald-50/72">
            检测时间：{new Date(report.checkedAt).toLocaleString("zh-CN")}
          </p>

          <section className="mt-8 grid gap-3 sm:grid-cols-5">
            <Metric label="高危授权" value={String(report.summary.highRiskApprovals)} />
            <Metric label="无限授权" value={String(report.summary.infiniteApprovals)} />
            <Metric label="可疑 Token" value={String(report.summary.suspiciousTokens)} />
            <Metric label="Spam NFT" value={String(report.summary.spamNfts)} />
            <Metric label="粉尘估值" value={`$${report.summary.dustValueUsd}`} />
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">授权风险</h2>
            <div className="mt-4 space-y-4">
              {report.approvals.map((approval) => (
                <article key={approval.id} className="border border-emerald-300/14 bg-black/20 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-emerald-200/70">
                        {approval.assetSymbol} / {approval.assetType}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {approval.spenderLabel}
                      </h3>
                    </div>
                    <span className="border border-emerald-300/20 px-3 py-1 text-sm text-emerald-100">
                      {approval.riskLevel}
                    </span>
                  </div>
                  <p className="mt-3 break-all text-sm text-emerald-50/60">
                    {approval.spenderAddress}
                  </p>
                  <p className="mt-3 text-emerald-50/72">{approval.recommendedAction}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {approval.riskReasons.map((reason) => (
                      <span key={reason} className="bg-white/8 px-3 py-1 text-xs text-emerald-100/80">
                        {reason}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-emerald-300/14 bg-black/18 p-4">
      <p className="text-xs text-emerald-200/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
