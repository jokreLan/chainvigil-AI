"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "../i18n/locale-context";
import type { Locale } from "../i18n/config";

export function LanguageSwitcher({
  compact = false,
  variant = "default",
}: {
  compact?: boolean;
  variant?: "default" | "dapp";
}) {
  const { locale, setLocale, t } = useLocale();
  const pathname = usePathname();

  function switchTo(next: Locale) {
    if (next === locale) return;
    setLocale(next);
    const segments = pathname.split("/");
    const currentPrefix = segments[1];
    const nextPath =
      currentPrefix === "zh" || currentPrefix === "en"
        ? `/${next}/${segments.slice(2).join("/")}`
        : `/${next}${pathname === "/" ? "" : pathname}`;
    window.location.assign(nextPath.replace(/\/+$/, "") || `/${next}`);
  }

  return (
    <div
      className={`inline-flex items-center border p-0.5 text-[11px] font-semibold ${
        variant === "dapp"
          ? "rounded-md border-[#3b494c]/70 bg-[#151d1e]"
          : "rounded-full border-[#34343d] bg-[#16181d]"
      } ${
        compact ? "" : "gap-0"
      }`}
      role="group"
      aria-label={t("lang.switch")}
    >
      <button
        type="button"
        onClick={() => switchTo("zh")}
        className={`${variant === "dapp" ? "min-h-11 min-w-11 rounded" : "rounded-full"} px-2.5 py-1 transition ${
          locale === "zh"
            ? variant === "dapp" ? "bg-[#c3f5ff] text-[#00363d]" : "bg-[#8083ff] text-[#0d0096]"
            : variant === "dapp" ? "text-[#bac9cc] hover:text-[#dce4e5]" : "text-[#9ca3af] hover:text-[#f9fafb]"
        }`}
      >
        {t("lang.zh")}
      </button>
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={`${variant === "dapp" ? "min-h-11 min-w-11 rounded" : "rounded-full"} px-2.5 py-1 transition ${
          locale === "en"
            ? variant === "dapp" ? "bg-[#c3f5ff] text-[#00363d]" : "bg-[#8083ff] text-[#0d0096]"
            : variant === "dapp" ? "text-[#bac9cc] hover:text-[#dce4e5]" : "text-[#9ca3af] hover:text-[#f9fafb]"
        }`}
      >
        {t("lang.en")}
      </button>
    </div>
  );
}
