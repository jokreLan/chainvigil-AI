"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { DappIcon } from "./dapp-icon";
import { LanguageSwitcher } from "./language-switcher";

type WorkspaceActive =
  "overview" | "wallets" | "reports" | "monitor" | "points";

export function WorkspaceHeader({
  desktopActive,
}: {
  desktopActive?: WorkspaceActive;
}) {
  const { locale } = useLocale();
  const modules = [
    [locale === "zh" ? "授权检查" : "Approvals", "/app/approvals"],
    [locale === "zh" ? "风险监控" : "Monitor", "/app/monitor"],
    [locale === "zh" ? "资产理发师" : "Asset Barber", "/app/asset-barber"],
    [locale === "zh" ? "推广中心" : "Growth", "/app/growth"],
    [locale === "zh" ? "偏好与隐私" : "Settings", "/app/settings"],
  ] as const;
  const desktopLinks = [
    ["overview" as const, locale === "zh" ? "总览" : "Overview", "/app"],
    ["wallets" as const, locale === "zh" ? "钱包" : "Wallets", "/app/wallets"],
    ["reports" as const, locale === "zh" ? "报告" : "Reports", "/app/reports"],
    ["monitor" as const, locale === "zh" ? "监控" : "Monitor", "/app/monitor"],
    ["points" as const, "Vigil Points", "/app/points"],
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-[#3b494c]/55 bg-[#061012]/95 backdrop-blur lg:block">
        <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-8">
          <Link
            href="/app"
            className="flex min-h-11 items-center gap-2.5 cv-font-display text-lg font-semibold text-[#dce4e5]"
          >
            <span className="grid size-9 place-items-center bg-[#00d9f2] text-[#00363d]">
              <DappIcon name="shield" className="size-5" />
            </span>
            ChainVigil{" "}
            <span className="cv-font-mono text-[10px] font-normal uppercase text-[#849396]">
              Workspace
            </span>
          </Link>
          <div className="flex min-h-16 items-stretch gap-7">
            {desktopLinks.map(([id, label, href]) => (
              <Link
                key={id}
                href={href}
                aria-current={desktopActive === id ? "page" : undefined}
                className={`relative flex items-center cv-font-mono text-xs uppercase ${desktopActive === id ? "text-[#00e5ff]" : "text-[#bac9cc] hover:text-[#dce4e5]"}`}
              >
                {label}
                {desktopActive === id ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#00e5ff]" />
                ) : null}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher compact variant="dapp" />
            <Link
              href="/check"
              className="inline-flex min-h-11 items-center bg-[#c3f5ff] px-4 cv-font-mono text-xs font-semibold uppercase text-[#00363d]"
            >
              {locale === "zh" ? "开始安检" : "Start audit"}
            </Link>
          </div>
        </nav>
      </header>
      <header className="sticky top-0 z-40 border-b border-[#3b494c]/55 bg-[#061012]/95 px-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex min-h-16 max-w-lg items-center justify-between gap-3">
          <Link
            href="/app"
            className="flex min-h-11 items-center gap-2 cv-font-display text-lg font-semibold text-[#dce4e5]"
          >
            <span className="grid size-9 place-items-center bg-[#00d9f2] text-[#00363d]">
              <DappIcon name="shield" className="size-5" />
            </span>
            ChainVigil
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact variant="dapp" />
            <details className="group relative">
              <summary className="grid size-11 cursor-pointer list-none place-items-center border border-[#3b494c] text-[#c3f5ff] [&::-webkit-details-marker]:hidden">
                <span className="sr-only">
                  {locale === "zh" ? "工作台模块" : "Workspace modules"}
                </span>
                <span className="grid grid-cols-2 gap-1" aria-hidden>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <span
                      key={index}
                      className="size-1.5 border border-current"
                    />
                  ))}
                </span>
              </summary>
              <nav className="absolute right-0 top-12 w-64 border border-[#3b494c] bg-[#0d1516] p-2 shadow-2xl">
                {modules.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex min-h-11 items-center border-b border-[#3b494c]/45 px-3 cv-font-mono text-xs uppercase text-[#bac9cc] last:border-0"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
