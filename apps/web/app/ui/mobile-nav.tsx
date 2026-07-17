"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "../i18n/locale-context";

export function MobileNav({ active }: { active: "home" | "wallet" | "database" | "points" }) {
  const pathname = usePathname();
  const t = useT();
  const publicLinks = [
    { id: "home" as const, href: "/", label: t("nav.home") },
    { id: "wallet" as const, href: "/wallet-check", label: t("nav.walletShort") },
    { id: "database" as const, href: "/intel", label: t("nav.database") },
    { id: "points" as const, href: "/app/points", label: t("nav.pointsShort") },
  ];
  const workspaceLinks = [
    { id: "home" as const, href: "/app", label: t("nav.home") },
    { id: "wallet" as const, href: "/app/wallets", label: t("nav.walletShort") },
    { id: "database" as const, href: "/app/reports", label: t("nav.database") },
    { id: "points" as const, href: "/app/points", label: t("nav.pointsShort") },
  ];
  const links = pathname === "/app" || pathname.startsWith("/app/") ? workspaceLinks : publicLinks;

  return (
    <nav
      aria-label={t("nav.mainAria")}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#1f1f27] bg-[#0a0b0f]/95 px-2 pt-1.5 backdrop-blur-md cv-bottom-nav-safe md:hidden"
    >
      <div className="mx-auto flex max-w-lg items-end justify-around">
        {links.map((link) => {
          const isActive = link.id === active;
          return (
            <Link
              key={link.id}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-12 min-w-14 flex-col items-center justify-center gap-0.5 text-[11px] ${
                isActive ? "font-semibold text-[#c0c1ff]" : "text-[#9ca3af]"
              }`}
            >
              <span
                className={
                  isActive
                    ? "flex size-10 items-center justify-center rounded-2xl bg-[#8083ff] text-[#0d0096] shadow-[0_8px_20px_rgba(128,131,255,0.35)]"
                    : "flex size-10 items-center justify-center"
                }
              >
                <NavIcon name={link.id} active={isActive} />
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function NavIcon({
  name,
  active,
}: {
  name: "home" | "wallet" | "database" | "points";
  active: boolean;
}) {
  const stroke = active ? "currentColor" : "currentColor";
  const paths = {
    home: (
      <>
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="5" width="16" height="14" rx="2" />
        <path d="M19 9h2v6h-2M15 12h.01" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
      </>
    ),
    points: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m12 7 1.5 3.2 3.5.4-2.6 2.4.7 3.4-3.1-1.8-3.1 1.8.7-3.4-2.6-2.4 3.5-.4Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      {paths[name]}
    </svg>
  );
}
