"use client";

import { useEffect, useState } from "react";
import { useT } from "../i18n/locale-context";
import type { MessageKey } from "../i18n/messages";
import { DappIcon } from "./dapp-icon";

const STEP_IDS = ["parse", "trade", "perms", "lp", "holders", "report"] as const;

const STEP_LABEL_KEYS: Record<(typeof STEP_IDS)[number], MessageKey> = {
  parse: "scan.step.parse",
  trade: "scan.step.trade",
  perms: "scan.step.perms",
  lp: "scan.step.lp",
  holders: "scan.step.holders",
  report: "scan.step.report",
};

export function ScanProgressOverlay({
  activeIndex,
  symbolHint = "RK",
  failed = false,
  errorMessage,
  onRetry,
  onDismiss,
}: {
  activeIndex: number;
  symbolHint?: string;
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
              <DappIcon name="shield" className="size-5" />
            </span>
            {t("brand.name")}
          </div>
          <span className="cv-font-mono text-[10px] uppercase text-[#bac9cc]">
            {failed ? t("scan.failBadge") : t("scan.readonly")}
          </span>
        </header>

        <div className="relative mx-auto mt-10 flex size-40 items-center justify-center">
          {!failed ? (
            <>
              <span className="cv-scan-ring absolute inset-0 rounded-full border border-[#00e5ff]/35" />
              <span className="cv-scan-ring absolute inset-3 rounded-full border border-[#c3f5ff]/25 [animation-delay:0.6s]" />
            </>
          ) : (
            <span className="absolute inset-0 rounded-full border border-[#ef4444]/40" />
          )}
          <div
            className={`relative flex size-28 items-center justify-center rounded-full border bg-[#151d1e] ${
              failed ? "border-[#ffb4ab]/50" : "border-[#3b494c]"
            }`}
          >
            {!failed ? (
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <span className="cv-scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />
              </div>
            ) : null}
            <div className="relative text-center">
              <p
                className={`cv-font-mono text-2xl font-semibold tracking-tight ${
                  failed ? "text-[#ffb4ab]" : "text-[#c3f5ff]"
                }`}
              >
                {failed ? "!" : symbolHint.slice(0, 4)}
              </p>
              <p className="mt-1 cv-font-mono text-[10px] font-semibold uppercase text-[#849396]">
                {failed ? t("scan.failed") : t("scan.scanning")}
              </p>
            </div>
          </div>
        </div>

        <section className="cv-dapp-panel mt-10 p-5">
          {failed ? (
            <>
              <h2 className="text-center cv-font-display text-lg font-semibold text-[#ffb4ab]">{t("scan.failedTitle")}</h2>
              <p className="mt-2 text-center text-sm leading-6 text-[#bac9cc]">
                {errorMessage || t("check.errApi")}
              </p>
              <p className="mt-3 text-center text-xs text-[#849396]">{t("scan.failedHint")}</p>
              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="min-h-11 rounded-lg bg-[#c3f5ff] text-sm font-semibold text-[#00363d]"
                >
                  {t("scan.retry")}
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="min-h-11 rounded-lg border border-[#3b494c] bg-[#242b2d] text-sm font-semibold text-[#dce4e5]"
                >
                  {t("scan.edit")}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center cv-font-display text-lg font-semibold text-[#dce4e5]">{t("scan.title")}</h2>
              <p className="mt-2 text-center text-sm text-[#849396]">{t("scan.subtitle")}</p>
              <ul className="mt-6 space-y-2">
                {STEP_IDS.map((id, index) => {
                  const done = index < activeIndex;
                  const running = index === activeIndex;
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
                        {t(STEP_LABEL_KEYS[id])}
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
              <p className="mt-5 text-center text-xs text-[#849396]">{t("scan.noWallet")}</p>
              <p className="mt-2 text-center text-xs font-semibold text-[#ffc775]">{t("scan.vpHint")}</p>
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

export function useScanStepProgress(isActive: boolean, stepMs = 420) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex(0);
    const timers: number[] = [];
    STEP_IDS.forEach((_, index) => {
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
