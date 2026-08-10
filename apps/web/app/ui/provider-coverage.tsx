"use client";

import { useT } from "../i18n/locale-context";

export function ProviderCoverage({
  mode,
  chain,
  variant = "report",
}: {
  mode: "live" | "mock";
  chain: string;
  variant?: "report" | "strip";
}) {
  const t = useT();
  const isSolana = chain.toLowerCase() === "solana";
  const providers = [
    ["GoPlus", mode === "live" ? t("provider.available") : t("provider.sample")],
    ["Honeypot.is", mode === "live" ? t("provider.available") : t("provider.sample")],
    ["Solana RPC", isSolana ? (mode === "live" ? t("provider.available") : t("provider.unconfigured")) : t("provider.notApplicable")],
    ["BNB Chain RPC", !isSolana ? (mode === "live" ? t("provider.available") : t("provider.unconfigured")) : t("provider.notApplicable")],
  ];

  return (
    <section
      className={variant === "strip" ? "" : "cv-dapp-panel p-4"}
      aria-labelledby="provider-coverage-title"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="provider-coverage-title" className="cv-font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bac9cc]">
          {t("provider.title")}
        </h2>
        <span className="cv-font-mono text-[10px] uppercase text-[#9de32e]">
          {mode === "live" ? t("provider.available") : "READINESS"}
        </span>
      </div>
      <div className={`mt-3 grid gap-2 ${variant === "strip" ? "grid-cols-2 min-[390px]:grid-cols-4" : "min-[360px]:grid-cols-2"}`}>
        {providers.map(([name, status]) => (
          <div key={name} className="relative min-w-0 rounded-lg border border-[#3b494c]/35 bg-[#151d1e] p-3">
            <span className={`absolute right-2 top-2 size-1.5 rounded-full ${mode === "live" ? "bg-[#9de32e]" : "bg-[#00e5ff]"}`} />
            <p className="truncate pr-3 text-xs text-[#dce4e5]">{name}</p>
            <p className="mt-2 break-words cv-font-mono text-[9px] font-semibold uppercase tracking-wide text-[#bac9cc]">
              {status}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
