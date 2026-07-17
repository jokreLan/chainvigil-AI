"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import type { WalletHealthResponse } from "@chainvigil/types";
import { useLocale } from "../i18n/locale-context";
import { readApiErrorMessage } from "../lib/api-error";
import { WalletScanProgressOverlay, useWalletScanStepProgress } from "./wallet-scan-progress";

export function WalletCheckForm() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = "wallet-address-error";
  const scanStep = useWalletScanStepProgress(isChecking && !scanFailed);

  async function runCheck() {
    const normalizedAddress = address.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
      setError(t("wallet.err"));
      inputRef.current?.focus();
      return;
    }

    setError("");
    setScanFailed(false);
    setFailMessage("");
    setIsChecking(true);
    const started = Date.now();

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiBaseUrl}/api/v1/wallet/health`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          address: normalizedAddress,
          chain: "bsc",
          source: "web",
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response, t("check.errApi")));
      }

      const data = (await response.json()) as WalletHealthResponse;
      const elapsed = Date.now() - started;
      if (elapsed < 2000) {
        await new Promise((resolve) => window.setTimeout(resolve, 2000 - elapsed));
      }

      router.push(`/wallet/${data.report.address}/health`);
    } catch (caught) {
      setScanFailed(true);
      const message = caught instanceof Error ? caught.message : t("check.errGeneric");
      setFailMessage(message);
      setError(message);
    }
  }

  function dismissFailure() {
    setIsChecking(false);
    setScanFailed(false);
    setFailMessage("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runCheck();
  }

  return (
    <>
      {(isChecking || scanFailed) && (
        <WalletScanProgressOverlay
          activeIndex={scanStep}
          addressHint={address.trim() || "0x…"}
          failed={scanFailed}
          errorMessage={failMessage}
          onRetry={() => {
            void runCheck();
          }}
          onDismiss={dismissFailure}
        />
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            aria-label={t("wallet.placeholder")}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            required
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={t("wallet.placeholder")}
            className="min-h-14 min-w-0 flex-1 rounded-xl border border-[#464554] bg-[#0d0d15] px-4 font-mono text-sm text-[#f9fafb] outline-none transition placeholder:text-[#6b7280] focus:border-[#8083ff] focus:ring-2 focus:ring-[#8083ff]/20"
          />
          <button
            type="submit"
            disabled={isChecking && !scanFailed}
            className="min-h-14 shrink-0 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#8500d4] px-5 font-semibold text-[#0d0096] transition hover:from-[#c0c1ff] hover:to-[#a855f7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChecking && !scanFailed ? t("wallet.checking") : t("wallet.start")}
          </button>
        </div>
        {error && !scanFailed ? (
          <p id={errorId} role="alert" className="text-sm text-[#fca5a5]">
            {error}
          </p>
        ) : null}
      </form>
    </>
  );
}
