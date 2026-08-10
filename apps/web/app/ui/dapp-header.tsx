"use client";

import Link from "next/link";
import { useT } from "../i18n/locale-context";
import { DappIcon } from "./dapp-icon";
import { LanguageSwitcher } from "./language-switcher";

type DappSection = "scan" | "wallet" | "approvals" | "intel" | "workspace";

export function DappHeader({
  active,
  mode = "readiness",
}: {
  active: DappSection;
  mode?: "live" | "readiness";
}) {
  const t = useT();
  const links: Array<{ id: DappSection; href: string; label: string }> = [
    { id: "scan", href: "/check", label: t("nav.check") },
    { id: "wallet", href: "/wallet-check", label: t("nav.wallet") },
    { id: "approvals", href: "/approvals", label: t("approvals.title") },
    { id: "intel", href: "/intel", label: t("nav.intel") },
    { id: "workspace", href: "/app", label: t("ws.title") },
  ];

  return (
    <header className="cv-dapp-header">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/check"
            className="flex min-h-11 min-w-0 items-center gap-2 text-[#dce4e5]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#00e5ff] text-[#00363d]">
              <DappIcon name="shield" className="size-5" />
            </span>
            <span className="cv-font-display truncate text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
              {t("brand.name")}
            </span>
          </Link>
          <span
            className={`hidden items-center gap-2 rounded-md border px-2 py-1 cv-font-mono text-[10px] font-semibold uppercase tracking-[0.08em] sm:inline-flex ${
              mode === "live"
                ? "border-[#9de32e]/25 bg-[#83c600]/10 text-[#9de32e]"
                : "border-[#00e5ff]/20 bg-[#00e5ff]/8 text-[#c3f5ff]"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${mode === "live" ? "bg-[#9de32e]" : "bg-[#00e5ff]"}`}
            />
            {mode === "live" ? "VERIFIED RESPONSE" : "MOCK / READINESS"}
          </span>
        </div>

        <nav
          className="hidden items-stretch gap-6 self-stretch lg:flex"
          aria-label={t("nav.mainAria")}
        >
          {links.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-current={item.id === active ? "page" : undefined}
              className={`flex items-center border-b-2 px-0.5 text-sm transition ${
                item.id === active
                  ? "border-[#c3f5ff] font-semibold text-[#c3f5ff]"
                  : "border-transparent text-[#bac9cc] hover:text-[#dce4e5]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher compact variant="dapp" />
          <Link
            href="/app/settings"
            aria-label={t("nav.profile")}
            className="flex size-11 items-center justify-center rounded-full bg-[#c3f5ff] text-[#00363d] transition hover:ring-2 hover:ring-[#00e5ff]/50"
          >
            <DappIcon name="user" className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
