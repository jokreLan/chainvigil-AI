"use client";

import Link from "next/link";
import { listTelegramCommands } from "@chainvigil/telegram";
import { useLocale } from "../i18n/locale-context";
import { DeveloperSubnav } from "../ui/developer-subnav";
import { WebsiteFooter } from "../ui/website-footer";
import { WebsiteHeader } from "../ui/website-header";

export default function BotPage() {
  const { locale, t } = useLocale();
  const commands = listTelegramCommands(locale);
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim();

  return (
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader active="bot" />
      <DeveloperSubnav active="bot" />
      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="max-w-4xl">
          <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
            {t("bot.kicker")} · Config-gated
          </p>
          <h1 className="mt-3 cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl lg:text-6xl">
            {t("bot.title")}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#9dacad] sm:text-lg">
            {t("bot.body")}
          </p>
          {botUsername ? (
            <a
              href={`https://t.me/${botUsername.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-11 items-center bg-[#00d9f2] px-5 cv-font-mono text-xs font-semibold uppercase text-[#002b31]"
            >
              {t("bot.open")}
            </a>
          ) : (
            <p className="mt-6 max-w-3xl [overflow-wrap:anywhere] border border-[#e7b900]/30 bg-[#e7b900]/6 px-4 py-3 text-sm leading-6 text-[#f3d36b]">
              {t("bot.unconfigured")}
            </p>
          )}
        </section>
        <section className="mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="cv-website-panel border border-[#3b494c]/70 bg-[#0d1516]/88 p-5 sm:p-6">
            <h2 className="cv-font-display text-2xl font-semibold text-[#dce4e5]">
              {t("bot.commands")}
            </h2>
            <div className="mt-4 space-y-3">
              {commands.map((item) => (
                <article
                  key={item.command}
                  className="border border-[#3b494c]/55 bg-[#071012] p-4"
                >
                  <code className="cv-font-mono text-[#c3f5ff]">
                    {item.command}
                  </code>
                  <p className="mt-2 text-sm leading-6 text-[#9dacad]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="cv-website-panel border border-[#3b494c]/70 bg-[#0d1516]/88 p-5">
              <p className="text-xs font-semibold text-[#9ca3af]">
                {t("bot.statusLabel")}
              </p>
              <p className="mt-3 cv-font-display text-lg font-semibold text-[#dce4e5]">
                {t("bot.statusTitle")}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#9dacad]">
                {t("bot.statusBody")}
              </p>
            </div>
            <div className="border border-[#e7b900]/25 bg-[#071012] p-5">
              <p className="cv-font-mono text-xs font-semibold uppercase text-[#f3d36b]">
                {t("bot.ownerLabel")}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#9dacad]">
                {t("bot.ownerBody")}
              </p>
              <Link
                href="/app/points"
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#f3d36b]"
              >
                {t("nav.points")}
              </Link>
            </div>
          </aside>
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
