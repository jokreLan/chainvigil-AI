"use client";

import { describeReportMode } from "@chainvigil/report";
import type { ReportConfidence, ReportExecutionMode } from "@chainvigil/types";
import { useT } from "../i18n/locale-context";
import type { MessageKey } from "../i18n/messages";

const toneClass = {
  mock: "border-[#f59e0b]/35 bg-[#f59e0b]/10 text-[#fde68a]",
  live: "border-[#10b981]/35 bg-[#10b981]/10 text-[#a7f3d0]",
  mixed: "border-[#8083ff]/35 bg-[#8083ff]/10 text-[#c0c1ff]",
} as const;

const toneKeys: Record<
  "mock" | "live" | "mixed",
  { badge: MessageKey; title: MessageKey; body: MessageKey }
> = {
  mock: {
    badge: "mode.mock.badge",
    title: "mode.mock.title",
    body: "mode.mock.body",
  },
  live: {
    badge: "mode.live.badge",
    title: "mode.live.title",
    body: "mode.live.body",
  },
  mixed: {
    badge: "mode.mixed.badge",
    title: "mode.mixed.title",
    body: "mode.mixed.body",
  },
};

export function ReportModeBanner({
  mode,
  confidence,
  confidenceScore: _confidenceScore,
  compact = false,
}: {
  mode: ReportExecutionMode;
  confidence: ReportConfidence;
  confidenceScore?: number;
  compact?: boolean;
}) {
  const t = useT();
  const info = describeReportMode(mode, confidence);
  const keys = toneKeys[info.tone];

  return (
    <div className={`rounded-lg border p-3 ${toneClass[info.tone]} ${compact ? "text-xs" : "text-sm"} leading-6`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded border border-current/30 px-2 py-0.5 text-[10px] font-semibold tracking-wide">
          {t(keys.badge)}
        </span>
        <span className="font-semibold">{t(keys.title)}</span>
        <span className="opacity-80">confidence={confidence}</span>
      </div>
      <p className="mt-2 opacity-95">{t(keys.body)}</p>
    </div>
  );
}
