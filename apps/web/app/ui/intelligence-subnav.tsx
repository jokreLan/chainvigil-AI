"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";

export type IntelligenceNavId =
  "hub" | "high-risk" | "fake" | "database" | "learn";

export function IntelligenceSubnav({ active }: { active: IntelligenceNavId }) {
  const { locale } = useLocale();
  const links = [
    { id: "hub" as const, href: "/intel", zh: "情报总览", en: "Intel hub" },
    {
      id: "high-risk" as const,
      href: "/leaderboard/high-risk-tokens",
      zh: "高危样例",
      en: "High-risk samples",
    },
    {
      id: "fake" as const,
      href: "/fake-token-database",
      zh: "仿盘对照",
      en: "Impostor examples",
    },
    {
      id: "database" as const,
      href: "/risk-database",
      zh: "风险信号",
      en: "Risk signals",
    },
    { id: "learn" as const, href: "/learn", zh: "风险百科", en: "Learn" },
  ];

  return (
    <nav
      aria-label={
        locale === "zh" ? "风险情报导航" : "Risk intelligence navigation"
      }
      className="overflow-x-auto border-y border-[#3b494c]/55 bg-[#071012]/90"
    >
      <div className="mx-auto flex min-w-max max-w-[1536px] items-center px-4 sm:px-6 lg:px-8">
        {links.map((link) => {
          const isActive = active === link.id;
          return (
            <Link
              key={link.id}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-h-12 items-center px-4 cv-font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition ${
                isActive
                  ? "bg-[#00e5ff]/8 text-[#c3f5ff]"
                  : "text-[#849396] hover:text-[#dce4e5]"
              }`}
            >
              {locale === "zh" ? link.zh : link.en}
              {isActive ? (
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-[#00d9f2]" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
