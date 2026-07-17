"use client";

import Link from "next/link";
import { useState } from "react";
import type { ApprovalRiskItem, WalletHealthReport } from "@chainvigil/types";
import { useT } from "../../i18n/locale-context";
import { MobileNav } from "../../ui/mobile-nav";
import { SiteHeader } from "../../ui/site-header";
import { RevokeConfirmModal, type RevokeConfirmPayload } from "../../ui/revoke-confirm-modal";

const color = {
  HIGH: "#ef4444",
  MEDIUM: "#f59e0b",
  LOW: "#10b981",
  UNKNOWN: "#9ca3af",
} as const;

function shortAddr(value: string) {
  if (value.length < 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function ApprovalsClient({ report }: { report: WalletHealthReport }) {
  const t = useT();
  const [payload, setPayload] = useState<RevokeConfirmPayload | null>(null);

  function openRevoke(approval: ApprovalRiskItem) {
    setPayload({
      assetSymbol: approval.assetSymbol,
      assetAddressShort: shortAddr(approval.id.split(":").pop() ?? approval.assetSymbol),
      spenderLabel: approval.spenderLabel,
      spenderAddressShort: shortAddr(approval.spenderAddress),
      riskReason: approval.riskReasons[0] ?? approval.recommendedAction,
      gasEstimateLabel: "~ 0.0005 BNB (demo)",
    });
  }

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28 text-[#e4e1ed]">
      <SiteHeader active="wallet" />

      <div className="mx-auto max-w-lg px-4 py-8 md:max-w-xl">
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#c0c1ff]">
            Mock read-only scan
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#f9fafb]">{t("approvals.title")}</h1>
          <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{t("approvals.subtitle")}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-[#f97316]/35 bg-[#f97316]/10 p-5">
          <p className="text-sm text-[#fdba74]">{t("approvals.health")}</p>
          <p className="mt-2 text-5xl font-bold text-[#f9fafb]">{report.summary.score}</p>
          <p className="mt-2 text-[#fed7aa]">{report.summary.label}</p>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-2">
          {[
            [t("approvals.high"), report.summary.highRiskApprovals],
            [t("approvals.infinite"), report.summary.infiniteApprovals],
            [t("approvals.suspicious"), report.summary.suspiciousTokens],
          ].map(([label, value]) => (
            <article key={String(label)} className="rounded-xl border border-[#262932] bg-[#16181d] p-3">
              <p className="text-[11px] text-[#9ca3af]">{label}</p>
              <p className="mt-1 text-xl font-semibold text-[#f9fafb]">{value}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 space-y-3">
          {report.approvals.map((approval) => (
            <article key={approval.id} className="rounded-2xl border border-[#262932] bg-[#16181d] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#f9fafb]">{approval.assetSymbol}</h2>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${color[approval.riskLevel]}1a`,
                        color: color[approval.riskLevel],
                      }}
                    >
                      {approval.riskLevel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#9ca3af]">
                    {approval.spenderLabel} · {approval.assetType}
                  </p>
                  <p className="mt-1 break-all font-mono text-[11px] text-[#c7c4d7]">
                    {approval.spenderAddress}
                  </p>
                </div>
                <span className="rounded-lg border border-[#464554] px-2.5 py-1.5 text-xs text-[#c7c4d7]">
                  {approval.allowanceLabel}
                </span>
              </div>
              <div className="mt-4 border-t border-[#262932] pt-3">
                <p className="text-[11px] font-semibold uppercase text-[#9ca3af]">{t("approvals.reasons")}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {approval.riskReasons.map((reason) => (
                    <span key={reason} className="rounded bg-[#292932] px-2 py-1 text-[11px] text-[#c7c4d7]">
                      {reason}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-[#c0c1ff]">{approval.recommendedAction}</p>
                <button
                  type="button"
                  onClick={() => openRevoke(approval)}
                  className="mt-3 w-full rounded-xl border border-[#ef4444]/40 bg-[#ef4444]/15 py-2.5 text-sm font-semibold text-[#fca5a5] transition hover:bg-[#ef4444]/25"
                >
                  {t("approvals.revokeDemo")}
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-[#262932] bg-[#1b1b23] p-4 text-sm leading-6 text-[#9ca3af]">
          {t("approvals.footer")}
          <Link
            href="/wallet-check"
            className="mt-3 block rounded-xl bg-[#c0c1ff] py-3 text-center text-sm font-semibold text-[#1000a9]"
          >
            {t("approvals.viewHealth")}
          </Link>
        </section>
      </div>

      <RevokeConfirmModal open={Boolean(payload)} payload={payload} onClose={() => setPayload(null)} />
      <MobileNav active="wallet" />
    </main>
  );
}
