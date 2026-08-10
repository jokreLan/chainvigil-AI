"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import type { TokenCheckResponse } from "@chainvigil/types";
import { useLocale } from "../i18n/locale-context";
import { readApiErrorMessage } from "../lib/api-error";
import { ScanProgressOverlay, useScanStepProgress } from "./scan-progress";

const evmAddressPattern = /^0x[a-fA-F0-9]{40}$/;
const solanaAddressPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function parseSupportedInput(value: string) {
  if (evmAddressPattern.test(value)) return "BNB Smart Chain";
  if (solanaAddressPattern.test(value)) return "Solana";

  try {
    const url = new URL(value);
    const supportedHost =
      url.hostname === "dexscreener.com" ||
      url.hostname.endsWith(".dexscreener.com") ||
      url.hostname === "gmgn.ai" ||
      url.hostname.endsWith(".gmgn.ai");
    const address = url.pathname.match(/0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44}/)?.[0];
    if (supportedHost && address) return address.startsWith("0x") ? "BNB Smart Chain" : "Solana";
  } catch {
    return null;
  }

  return null;
}

export function CheckForm({
  compact,
  showWalletLink = false,
  fromTask = false,
  variant = "default",
  hideSupportingText = false,
}: {
  compact: boolean;
  showWalletLink?: boolean;
  fromTask?: boolean;
  variant?: "default" | "dapp" | "website";
  hideSupportingText?: boolean;
}) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = "token-address-error";
  const scanStep = useScanStepProgress(isChecking && !scanFailed);
  const symbolHint = input.trim().slice(0, 4) || "CA";

  function validationHint(value: string): string {
    const v = value.trim();
    if (!v) return t("check.errEmpty");
    if (v.startsWith("0x") && v.length !== 42) return t("check.errEvmLen");
    if (!v.startsWith("0x") && !solanaAddressPattern.test(v) && !v.includes("://")) {
      return t("check.errNotSolBnb");
    }
    return t("check.errInvalid");
  }

  async function runCheck() {
    const normalizedInput = input.trim();
    if (!parseSupportedInput(normalizedInput)) {
      setError(validationHint(normalizedInput));
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
      const response = await fetch(`${apiBaseUrl}/api/v1/token/check`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          input: normalizedInput,
          source: "web",
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response, t("check.errApi")));
      }

      const data = (await response.json()) as TokenCheckResponse;
      const elapsed = Date.now() - started;
      if (elapsed < 1800) {
        await new Promise((resolve) => window.setTimeout(resolve, 1800 - elapsed));
      }

      if (typeof window !== "undefined") {
        try {
          const key = "cv_recent_checks";
          const prev = JSON.parse(window.localStorage.getItem(key) || "[]") as Array<{
            chain: string;
            address: string;
            at: string;
          }>;
          const next = [
            {
              chain: data.report.chain,
              address: data.report.tokenAddress,
              at: new Date().toISOString(),
            },
            ...prev.filter(
              (item) =>
                !(item.chain === data.report.chain && item.address === data.report.tokenAddress),
            ),
          ].slice(0, 8);
          window.localStorage.setItem(key, JSON.stringify(next));
          if (fromTask) {
            window.sessionStorage.setItem("cv_vp_task_done", "FIRST_CA_CHECK");
          }
        } catch {
          // ignore storage errors
        }
      }

      const q = fromTask ? "?from=task" : "";
      router.push(`/token/${data.report.chain}/${data.report.tokenAddress}${q}`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : t("check.errGeneric");
      setFailMessage(message);
      setError(message);
      setScanFailed(true);
      setIsChecking(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runCheck();
  }

  const showOverlay = isChecking || scanFailed;
  const isDapp = variant === "dapp";
  const isWebsite = variant === "website";

  return (
    <>
      {showOverlay ? (
        <ScanProgressOverlay
          activeIndex={scanStep}
          symbolHint={symbolHint}
          failed={scanFailed}
          errorMessage={failMessage}
          onRetry={() => {
            void runCheck();
          }}
          onDismiss={() => {
            setScanFailed(false);
            setFailMessage("");
            setIsChecking(false);
            inputRef.current?.focus();
          }}
        />
      ) : null}
      <form onSubmit={onSubmit} aria-busy={isChecking} className="space-y-3">
        <div className={compact ? "space-y-3" : "flex flex-col gap-3 sm:flex-row"}>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              aria-label={t("check.placeholder")}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : "token-address-hint"}
              required
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isChecking}
              placeholder={t("check.placeholder")}
              className={`min-h-14 w-full border px-4 pr-14 cv-font-mono text-sm outline-none transition ${
                isWebsite
                  ? "border-[#3b494c] bg-[#081012] text-[#dce4e5] placeholder:text-[#849396] focus:border-[#c3f5ff] focus:ring-2 focus:ring-[#00e5ff]/10"
                  : isDapp
                  ? "rounded-lg border-[#3b494c]/70 bg-[#242b2d] text-[#dce4e5] placeholder:text-[#849396] focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff]/15"
                  : compact
                  ? "border-transparent bg-[#f9fafb] text-[#16181d] placeholder:text-[#9ca3af] shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                  : "border-[#464554] bg-[#0d0d15] text-[#f9fafb] placeholder:text-[#6b7280] focus:border-[#8083ff]"
              }`}
            />
            {input ? (
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setError("");
                  inputRef.current?.focus();
                }}
                className={`absolute inset-y-0 right-2 my-auto min-h-9 rounded px-2 text-xs font-semibold transition ${
                  isWebsite
                    ? "text-[#bac9cc] hover:bg-[#151d1e] hover:text-[#dce4e5]"
                    : isDapp
                    ? "text-[#bac9cc] hover:bg-[#151d1e] hover:text-[#dce4e5]"
                    : "text-[#9ca3af] hover:bg-[#292932]/20 hover:text-[#16181d]"
                }`}
              >
                {t("check.clear")}
              </button>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={isChecking}
            className={`min-h-14 w-full px-6 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isWebsite
                ? "bg-[#c3f5ff] cv-font-mono text-xs uppercase tracking-[0.06em] text-[#00363d] shadow-[0_0_18px_rgba(0,229,255,0.12)] hover:bg-[#9cf0ff]"
                : isDapp
                ? "rounded-lg bg-[#c3f5ff] cv-font-display text-[#00363d] hover:bg-[#9cf0ff]"
                : compact
                ? "bg-gradient-to-r from-[#8083ff] to-[#6366f1] text-[#0d0096] shadow-[0_12px_28px_rgba(128,131,255,0.28)] hover:from-[#c0c1ff] hover:to-[#8083ff]"
                : "bg-[#8083ff] text-[#0d0096] hover:bg-[#c0c1ff]"
            } ${isDapp || compact ? "" : "sm:w-auto"}`}
          >
            {isChecking ? t("check.checking") : t("check.submit")}
          </button>
        </div>
        {error && !scanFailed ? (
          <p id={errorId} role="alert" className="text-sm text-[#fca5a5]">
            {error}
          </p>
        ) : null}
        {!hideSupportingText ? (
          <>
            <p id="token-address-hint" className="text-xs leading-5 text-[#9ca3af]">
              {t("check.hint")}
              <span className="font-mono text-[#c7c4d7]">0x1111…1111</span>
              {locale === "en" ? " (BNB) or " : "（BNB）或 "}
              <span className="font-mono text-[#c7c4d7]">So1111…1112</span>
              {locale === "en" ? " (SOL)" : "（SOL）"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#9ca3af] sm:justify-start">
              <span className="inline-flex items-center gap-1 text-[#6ee7b7]">
                <span aria-hidden>✓</span> {t("home.free")}
              </span>
              <span>{t("home.noWallet")}</span>
              <span>{t("home.chains")}</span>
              <span className="text-[#c0c1ff]">
                {t("check.detect")}
                {parseSupportedInput(input.trim()) ?? "SOL / BNB"}
              </span>
            </div>
          </>
        ) : null}
        {showWalletLink ? (
          <a
            href="/wallet-check"
            className={`flex min-h-12 items-center justify-center border text-sm font-semibold transition ${
              isWebsite
                ? "border-[#3b494c] bg-[#0d1516] text-[#c3f5ff] hover:border-[#c3f5ff]"
                : isDapp
                ? "rounded-lg border-[#c3f5ff]/25 bg-[#242b2d] text-[#c3f5ff] hover:border-[#00e5ff]/60"
                : "rounded-xl border-[#464554] text-[#f9fafb] hover:border-[#8083ff]/50"
            }`}
          >
            {t("home.checkWallet")}
          </a>
        ) : null}
      </form>
    </>
  );
}
