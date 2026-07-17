"use client";

import { useEffect, useState } from "react";
import { useT } from "../i18n/locale-context";
import type { MessageKey } from "../i18n/messages";

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
            {failed ? t("scan.failBadge") : t("scan.readonly")}
          </span>
        </header>

        <div className="relative mx-auto mt-10 flex size-40 items-center justify-center">
          {!failed ? (
            <>
              <span className="cv-scan-ring absolute inset-0 rounded-full border border-[#8083ff]/35" />
              <span className="cv-scan-ring absolute inset-3 rounded-full border border-[#c0c1ff]/25 [animation-delay:0.6s]" />
            </>
          ) : (
            <span className="absolute inset-0 rounded-full border border-[#ef4444]/40" />
          )}
          <div
            className={`relative flex size-28 items-center justify-center rounded-full border bg-[#16181d] ${
              failed ? "border-[#ef4444]/50" : "border-[#464554]"
            }`}
          >
            {!failed ? (
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <span className="cv-scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c0c1ff] to-transparent" />
              </div>
            ) : null}
            <div className="relative text-center">
              <p
                className={`font-mono text-2xl font-semibold tracking-tight ${
                  failed ? "text-[#fca5a5]" : "text-[#c0c1ff]"
                }`}
              >
                {failed ? "!" : symbolHint.slice(0, 4)}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#9ca3af]">
                {failed ? t("scan.failed") : t("scan.scanning")}
              </p>
            </div>
          </div>
        </div>

        <section className="mt-10 rounded-2xl border border-[#262932] bg-[#16181d] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          {failed ? (
            <>
              <h2 className="text-center text-lg font-semibold text-[#fca5a5]">{t("scan.failedTitle")}</h2>
              <p className="mt-2 text-center text-sm leading-6 text-[#c7c4d7]">
                {errorMessage || t("check.errApi")}
              </p>
              <p className="mt-3 text-center text-xs text-[#9ca3af]">{t("scan.failedHint")}</p>
              <div className="mt-6 grid gap-2">
                <button
                  type="button"
                  onClick={onRetry}
                  className="min-h-11 rounded-xl bg-[#8083ff] text-sm font-semibold text-[#0d0096]"
                >
                  {t("scan.retry")}
                </button>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="min-h-11 rounded-xl border border-[#464554] text-sm font-semibold text-[#f9fafb]"
                >
                  {t("scan.edit")}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center text-lg font-semibold text-[#f9fafb]">{t("scan.title")}</h2>
              <p className="mt-2 text-center text-sm text-[#9ca3af]">{t("scan.subtitle")}</p>
              <ul className="mt-6 space-y-2">
                {STEP_IDS.map((id, index) => {
                  const done = index < activeIndex;
                  const running = index === activeIndex;
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
                        {t(STEP_LABEL_KEYS[id])}
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
              <p className="mt-5 text-center text-xs text-[#9ca3af]">{t("scan.noWallet")}</p>
              <p className="mt-2 text-center text-xs font-semibold text-[#eab308]">{t("scan.vpHint")}</p>
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
