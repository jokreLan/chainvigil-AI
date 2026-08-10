"use client";

import { useEffect, useState } from "react";
import { useT } from "../i18n/locale-context";
import type { MessageKey } from "../i18n/messages";
import { DappIcon } from "./dapp-icon";

const WALLET_STEP_IDS = ["parse", "chain", "spenders", "assets", "score"] as const;

const WALLET_STEP_KEYS: Record<(typeof WALLET_STEP_IDS)[number], MessageKey> = {
  parse: "walletScan.step.parse",
  chain: "walletScan.step.chain",
  spenders: "walletScan.step.spenders",
  assets: "walletScan.step.assets",
  score: "walletScan.step.score",
};

export function WalletScanProgressOverlay({
  activeIndex,
  addressHint = "0x…",
  failed = false,
  errorMessage,
  onRetry,
  onDismiss,
}: {
  activeIndex: number;
  addressHint?: string;
  failed?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  const t = useT();
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!failed}
      className="cv-dapp-page fixed inset-0 z-50 flex flex-col px-5 pb-28 pt-6 md:pb-10"
    >
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <header className="flex items-center justify-between text-sm">
          <div className="flex min-h-11 items-center gap-2 cv-font-display font-semibold text-[#dce4e5]">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-[#00e5ff] text-[#00363d]">
              <DappIcon name="wallet" className="size-5" />
            </span>
            {t("brand.name")}
          </div>
          <span className="cv-font-mono text-[10px] uppercase text-[#bac9cc]">
            {failed ? t("scan.failBadge") : t("walletScan.readonly")}
          </span>
        </header>

        <div className="relative mx-auto mt-10 flex size-44 items-center justify-center">
          {!failed ? (
            <span className="cv-scan-ring absolute inset-0 rounded-full border border-[#00e5ff]/30" />
          ) : null}
          <div
            className={`relative flex size-36 items-center justify-center rounded-full border ${
              failed ? "border-[#ffb4ab]/50" : "border-[#00e5ff]/45"
            }`}
          >
            <div className="flex size-[calc(100%_-_12px)] flex-col items-center justify-center rounded-full border border-[#3b494c] bg-[#151d1e]">
              <p
                className={`cv-font-mono text-2xl font-semibold tracking-tight ${
                  failed ? "text-[#ffb4ab]" : "text-[#c3f5ff]"
                }`}
              >
                {failed ? "!" : "…"}
              </p>
              <p className="mt-1 cv-font-mono text-[10px] font-semibold uppercase tracking-wide text-[#849396]">
                {failed ? t("scan.failed") : t("walletScan.scanning")}
              </p>
              {!failed ? <p className="mt-1 text-[10px] text-[#849396]">{t("walletScan.scoreHint")}</p> : null}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center cv-font-mono text-xs text-[#849396]">
          {addressHint.length > 18
            ? `${addressHint.slice(0, 8)}…${addressHint.slice(-6)}`
            : addressHint}
        </p>

        <section className="cv-dapp-panel mt-8 p-5">
          {failed ? (
            <>
              <h2 className="text-center cv-font-display text-lg font-semibold text-[#ffb4ab]">
                {t("walletScan.failedTitle")}
              </h2>
              <p className="mt-2 text-center text-sm leading-6 text-[#bac9cc]">
                {errorMessage || t("check.errApi")}
              </p>
              <p className="mt-3 text-center text-xs text-[#849396]">{t("walletScan.failedHint")}</p>
              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="min-h-11 rounded-lg bg-[#c3f5ff] text-sm font-semibold text-[#00363d]"
                >
                  {t("walletScan.retry")}
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="min-h-11 rounded-lg border border-[#3b494c] bg-[#242b2d] text-sm font-semibold text-[#dce4e5]"
                >
                  {t("walletScan.edit")}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center cv-font-display text-lg font-semibold text-[#dce4e5]">{t("walletScan.title")}</h2>
              <p className="mt-2 text-center text-sm text-[#849396]">{t("walletScan.subtitle")}</p>
              <ul className="mt-6 space-y-2">
                {WALLET_STEP_IDS.map((id, index) => {
                  const done = index < activeIndex;
                  const running = index === activeIndex;
                  const label = t(WALLET_STEP_KEYS[id]);
                  return (
                    <li
                      key={id}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm ${
                        running
                          ? "border border-[#00e5ff]/40 bg-[#00e5ff]/8 text-[#c3f5ff]"
                          : "border border-transparent bg-[#0d1516] text-[#bac9cc]"
                      }`}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <StepMark done={done} running={running} />
                        {label}
                      </span>
                      <span
                        className={
                          done
                            ? "text-xs font-semibold text-[#9de32e]"
                            : running
                              ? "text-xs font-semibold text-[#00e5ff]"
                              : "text-xs text-[#849396]"
                        }
                      >
                        {done ? t("scan.stepDone") : running ? t("scan.stepRun") : t("scan.stepWait")}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 text-center text-xs text-[#849396]">{t("walletScan.noWallet")}</p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function StepMark({ done, running }: { done: boolean; running: boolean }) {
  if (done) {
    return (
      <span
        aria-hidden
        className="flex size-5 items-center justify-center rounded-full bg-[#9de32e]/15 text-[10px] text-[#9de32e]"
      >
        ✓
      </span>
    );
  }
  if (running) {
    return (
      <span
        aria-hidden
        className="size-5 rounded-full border-2 border-[#00e5ff]/25 border-t-[#00e5ff] motion-safe:animate-spin"
      />
    );
  }
  return <span aria-hidden className="size-5 rounded-full border border-[#3b494c]" />;
}

export function useWalletScanStepProgress(isActive: boolean, stepMs = 380) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex(0);
    const timers: number[] = [];
    WALLET_STEP_IDS.forEach((_, index) => {
      if (index === 0) return;
      timers.push(
        window.setTimeout(() => {
          setActiveIndex(index);
        }, index * stepMs),
      );
    });

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [isActive, stepMs]);

  return activeIndex;
}
