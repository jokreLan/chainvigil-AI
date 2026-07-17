"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "../i18n/locale-context";
import type { Locale } from "../i18n/config";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
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
      className={`inline-flex items-center rounded-full border border-[#34343d] bg-[#16181d] p-0.5 text-[11px] font-semibold ${
        compact ? "" : "gap-0"
      }`}
      role="group"
      aria-label={t("lang.switch")}
    >
      <button
        type="button"
        onClick={() => switchTo("zh")}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === "zh" ? "bg-[#8083ff] text-[#0d0096]" : "text-[#9ca3af] hover:text-[#f9fafb]"
        }`}
      >
        {t("lang.zh")}
      </button>
      <button
        type="button"
        onClick={() => switchTo("en")}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === "en" ? "bg-[#8083ff] text-[#0d0096]" : "text-[#9ca3af] hover:text-[#f9fafb]"
        }`}
      >
        {t("lang.en")}
      </button>
    </div>
  );
}
