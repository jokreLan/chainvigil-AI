"use client";

import { listMockUserPreferenceSettings } from "@chainvigil/risk-core";
import { useLocale } from "../../i18n/locale-context";
import { WorkspaceHeader } from "../../ui/workspace-header";
import { WorkspaceMobileNav } from "../../ui/workspace-mobile-nav";
import { LanguageSwitcher } from "../../ui/language-switcher";

export default function SettingsPage() {
  const { locale, t } = useLocale();
  const settings = listMockUserPreferenceSettings(locale);
  const category = {
    language: t("settings.catLang"),
    risk_alert: t("settings.catAlert"),
    profile: t("settings.catProfile"),
    privacy: t("settings.catPrivacy"),
  } as const;

  return (
    <main className="cv-workspace-page min-h-screen pb-24 text-[#e4e1ed] md:pb-10">
      <WorkspaceHeader />
      <div className="mx-auto max-w-4xl px-5 py-9 md:px-8">
        <section>
          <p className="text-sm font-semibold text-[#c0c1ff]">Preference preview</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">{t("settings.title")}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">{t("settings.subtitle")}</p>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm text-[#9ca3af]">{t("settings.headerHint")}</span>
            <LanguageSwitcher compact variant="dapp" />
          </div>
        </section>
        <section className="mt-8 space-y-4">
          {settings.map((item) => (
            <article key={item.id} className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#c0c1ff]">
                    {category[item.category]}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[#f9fafb]">{item.title}</h2>
                </div>
                <span className="rounded-lg border border-[#464554] px-3 py-2 text-xs text-[#9ca3af]">
                  {item.editableInV0 ? t("common.editable") : t("common.v0Readonly")}
                </span>
              </div>
              <p className="mt-4 rounded-lg bg-[#1b1b23] px-4 py-3 text-sm text-[#e4e1ed]">
                {item.valueLabel}
              </p>
              <p className="mt-4 leading-7 text-[#9ca3af]">{item.description}</p>
            </article>
          ))}
        </section>
        <section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-5 text-sm leading-7 text-[#9ca3af]">
          {t("settings.footer")}
        </section>
      </div>
      <WorkspaceMobileNav />
    </main>
  );
}
