"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["About", "/about"],
  ["Methodology", "/methodology"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Contact", "/contact"],
] as const;

export function TrustFooter() {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/(zh|en)(?=\/|$)/, "") || "/";
  const isProductSurface =
    normalizedPath === "/" ||
    normalizedPath === "/solana" ||
    normalizedPath === "/bnb" ||
    normalizedPath === "/intel" ||
    normalizedPath === "/risk-database" ||
    normalizedPath === "/fake-token-database" ||
    normalizedPath.startsWith("/leaderboard/") ||
    normalizedPath === "/learn" ||
    normalizedPath.startsWith("/learn/") ||
    ["/pricing", "/developers", "/api", "/bot"].includes(normalizedPath) ||
    [
      "/about",
      "/methodology",
      "/privacy",
      "/terms",
      "/risk-disclosure",
      "/contact",
    ].includes(normalizedPath) ||
    normalizedPath === "/check" ||
    normalizedPath === "/approvals" ||
    normalizedPath === "/wallet-check" ||
    normalizedPath.startsWith("/token/") ||
    normalizedPath.startsWith("/wallet/") ||
    normalizedPath === "/app" ||
    normalizedPath.startsWith("/app/");

  if (isProductSurface) return null;

  return (
    <footer className="border-t border-[#262932] bg-[#0a0b0f] px-5 py-7 text-xs text-[#9ca3af]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <p>© 2026 ChainVigil · Risk education, not investment advice.</p>
        <nav
          className="flex flex-wrap gap-x-4 gap-y-2"
          aria-label="Trust and legal"
        >
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-[#f9fafb]">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
