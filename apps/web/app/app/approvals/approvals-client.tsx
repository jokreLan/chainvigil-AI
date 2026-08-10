"use client";

import Link from "next/link";
import type { WalletHealthReport } from "@chainvigil/types";
import { useLocale } from "../../i18n/locale-context";
import { ConsumerMobileNav } from "../../ui/consumer-mobile-nav";
import { CopyValueButton } from "../../ui/copy-value-button";
import { DappHeader } from "../../ui/dapp-header";
import { DappIcon } from "../../ui/dapp-icon";
import { ProviderCoverage } from "../../ui/provider-coverage";

const color = {
  HIGH: "#ffb4ab",
  MEDIUM: "#ffc775",
  LOW: "#9de32e",
  UNKNOWN: "#bac9cc",
} as const;

export function ApprovalsClient({ report }: { report: WalletHealthReport }) {
  const { locale, t } = useLocale();
  const isZh = locale === "zh";
  const hasApprovals = report.approvals.length > 0;
  const shortAddress =
    report.address.length > 14
      ? `${report.address.slice(0, 8)}...${report.address.slice(-6)}`
      : report.address;
  const summaryText = `${t("approvals.safetySummary")}: ${shortAddress}. ${t("approvals.noVerified")}`;

  return (
    <main className="cv-dapp-page min-h-screen pb-24 md:pb-10">
      <DappHeader active="approvals" />

      <section className="mx-auto max-w-[1120px] px-4 py-8 md:py-12">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="cv-font-mono text-[10px] uppercase tracking-[0.1em] text-[#00e5ff]">
                BNB CHAIN · READ-ONLY
              </p>
              <span className="rounded border border-[#ffc775]/30 bg-[#ffc775]/8 px-2 py-1 cv-font-mono text-[9px] uppercase text-[#ffc775]">
                MOCK / SAMPLE
              </span>
            </div>
            <h1 className="mt-3 cv-font-display text-3xl font-semibold text-[#dce4e5] md:text-4xl">
              {t("approvals.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bac9cc]">
              {t("approvals.subtitle")}
            </p>
          </div>
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[#3b494c]/50 bg-[#151d1e] p-3 md:min-w-80">
            <span className="min-w-0 flex-1 truncate cv-font-mono text-xs text-[#dce4e5]">
              {shortAddress}
            </span>
            <CopyValueButton
              value={report.address}
              label={t("common.copyAddress")}
              className="min-h-10 border-[#3b494c] text-[#c3f5ff]"
            />
          </div>
        </header>

        <div className="mt-6">
          <ProviderCoverage mode={report.mode} chain="bnb" variant="strip" />
        </div>

        {hasApprovals ? (
          <section className="mt-7 grid gap-4 lg:grid-cols-3">
            {report.approvals.map((approval) => (
              <article
                key={approval.id}
                className="cv-dapp-panel overflow-hidden border-t-4 p-4"
                style={{ borderTopColor: color[approval.riskLevel] }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex size-10 items-center justify-center rounded-full bg-[#2e3638] cv-font-display font-semibold text-[#dce4e5]">
                        {approval.assetSymbol.slice(0, 1)}
                      </span>
                      <div>
                        <h2 className="cv-font-display text-lg font-semibold text-[#dce4e5]">
                          {approval.assetSymbol}
                        </h2>
                        <p className="text-xs text-[#849396]">
                          {approval.assetType}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span
                    className="rounded border px-2 py-1 cv-font-mono text-[9px] font-semibold"
                    style={{
                      borderColor: `${color[approval.riskLevel]}66`,
                      color: color[approval.riskLevel],
                    }}
                  >
                    {approval.riskLevel}
                  </span>
                </div>

                <div className="mt-4 rounded-lg bg-[#0d1516] p-3">
                  <p className="cv-font-mono text-[9px] uppercase tracking-[0.08em] text-[#849396]">
                    SPENDER
                  </p>
                  <p className="mt-1 cv-font-display font-semibold text-[#dce4e5]">
                    {approval.spenderLabel}
                  </p>
                  <p className="mt-1 truncate cv-font-mono text-xs text-[#bac9cc]">
                    {approval.spenderAddress.length > 14
                      ? `${approval.spenderAddress.slice(0, 8)}...${approval.spenderAddress.slice(-6)}`
                      : approval.spenderAddress}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg border border-[#3b494c]/35 bg-[#0d1516] p-3">
                    <p className="cv-font-mono text-[9px] uppercase text-[#849396]">
                      ALLOWANCE
                    </p>
                    <p className="mt-1 text-[#dce4e5]">
                      {approval.allowanceLabel}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#3b494c]/35 bg-[#0d1516] p-3">
                    <p className="cv-font-mono text-[9px] uppercase text-[#849396]">
                      EVIDENCE
                    </p>
                    <p className="mt-1 text-[#bac9cc]">SAMPLE / UNVERIFIED</p>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#bac9cc]">
                  {approval.recommendedAction}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <CopyValueButton
                    value={approval.spenderAddress}
                    label={t("approvals.copySpender")}
                    className="flex min-h-11 items-center justify-center rounded-lg border-[#3b494c] text-[#c3f5ff]"
                  />
                  <Link
                    href="/app/approval-cleaner"
                    className="flex min-h-11 items-center justify-center rounded-lg border border-[#3b494c] bg-[#242b2d] px-3 text-center text-xs font-semibold text-[#dce4e5]"
                  >
                    {isZh ? "安全处理说明" : "Safety guidance"}
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section
            role="status"
            className="cv-dapp-panel mt-7 flex flex-col items-start p-6 md:p-8"
          >
            <DappIcon name="shield" className="size-7 text-[#9de32e]" />
            <h2 className="mt-4 cv-font-display text-xl font-semibold text-[#dce4e5]">
              {isZh
                ? "当前证据中未发现授权"
                : "No approvals found in current evidence"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bac9cc]">
              {isZh
                ? "这不代表钱包一定没有授权。Provider 未配置、降级或覆盖不完整时，结果可能为空，请先核对上方数据源状态。"
                : "This does not prove the wallet has no approvals. Results can be empty when providers are unconfigured, degraded, or incomplete; review the coverage above first."}
            </p>
            <Link
              href="/check"
              className="mt-5 inline-flex min-h-11 items-center border border-[#3b494c] px-4 cv-font-mono text-xs uppercase text-[#c3f5ff]"
            >
              {isZh ? "检查其他公开地址" : "Check another public address"}
            </Link>
          </section>
        )}

        {hasApprovals ? (
          <section className="cv-dapp-panel mt-7 p-5">
            <div className="flex items-center gap-3">
              <DappIcon name="shield" className="size-5 text-[#00e5ff]" />
              <h2 className="cv-font-display font-semibold text-[#dce4e5]">
                {t("approvals.safetySummary")}
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#bac9cc]">
              {t("approvals.privacyHidden")}
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-[#bac9cc] md:grid-cols-3">
              {report.approvals.slice(0, 3).map((approval) => (
                <li
                  key={approval.id}
                  className="rounded-lg border border-[#3b494c]/35 bg-[#0d1516] p-3"
                >
                  {approval.assetSymbol}: {approval.riskLevel} · SAMPLE
                </li>
              ))}
            </ul>
            <CopyValueButton
              value={summaryText}
              label={t("share.copyText")}
              className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg border-[#3b494c] text-[#c3f5ff] md:w-auto md:px-5"
            />
          </section>
        ) : null}

        <aside className="mt-6 flex items-start gap-3 rounded-lg border border-[#ffc775]/25 bg-[#ffc775]/8 p-4 text-sm leading-6 text-[#ffddb1]">
          <DappIcon name="alert" className="mt-0.5 size-5 shrink-0" />
          <p>
            {t("approvals.footer")}{" "}
            {isZh
              ? "ChainVigil 不代用户撤销、签名或广播交易。"
              : "ChainVigil never revokes, signs, or broadcasts on your behalf."}
          </p>
        </aside>
      </section>

      <ConsumerMobileNav active="wallet" />
    </main>
  );
}
