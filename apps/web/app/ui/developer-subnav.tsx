"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";

export type DeveloperNavId = "pricing" | "developers" | "api" | "bot";

export function DeveloperSubnav({ active }: { active: DeveloperNavId }) {
  const { locale } = useLocale();
  const links = [
    {
      id: "pricing" as const,
      href: "/pricing",
      zh: "定价预览",
      en: "Pricing preview",
    },
    {
      id: "developers" as const,
      href: "/developers",
      zh: "开发者中心",
      en: "Developers",
    },
    { id: "api" as const, href: "/api", zh: "API 契约", en: "API contract" },
    {
      id: "bot" as const,
      href: "/bot",
      zh: "Telegram Bot",
      en: "Telegram Bot",
    },
  ];

  return (
    <nav
      aria-label={
        locale === "zh"
          ? "开发者与定价导航"
          : "Developer and pricing navigation"
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
