"use client";

import { useEffect, useState } from "react";
import { useT } from "../i18n/locale-context";

function scoreTone(score: number) {
  if (score >= 75) return { stroke: "#10b981", text: "text-[#6ee7b7]", ring: "border-[#10b981]/35" };
  if (score >= 50) return { stroke: "#f59e0b", text: "text-[#fde68a]", ring: "border-[#f59e0b]/35" };
  return { stroke: "#ef4444", text: "text-[#fca5a5]", ring: "border-[#ef4444]/40" };
}

/**
 * Animates health score 0 → target with a circular progress ring.
 * Pure presentation; score comes from report (mock or live).
 */
export function HealthScoreRing({
  score,
  label,
}: {
  score: number;
  label?: string;
}) {
  const t = useT();
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const [display, setDisplay] = useState(0);
  const tone = scoreTone(clamped);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - display / 100);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 1100;

    function tick(now: number) {
      const tProgress = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - (1 - tProgress) ** 3;
      setDisplay(Math.round(clamped * eased));
      if (tProgress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    }

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [clamped]);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative flex size-40 items-center justify-center rounded-full border ${tone.ring}`}>
        <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 128 128" aria-hidden>
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#262932" strokeWidth="8" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={tone.stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="cv-score-ring-transition"
          />
        </svg>
        <div className="relative text-center">
          <p className={`font-mono text-5xl font-semibold tabular-nums ${tone.text}`}>{display}</p>
          <p className="mt-1 text-[11px] font-semibold text-[#9ca3af]">{t("walletReport.scoreOf")}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#fdba74]">{t("walletReport.scoreRing")}</p>
      {label ? <p className="mt-2 text-center text-xl font-semibold text-[#fed7aa]">{label}</p> : null}
    </div>
  );
}
