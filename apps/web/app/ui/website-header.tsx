"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { DappIcon } from "./dapp-icon";
import { LanguageSwitcher } from "./language-switcher";

export type WebsiteNavId =
  | "home"
  | "check"
  | "wallet"
  | "intel"
  | "learn"
  | "pricing"
  | "developers"
  | "bot";

export function WebsiteHeader({ active }: { active?: WebsiteNavId }) {
  const { locale, t } = useLocale();
  const links = [
    { id: "home" as const, href: "/", label: t("nav.home") },
    { id: "check" as const, href: "/check", label: locale === "zh" ? "CA 安检" : "CA Audit" },
    { id: "wallet" as const, href: "/wallet-check", label: locale === "zh" ? "钱包体检" : "Wallet Audit" },
    { id: "intel" as const, href: "/intel", label: locale === "zh" ? "风险情报" : "Risk Intelligence" },
    { id: "learn" as const, href: "/learn", label: locale === "zh" ? "学习" : "Learn" },
    { id: "pricing" as const, href: "/pricing", label: locale === "zh" ? "定价" : "Pricing" },
    { id: "developers" as const, href: "/developers", label: locale === "zh" ? "开发者" : "Developers" },
    { id: "bot" as const, href: "/bot", label: "Bot" },
  ];

  return (
    <header className="cv-website-header">
      <nav className="mx-auto flex min-h-16 max-w-[1536px] items-center justify-between gap-5 px-4 sm:px-6 lg:min-h-20 lg:px-8">
        <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2.5 cv-font-display text-xl font-semibold tracking-tight text-[#dce4e5]">
          <span className="grid size-9 place-items-center border border-[#00e5ff]/30 bg-[#00e5ff]/8 text-[#c3f5ff]">
            <DappIcon name="shield" className="size-5" />
          </span>
          <span>{t("brand.name")}</span>
        </Link>

        <div className="hidden min-h-20 items-stretch gap-8 xl:flex">
          {links.map((link) => {
            const isActive = active === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center cv-font-mono text-xs font-semibold uppercase tracking-[0.06em] transition ${
                  isActive ? "text-[#c3f5ff]" : "text-[#bac9cc] hover:text-[#dce4e5]"
                }`}
              >
                {link.label}
                {isActive ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#c3f5ff] shadow-[0_0_12px_rgba(195,245,255,0.7)]" /> : null}
              </Link>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <LanguageSwitcher compact variant="dapp" />
          <Link
            href="/check"
            className="inline-flex min-h-11 items-center justify-center bg-[#00d9f2] px-5 cv-font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#002b31] transition hover:bg-[#9cf0ff]"
          >
            {locale === "zh" ? "进入 Web DApp" : "Enter Web DApp"}
          </Link>
          <Link
            href="/app"
            aria-label={locale === "zh" ? "打开工作台" : "Open workspace"}
            className="grid size-11 place-items-center rounded-full bg-[#c3f5ff] text-[#00363d] transition hover:bg-white"
          >
            <DappIcon name="user" className="size-5" />
          </Link>
        </div>

        <details className="group relative sm:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center text-[#c3f5ff] [&::-webkit-details-marker]:hidden">
            <span className="sr-only">{locale === "zh" ? "打开导航" : "Open navigation"}</span>
            <span className="space-y-1.5" aria-hidden>
              <span className="block h-0.5 w-6 bg-current" />
              <span className="block h-0.5 w-6 bg-current" />
              <span className="block h-0.5 w-6 bg-current" />
            </span>
          </summary>
          <div className="absolute right-0 top-12 z-50 w-[min(19rem,calc(100vw-2rem))] border border-[#3b494c] bg-[#0d1516] p-3 shadow-2xl">
            <div className="grid">
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={active === link.id ? "page" : undefined}
                  className={`flex min-h-11 items-center border-b border-[#3b494c]/50 px-3 cv-font-mono text-xs uppercase ${
                    active === link.id ? "bg-[#c3f5ff]/8 text-[#c3f5ff]" : "text-[#bac9cc]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <LanguageSwitcher compact variant="dapp" />
              <Link href="/check" className="flex min-h-11 flex-1 items-center justify-center bg-[#c3f5ff] px-3 cv-font-mono text-xs font-semibold text-[#00363d]">
                DAPP
              </Link>
            </div>
          </div>
        </details>
      </nav>
    </header>
  );
}
