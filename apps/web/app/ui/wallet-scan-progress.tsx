"use client";

import { useEffect, useMemo, useState } from "react";
import { useT } from "../i18n/locale-context";
import type { MessageKey } from "../i18n/messages";

const WALLET_STEP_IDS = ["parse", "chain", "spenders", "assets", "score"] as const;

const WALLET_STEP_KEYS: Record<(typeof WALLET_STEP_IDS)[number], MessageKey> = {
  parse: "walletScan.step.parse",
  chain: "walletScan.step.chain",
  spenders: "walletScan.step.spenders",
  assets: "walletScan.step.assets",
  score: "walletScan.step.score",
};

/** Progressive mock counts while spender step is active (instrumentation feel). */
function useSpenderCount(active: boolean, runningSpenders: boolean) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!active || !runningSpenders) {
      setCount(3);
      return;
    }
    setCount(5);
    const id = window.setInterval(() => {
      setCount((prev) => Math.min(prev + 1 + Math.floor(Math.random() * 2), 17));
    }, 280);
    return () => window.clearInterval(id);
  }, [active, runningSpenders]);

  return count;
}

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
  const progressPct = Math.min(
    100,
    Math.round(
      ((failed ? WALLET_STEP_IDS.length : activeIndex + 0.45) / WALLET_STEP_IDS.length) * 100,
    ),
  );
  const runningSpenders = !failed && WALLET_STEP_IDS[activeIndex] === "spenders";
  const spenderCount = useSpenderCount(!failed, runningSpenders);
  const ringStyle = useMemo(
    () =>
      ({
        background: `conic-gradient(#8083ff ${progressPct * 3.6}deg, #262932 0deg)`,
      }) as const,
    [progressPct],
  );

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!failed}
      className="fixed inset-0 z-40 flex flex-col bg-[#0a0b0f]/96 px-5 pb-28 pt-6 backdrop-blur-sm md:pb-10"
    >
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <header className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 font-semibold text-[#f9fafb]">
            <span className="inline-flex size-7 items-center justify-center rounded-md bg-[#8083ff]/20 text-[#c0c1ff]">
              ◎
            </span>
            {t("brand.name")}
          </div>
          <span className="text-xs text-[#9ca3af]">
            {failed ? t("scan.failBadge") : t("walletScan.readonly")}
          </span>
        </header>

        <div className="relative mx-auto mt-10 flex size-44 items-center justify-center">
          {!failed ? (
            <span className="cv-scan-ring absolute inset-0 rounded-full border border-[#8083ff]/30" />
          ) : null}
          <div
            className={`relative flex size-36 items-center justify-center rounded-full p-[3px] ${
              failed ? "bg-[#ef4444]/40" : ""
            }`}
            style={failed ? undefined : ringStyle}
          >
            <div className="flex size-full flex-col items-center justify-center rounded-full border border-[#34343d] bg-[#16181d]">
              <p
                className={`font-mono text-3xl font-semibold tabular-nums tracking-tight ${
                  failed ? "text-[#fca5a5]" : "text-[#c0c1ff]"
                }`}
              >
                {failed ? "!" : `${progressPct}`}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                {failed ? t("scan.failed") : t("walletScan.scanning")}
              </p>
              {!failed ? (
                <p className="mt-0.5 text-[10px] text-[#6b7280]">{t("walletScan.scoreHint")}</p>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-xs text-[#6b7280]">
          {addressHint.length > 18
            ? `${addressHint.slice(0, 8)}…${addressHint.slice(-6)}`
            : addressHint}
        </p>

        <section className="mt-8 rounded-2xl border border-[#262932] bg-[#16181d] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          {failed ? (
            <>
              <h2 className="text-center text-lg font-semibold text-[#fca5a5]">
                {t("walletScan.failedTitle")}
              </h2>
              <p className="mt-2 text-center text-sm leading-6 text-[#c7c4d7]">
                {errorMessage || t("check.errApi")}
              </p>
              <p className="mt-3 text-center text-xs text-[#9ca3af]">{t("walletScan.failedHint")}</p>
              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="min-h-11 rounded-xl bg-[#8083ff] text-sm font-semibold text-[#0d0096]"
                >
                  {t("walletScan.retry")}
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="min-h-11 rounded-xl border border-[#464554] text-sm font-semibold text-[#f9fafb]"
                >
                  {t("walletScan.edit")}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center text-lg font-semibold text-[#f9fafb]">{t("walletScan.title")}</h2>
              <p className="mt-2 text-center text-sm text-[#9ca3af]">{t("walletScan.subtitle")}</p>
              <ul className="mt-6 space-y-2">
                {WALLET_STEP_IDS.map((id, index) => {
                  const done = index < activeIndex;
                  const running = index === activeIndex;
                  const label =
                    id === "spenders" && running
                      ? `${t(WALLET_STEP_KEYS[id])} (${spenderCount})`
                      : t(WALLET_STEP_KEYS[id]);
                  return (
                    <li
                      key={id}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm ${
                        running
                          ? "border border-[#8083ff]/40 bg-[#8083ff]/15 text-[#c0c1ff]"
                          : "border border-transparent bg-[#0d0d15] text-[#c7c4d7]"
                      }`}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <StepMark done={done} running={running} />
                        {label}
                      </span>
                      <span
                        className={
                          done
                            ? "text-xs font-semibold text-[#6ee7b7]"
                            : running
                              ? "text-xs font-semibold text-[#c0c1ff]"
                              : "text-xs text-[#6b7280]"
                        }
                      >
                        {done ? t("scan.stepDone") : running ? t("scan.stepRun") : t("scan.stepWait")}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 text-center text-xs text-[#9ca3af]">{t("walletScan.noWallet")}</p>
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
        className="flex size-5 items-center justify-center rounded-full bg-[#10b981]/20 text-[10px] text-[#6ee7b7]"
      >
        ✓
      </span>
    );
  }
  if (running) {
    return (
      <span
        aria-hidden
        className="size-5 rounded-full border-2 border-[#c0c1ff]/30 border-t-[#c0c1ff] motion-safe:animate-spin"
      />
    );
  }
  return <span aria-hidden className="size-5 rounded-full border border-[#464554]" />;
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
