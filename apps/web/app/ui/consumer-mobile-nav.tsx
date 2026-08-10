"use client";

import Link from "next/link";
import { useT } from "../i18n/locale-context";
import { DappIcon, type DappIconName } from "./dapp-icon";

type ConsumerNavItem = "scan" | "reports" | "wallet" | "monitor" | "profile";

const links: Array<{ id: ConsumerNavItem; href: string; icon: DappIconName }> = [
  { id: "scan", href: "/check", icon: "shield" },
  { id: "reports", href: "/app/reports", icon: "document" },
  { id: "wallet", href: "/wallet-check", icon: "wallet" },
  { id: "monitor", href: "/app/monitor", icon: "chart" },
  { id: "profile", href: "/app/settings", icon: "user" },
];

export function ConsumerMobileNav({ active }: { active: ConsumerNavItem }) {
  const t = useT();
  const labels: Record<ConsumerNavItem, string> = {
    scan: t("nav.scan"),
    reports: t("nav.reports"),
    wallet: t("nav.walletShort"),
    monitor: t("nav.monitor"),
    profile: t("nav.profile"),
  };

  return (
    <nav
      aria-label={t("nav.mainAria")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#3b494c]/45 bg-[#151d1e]/96 px-1 pt-1.5 backdrop-blur-xl cv-bottom-nav-safe md:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {links.map((link) => {
          const isActive = active === link.id;
          return (
            <Link
              key={link.id}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 px-1 cv-font-display text-[10px] font-semibold leading-none transition ${
                isActive
                  ? "text-[#00e5ff]"
                  : "text-[#bac9cc] hover:text-[#dce4e5]"
              }`}
            >
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center text-current"
              >
                <DappIcon name={link.icon} className="size-6" />
              </span>
              <span className="max-w-full truncate">{labels[link.id]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
