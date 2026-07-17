"use client";

import Link from "next/link";
import { useT } from "../i18n/locale-context";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader({
  active,
}: {
  active?: "home" | "check" | "wallet" | "intel" | "points" | "bot" | "other";
}) {
  const t = useT();

  const link = (id: typeof active, href: string, label: string) => (
    <Link
      href={href}
      className={
        active === id
          ? "font-semibold text-[#c0c1ff]"
          : "text-[#9ca3af] transition hover:text-[#f9fafb]"
      }
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-[#262932]/80 bg-[#0a0b0f]/92 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-[#f9fafb]">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-[#8083ff]/20 text-[#c0c1ff]">
            ◎
          </span>
          {t("brand.name")}
        </Link>
        <div className="hidden items-center gap-5 text-sm md:flex">
          {link("check", "/check", t("nav.check"))}
          {link("wallet", "/wallet-check", t("nav.wallet"))}
          {link("intel", "/intel", t("nav.intel"))}
          {link("points", "/app/points", t("nav.points"))}
          {link("bot", "/bot", t("nav.bot"))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher compact />
          <Link
            href="/check"
            className="rounded-lg bg-[#8083ff] px-3 py-1.5 text-xs font-semibold text-[#0d0096] md:text-sm"
          >
            {t("nav.scanNow")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
