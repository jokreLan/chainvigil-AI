"use client";

import { useT } from "../i18n/locale-context";
import { CheckForm } from "../ui/check-form";
import { MobileNav } from "../ui/mobile-nav";
import { SiteHeader } from "../ui/site-header";

export function CheckPageClient({ fromTask }: { fromTask: boolean }) {
  const t = useT();

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28 md:pb-12">
      <SiteHeader active="check" />
      <div className="mx-auto max-w-lg px-4 py-12 md:max-w-xl md:py-16">
        <section className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c0c1ff]">
            Token security scan
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#f9fafb]">{t("check.title")}</h1>
          <p className="mt-4 text-sm leading-7 text-[#c7c4d7]">{t("check.subtitle")}</p>
          {fromTask ? (
            <p className="mt-3 text-xs text-[#eab308]">{t("check.fromTask")}</p>
          ) : null}
        </section>
        <section className="mt-8 rounded-2xl border border-[#34343d] bg-[#16181d] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.28)] md:p-8">
          <CheckForm compact showWalletLink fromTask={fromTask} />
        </section>
      </div>
      <MobileNav active="home" />
    </main>
  );
}
