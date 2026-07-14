import type { RiskLevel } from "@chainvigil/types";

const riskBadgeStyles: Record<RiskLevel, string> = {
  BLOCK: "border-[#ef4444]/40 bg-[#ef4444]/10 text-[#fca5a5]",
  HIGH: "border-[#f97316]/40 bg-[#f97316]/10 text-[#fdba74]",
  MEDIUM: "border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#fde68a]",
  LOW: "border-[#10b981]/40 bg-[#10b981]/10 text-[#6ee7b7]",
  UNKNOWN: "border-[#6b7280]/40 bg-[#6b7280]/10 text-[#d1d5db]",
};

export function RiskBadge({ level, label = level }: { level: RiskLevel; label?: string }) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${riskBadgeStyles[level]}`}>
      {label}
    </span>
  );
}
