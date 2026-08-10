import type { Metadata } from "next";
import Link from "next/link";
import { buildMockWalletHealthReport } from "@chainvigil/risk-core";
import type { ApprovalRiskLevel } from "@chainvigil/types";
import { getServerT } from "../../../i18n/server";
import { ConsumerMobileNav } from "../../../ui/consumer-mobile-nav";
import { CopyValueButton } from "../../../ui/copy-value-button";
import { DappHeader } from "../../../ui/dapp-header";
import { DappIcon } from "../../../ui/dapp-icon";
import { ProviderCoverage } from "../../../ui/provider-coverage";
import { VigilCore } from "../../../ui/vigil-core";

interface WalletHealthPageProps {
  params: Promise<{ address: string }>;
}

const approvalRiskStyles: Record<ApprovalRiskLevel, string> = {
  HIGH: "border-[#ffb4ab]/45 text-[#ffb4ab]",
  MEDIUM: "border-[#ffc775]/45 text-[#ffc775]",
  LOW: "border-[#9de32e]/45 text-[#9de32e]",
  UNKNOWN: "border-[#849396]/45 text-[#bac9cc]",
};

export async function generateMetadata({
  params,
}: WalletHealthPageProps): Promise<Metadata> {
  const { address } = await params;
  const { locale } = await getServerT();
  const report = buildMockWalletHealthReport({ address, locale });
  return {
    title: `Wallet health｜${report.summary.label}｜ChainVigil`,
    description: `Read-only wallet check (${report.mode}). Not investment advice.`,
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}

export default async function WalletHealthPage({
  params,
}: WalletHealthPageProps) {
  const { address } = await params;
  const { t, locale } = await getServerT();
  const isZh = locale === "zh";
  const report = buildMockWalletHealthReport({ address, locale });
  const shortAddress =
    report.address.length > 14
      ? `${report.address.slice(0, 8)}...${report.address.slice(-6)}`
      : report.address;

  const groups = [
    {
      title: t("walletReport.groupSuspicious"),
      body: isZh
        ? "SAMPLE · 仅展示可疑信号，不展示虚构数量"
        : "SAMPLE · suspicious signals only; no fabricated counts",
      icon: "alert" as const,
      tone: "text-[#ffb4ab]",
    },
    {
      title: t("walletReport.groupApproval"),
      body: isZh
        ? "UNKNOWN · 需要逐项核对 spender 与额度"
        : "UNKNOWN · review each spender and allowance",
      icon: "shield" as const,
      tone: "text-[#ffc775]",
    },
    {
      title: t("walletReport.groupUnknown"),
      body: isZh
        ? "UNASSESSED · 未自动处理任何资产"
        : "UNASSESSED · no asset was changed or hidden",
      icon: "wallet" as const,
      tone: "text-[#9de32e]",
    },
    {
      title: t("walletReport.groupCoverage"),
      body: isZh
        ? "DEGRADED · 以 Provider 状态为准"
        : "DEGRADED · refer to provider status",
      icon: "radar" as const,
      tone: "text-[#00e5ff]",
    },
  ];

  return (
    <main className="cv-dapp-page min-h-screen pb-24 md:pb-10">
      <DappHeader active="wallet" />

      <section className="mx-auto max-w-[1120px] px-4 py-8 md:py-12">
        <header className="flex flex-col items-center text-center">
          <p className="cv-font-mono text-[10px] uppercase tracking-[0.1em] text-[#00e5ff]">
            BNB SMART CHAIN · MOCK / READINESS
          </p>
          <h1 className="mt-3 cv-font-display text-3xl font-semibold text-[#dce4e5] md:text-4xl">
            {t("walletReport.title")}
          </h1>
          <VigilCore compact />
          <div className="-mt-4 inline-flex items-center gap-2 rounded-md border border-[#9de32e]/25 bg-[#83c600]/10 px-3 py-1.5 cv-font-mono text-[10px] uppercase text-[#9de32e]">
            <span className="size-1.5 rounded-full bg-[#9de32e]" />
            {isZh
              ? "分析流程完成 · 示例数据"
              : "Analysis complete · sample data"}
          </div>
          <p className="mt-4 cv-font-mono text-[10px] uppercase tracking-[0.08em] text-[#c3f5ff]">
            {t("walletReport.readOnlyStatus")}
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#bac9cc]">
            {t("walletReport.noSign")}
          </p>
        </header>

        <section className="cv-dapp-panel mt-8 flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="cv-font-display text-lg font-semibold text-[#dce4e5]">
              {t("walletReport.needsReview")}
            </p>
            <p className="mt-1 cv-font-mono text-xs text-[#849396]">
              {shortAddress} · BNB · READ-ONLY
            </p>
          </div>
          <CopyValueButton
            value={report.address}
            label={t("common.copyAddress")}
            className="min-h-11 border-[#3b494c] text-[#c3f5ff]"
          />
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-2">
          {groups.map((group) => (
            <article key={group.title} className="cv-dapp-panel p-5">
              <div className="flex items-center gap-3">
                <DappIcon
                  name={group.icon}
                  className={`size-5 ${group.tone}`}
                />
                <h2 className="cv-font-display font-semibold text-[#dce4e5]">
                  {group.title}
                </h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#bac9cc]">
                {group.body}
              </p>
            </article>
          ))}
        </section>

        <div className="mt-5">
          <ProviderCoverage mode={report.mode} chain="bnb" variant="strip" />
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 md:mx-auto md:max-w-2xl">
          <Link
            href="/approvals"
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#c3f5ff] px-4 cv-font-display font-semibold text-[#00363d]"
          >
            <DappIcon name="shield" className="size-5" />
            {t("wallet.viewApprovals")}
          </Link>
          <Link
            href="/wallet-check"
            className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#3b494c] bg-[#242b2d] px-4 cv-font-display font-semibold text-[#dce4e5]"
          >
            <DappIcon name="scan" className="size-5" />
            {t("common.recheckWallet")}
          </Link>
        </div>

        <details className="cv-dapp-panel mt-8 p-5">
          <summary className="cursor-pointer cv-font-display font-semibold text-[#c3f5ff]">
            {t("walletReport.approvals")}
          </summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {report.approvals.map((approval) => (
              <article
                key={approval.id}
                className="rounded-lg border border-[#3b494c]/45 bg-[#0d1516] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#849396]">
                      {approval.assetSymbol} / {approval.assetType}
                    </p>
                    <h3 className="mt-1 cv-font-display font-semibold text-[#dce4e5]">
                      {approval.spenderLabel}
                    </h3>
                  </div>
                  <span
                    className={`rounded border px-2 py-1 cv-font-mono text-[10px] ${approvalRiskStyles[approval.riskLevel]}`}
                  >
                    {approval.riskLevel}
                  </span>
                </div>
                <p className="mt-3 break-all cv-font-mono text-xs text-[#849396]">
                  {approval.spenderAddress}
                </p>
                <p className="mt-3 text-sm leading-6 text-[#bac9cc]">
                  {approval.recommendedAction}
                </p>
              </article>
            ))}
          </div>
        </details>

        <p className="mt-6 text-center text-xs leading-5 text-[#849396]">
          {report.disclaimer}
        </p>
      </section>

      <ConsumerMobileNav active="wallet" />
    </main>
  );
}
