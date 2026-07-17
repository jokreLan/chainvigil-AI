"use client";

import { useEffect, useState } from "react";
import { useT } from "../i18n/locale-context";
import { useToast } from "./toast";

export interface RevokeConfirmPayload {
  assetSymbol: string;
  assetAddressShort: string;
  spenderLabel: string;
  spenderAddressShort: string;
  riskReason: string;
  gasEstimateLabel?: string;
}

export function RevokeConfirmModal({
  open,
  payload,
  onClose,
}: {
  open: boolean;
  payload: RevokeConfirmPayload | null;
  onClose: () => void;
}) {
  const t = useT();
  const { pushToast } = useToast();
  const [understood, setUnderstood] = useState(false);

  useEffect(() => {
    if (!open) {
      setUnderstood(false);
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !payload) return null;

  function finish(demoRevoke: boolean) {
    onClose();
    if (demoRevoke) {
      pushToast(t("revoke.toast"), "warning");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="revoke-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center"
      onClick={() => finish(false)}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[#34343d] bg-[#16181d] shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-[#ef4444]/25 bg-[#ef4444]/10 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-[#ef4444]/20 text-[#fca5a5]">
              !
            </span>
            <div>
              <p className="mb-1 rounded bg-[#0a0b0f]/40 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#fde68a]">
                {t("revoke.demoBadge")}
              </p>
              <h2 id="revoke-title" className="text-lg font-semibold text-[#fca5a5]">
                Confirm Revocation
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#fecaca]/90">{t("revoke.body")}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <Row label="ASSET" value={`${payload.assetSymbol} (${payload.assetAddressShort})`} />
          <Row
            label="SPENDER"
            value={`${payload.spenderLabel} (${payload.spenderAddressShort})`}
          />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
              Risk reason
            </p>
            <p className="mt-2 rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/10 px-3 py-2 text-sm text-[#fecaca]">
              {payload.riskReason}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#9ca3af]">Estimated Gas Fee</span>
            <span className="font-semibold text-[#f9fafb]">
              {payload.gasEstimateLabel ?? "~ $1.20 (demo)"}
            </span>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#34343d] bg-[#0d0d15] p-3 text-sm text-[#c7c4d7]">
            <input
              type="checkbox"
              className="mt-1"
              checked={understood}
              onChange={(event) => setUnderstood(event.target.checked)}
            />
            <span>{t("revoke.understand")}</span>
          </label>
        </div>

        <div className="flex gap-3 border-t border-[#262932] px-5 py-4">
          <button
            type="button"
            onClick={() => finish(false)}
            className="min-h-11 flex-1 rounded-xl border border-[#464554] text-sm font-semibold text-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!understood}
            onClick={() => finish(true)}
            className="min-h-11 flex-1 rounded-xl bg-[#ef4444]/90 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            title={t("revoke.noBroadcast")}
          >
            Revoke Allowance
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">{label}</p>
      <p className="mt-1 break-all text-sm font-medium text-[#f9fafb]">{value}</p>
    </div>
  );
}
