"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav({ active }: { active: "home" | "wallet" | "database" | "points" }) {
  const pathname = usePathname();
  const publicLinks = [
    { id: "home", href: "/", label: "首页" },
    { id: "wallet", href: "/wallet-check", label: "钱包" },
    { id: "database", href: "/risk-database", label: "风险库" },
    { id: "points", href: "/app/points", label: "VP" },
  ] as const;
  const workspaceLinks = [
    { id: "home", href: "/app", label: "工作台" },
    { id: "wallet", href: "/app/wallets", label: "钱包" },
    { id: "database", href: "/app/reports", label: "报告" },
    { id: "points", href: "/app/points", label: "VP" },
  ] as const;
  const links = pathname === "/app" || pathname.startsWith("/app/") ? workspaceLinks : publicLinks;

  return <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-[#262932] bg-[#16181d] px-4 py-3 text-xs md:hidden">{links.map((link) => <Link key={link.id} href={link.href} className={link.id === active ? "font-semibold text-[#c0c1ff]" : "text-[#9ca3af]"}>{link.label}</Link>)}</nav>;
}
