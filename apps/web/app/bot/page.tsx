"use client";

import Link from "next/link";
import { listTelegramCommands } from "@chainvigil/telegram";
import { useLocale } from "../i18n/locale-context";
import { SiteHeader } from "../ui/site-header";
import { MobileNav } from "../ui/mobile-nav";

export default function BotPage() {
  const { locale, t } = useLocale();
  const commands = listTelegramCommands(locale);
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim();

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-0 pb-28 md:px-8">
      <SiteHeader active="bot" />
      <div className="mx-auto max-w-5xl py-6">
        <section className="mx-auto mt-12 max-w-5xl">
          <p className="text-sm font-semibold text-[#c0c1ff]">{t("bot.kicker")}</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#f9fafb]">{t("bot.title")}</h1>
          <p className="mt-4 max-w-3xl leading-8 text-[#c7c4d7]">{t("bot.body")}</p>
          {botUsername ? (
            <a
              href={`https://t.me/${botUsername.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#8083ff] px-5 text-sm font-semibold text-[#0d0096]"
            >
              {t("bot.open")}
            </a>
          ) : (
            <p className="mt-5 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3 py-2 text-sm text-[#fde68a]">
              {t("bot.unconfigured")}
            </p>
          )}
        </section>
        <section className="mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="rounded-lg border border-[#34343d] bg-[#16181d] p-5">
            <h2 className="text-xl font-semibold text-[#f9fafb]">{t("bot.commands")}</h2>
            <div className="mt-4 space-y-3">
              {commands.map((item) => (
                <article key={item.command} className="rounded-md border border-[#262932] bg-[#0d0d15] p-4">
                  <code className="font-mono text-[#c0c1ff]">{item.command}</code>
                  <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
              <p className="text-xs font-semibold text-[#9ca3af]">{t("bot.statusLabel")}</p>
              <p className="mt-3 text-lg font-semibold text-[#f9fafb]">{t("bot.statusTitle")}</p>
              <p className="mt-3 text-sm leading-6 text-[#c7c4d7]">{t("bot.statusBody")}</p>
            </div>
            <div className="rounded-lg border border-[#eab308]/25 bg-[#16181d] p-5">
              <p className="text-xs font-semibold text-[#eab308]">{t("bot.ownerLabel")}</p>
              <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{t("bot.ownerBody")}</p>
              <Link href="/app/points" className="mt-3 inline-block text-sm font-semibold text-[#eab308]">
                {t("nav.points")}
              </Link>
            </div>
          </aside>
        </section>
      </div>
      <MobileNav active="home" />
    </main>
  );
}
