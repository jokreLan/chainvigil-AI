"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { DappIcon, type DappIconName } from "./dapp-icon";

type WorkspaceNavId = "overview" | "wallets" | "reports" | "points";

export function WorkspaceMobileNav({ active }: { active?: WorkspaceNavId }) {
  const { locale, t } = useLocale();
  const links: Array<{ id: WorkspaceNavId; href: string; label: string; icon: DappIconName }> = [
    { id: "overview", href: "/app", label: t("nav.home"), icon: "home" },
    { id: "wallets", href: "/app/wallets", label: t("nav.walletShort"), icon: "wallet" },
    { id: "reports", href: "/app/reports", label: t("nav.reports"), icon: "document" },
    { id: "points", href: "/app/points", label: locale === "zh" ? "贡献" : "Points", icon: "radar" },
  ];
  return (
    <nav aria-label={locale === "zh" ? "工作台导航" : "Workspace navigation"} className="fixed inset-x-0 bottom-0 z-40 border-t border-[#3b494c]/55 bg-[#0d1516]/96 px-2 cv-bottom-nav-safe backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {links.map((link) => {
          const selected = active === link.id;
          return <Link key={link.id} href={link.href} aria-current={selected ? "page" : undefined} className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] ${selected ? "text-[#00e5ff]" : "text-[#bac9cc]"}`}>
            <DappIcon name={link.icon} className="size-5" />
            <span>{link.label}</span>
            {selected ? <span className="absolute inset-x-4 bottom-0 h-0.5 bg-[#00e5ff]" /> : null}
          </Link>;
        })}
      </div>
    </nav>
  );
}
