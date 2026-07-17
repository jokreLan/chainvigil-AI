"use client";

import Link from "next/link";
import { useT } from "./i18n/locale-context";
import { CheckForm } from "./ui/check-form";
import { MobileNav } from "./ui/mobile-nav";
import { SiteHeader } from "./ui/site-header";

export default function HomePage() {
  const t = useT();

  const defenseModules = [
    {
      title: t("module.honeypot"),
      description: t("module.honeypotDesc"),
      href: "/risk-database",
      icon: "!",
      tone: "text-[#fca5a5] bg-[#ef4444]/10",
    },
    {
      title: t("module.blacklist"),
      description: t("module.blacklistDesc"),
      href: "/risk-database",
      icon: "⊘",
      tone: "text-[#ddb7ff] bg-[#6f00be]/15",
    },
    {
      title: t("module.lp"),
      description: t("module.lpDesc"),
      href: "/risk-database",
      icon: "▣",
      tone: "text-[#ffb783] bg-[#d97721]/15",
    },
    {
      title: t("module.backdoor"),
      description: t("module.backdoorDesc"),
      href: "/risk-database",
      icon: "⌁",
      tone: "text-[#6ee7b7] bg-[#10b981]/10",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28">
      <SiteHeader active="home" />

      <div className="mx-auto max-w-lg px-4 pt-10 md:max-w-xl md:pt-14">
        <section className="text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#f9fafb] sm:text-5xl">
            {t("home.title1")}
            <br />
            <span className="ai-gradient-text">{t("home.title2")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#c7c4d7] sm:text-base">
            {t("home.subtitle")}
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <CheckForm compact showWalletLink />
        </section>

        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#f9fafb]">{t("home.alertTitle")}</h2>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[#fde68a]">
              {t("home.alertMock")}
            </span>
          </div>
          <div className="ai-glow-card rounded-2xl border border-[#ef4444]/35 bg-[#16181d] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-[#ef4444]/15 text-[#fca5a5]">
                  ✕
                </span>
                <div>
                  <p className="font-semibold text-[#f9fafb]">Honeypot Token</p>
                  <p className="mt-1 font-mono text-xs text-[#9ca3af]">0x71C...492E</p>
                </div>
              </div>
              <span className="rounded-full border border-[#ef4444]/40 bg-[#ef4444]/10 px-2.5 py-1 text-xs font-semibold text-[#fca5a5]">
                {t("home.alertBadge")}
              </span>
            </div>
            <div className="mt-4 rounded-xl border border-[#262932] bg-[#0d0d15]/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#c0c1ff]">
                {t("home.aiDiag")}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#f9fafb]">{t("home.aiDiagBody")}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-[#262932] bg-[#0d0d15] px-3 py-2 text-[#fca5a5]">
                {t("module.honeypot")}
              </div>
              <div className="rounded-lg border border-[#262932] bg-[#0d0d15] px-3 py-2 text-[#fde68a]">
                Sell tax 99%
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 text-base font-semibold text-[#f9fafb]">{t("home.moduleTitle")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {defenseModules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="rounded-2xl border border-[#262932] bg-[#0d0d15] p-4 transition hover:border-[#464554]"
              >
                <span
                  aria-hidden
                  className={`flex size-10 items-center justify-center rounded-xl text-lg font-semibold ${module.tone}`}
                >
                  {module.icon}
                </span>
                <p className="mt-4 font-semibold text-[#f9fafb]">{module.title}</p>
                <p className="mt-2 text-xs leading-5 text-[#9ca3af]">{module.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <Link
          href="/app/points"
          className="mt-8 mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[#eab308]/35 bg-gradient-to-r from-[#16181d] to-[#1a1810] p-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#eab308]/15 text-[#eab308]">
              ★
            </span>
            <div>
              <p className="font-semibold text-[#eab308]">{t("home.vpTitle")}</p>
              <p className="mt-0.5 text-xs text-[#9ca3af]">{t("home.vpDesc")}</p>
            </div>
          </div>
          <span className="text-[#eab308]">›</span>
        </Link>
      </div>

      <MobileNav active="home" />
    </main>
  );
}
