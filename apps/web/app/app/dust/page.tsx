"use client";

import Link from "next/link";
import { listMockAssetCleanupPolicies } from "@chainvigil/risk-core";
import { useLocale } from "../../i18n/locale-context";
import { MobileNav } from "../../ui/mobile-nav";
import { SiteHeader } from "../../ui/site-header";

export default function DustPage() {
  const { locale, t } = useLocale();
  const policy = listMockAssetCleanupPolicies(locale).find((item) => item.flow === "dust_scan");
  if (!policy) return null;

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-10">
      <SiteHeader active="other" />
      <div className="mx-auto max-w-6xl px-5 py-9 md:px-8">
        <section>
          <p className="text-sm font-semibold text-[#c0c1ff]">Read-only policy</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">{t("dust.title")}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">{t("dust.subtitle")}</p>
          <Link href="/app/asset-barber" className="mt-4 inline-block text-sm font-semibold text-[#c0c1ff]">
            {t("wallet.assetBarber")}
          </Link>
        </section>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
            <p className="text-sm text-[#9ca3af]">{t("dust.scanStatus")}</p>
            <p className="mt-3 text-xl font-semibold text-[#f59e0b]">{t("dust.waiting")}</p>
          </article>
          <article className="rounded-xl border border-[#262932] bg-[#16181d] p-5">
            <p className="text-sm text-[#9ca3af]">{t("dust.policy")}</p>
            <p className="mt-3 text-xl font-semibold text-[#c0c1ff]">{t("dust.manual")}</p>
          </article>
          <article className="rounded-xl border border-[#ef4444]/30 bg-[#16181d] p-5">
            <p className="text-sm text-[#9ca3af]">{t("dust.exec")}</p>
            <p className="mt-3 text-xl font-semibold text-[#ef4444]">{t("dust.closed")}</p>
          </article>
        </section>
        <section className="mt-8 rounded-xl border border-[#262932] bg-[#16181d] p-6">
          <h2 className="text-2xl font-semibold text-[#f9fafb]">{policy.title}</h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#c7c4d7]">{policy.description}</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div className="rounded-lg bg-[#1b1b23] p-5">
              <h3 className="font-semibold text-[#c0c1ff]">{t("dust.checks")}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {policy.requiredChecks.map((check) => (
                  <span key={check} className="rounded bg-[#292932] px-3 py-2 text-sm text-[#c7c4d7]">
                    {check}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-[#ef4444]/25 bg-[#ef4444]/5 p-5">
              <h3 className="font-semibold text-[#ef4444]">{t("dust.blocked")}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {policy.prohibitedActions.map((action) => (
                  <span
                    key={action}
                    className="rounded border border-[#ef4444]/25 px-3 py-2 text-sm text-[#c7c4d7]"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-6">
          <h2 className="text-xl font-semibold text-[#f9fafb]">{t("dust.whyTitle")}</h2>
          <p className="mt-3 leading-7 text-[#9ca3af]">{t("dust.whyBody")}</p>
        </section>
      </div>
      <MobileNav active="wallet" />
    </main>
  );
}
