"use client";

import Link from "next/link";
import { listMockAssetCleanupPolicies } from "@chainvigil/risk-core";
import { useLocale } from "../../i18n/locale-context";
import { MobileNav } from "../../ui/mobile-nav";
import { SiteHeader } from "../../ui/site-header";

export default function ApprovalCleanerPage() {
  const { locale, t } = useLocale();
  const policies = listMockAssetCleanupPolicies(locale).filter(
    (policy) => policy.flow === "approval_cleaner",
  );
  const policy = policies[0];

  if (!policy) return null;

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-10">
      <SiteHeader active="wallet" />

      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8">
        <section className="rounded-xl border border-[#262932] bg-[#16181d] p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <div className="flex size-24 shrink-0 items-center justify-center rounded-full border-8 border-[#292932] text-2xl font-semibold text-[#f59e0b]">
                --
              </div>
              <div>
                <p className="text-sm font-semibold text-[#c0c1ff]">{t("approvals.title")}</p>
                <h1 className="mt-1 text-2xl font-semibold text-[#f9fafb]">{t("cleaner.waitingTitle")}</h1>
                <p className="mt-2 text-sm text-[#9ca3af]">{t("cleaner.waitingBody")}</p>
              </div>
            </div>
            <Link
              href="/wallet-check"
              className="rounded-lg bg-[#c0c1ff] px-5 py-3 text-center text-sm font-semibold text-[#1000a9]"
            >
              {t("cleaner.viewScope")}
            </Link>
          </div>
        </section>

        <section className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#262932] bg-[#1b1b23] p-4 text-sm text-[#c7c4d7]">
          <span className="rounded-lg border border-[#262932] bg-[#16181d] px-3 py-2">BNB Smart Chain</span>
          <span className="rounded-lg border border-[#262932] bg-[#16181d] px-3 py-2">
            {t("cleaner.highOnly")}
          </span>
          <span className="rounded-lg border border-[#262932] bg-[#16181d] px-3 py-2">
            {t("cleaner.infinitePending")}
          </span>
          <span className="ml-auto text-xs text-[#9ca3af]">{t("cleaner.noWallet")}</span>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#f97316]">{t("cleaner.protect")}</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#f9fafb]">{t("cleaner.mustConfirm")}</h2>
            </div>
            <span className="rounded bg-[#f97316]/10 px-3 py-1 text-xs font-semibold text-[#f97316]">
              {t("common.readonlyPolicy")}
            </span>
          </div>
          <article className="mt-5 rounded-xl border border-[#262932] bg-[#16181d] p-5 md:p-6">
            <h3 className="text-xl font-semibold text-[#f9fafb]">{policy.title}</h3>
            <p className="mt-3 max-w-3xl leading-7 text-[#c7c4d7]">{policy.description}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-lg bg-[#1b1b23] p-5">
                <h4 className="font-semibold text-[#c0c1ff]">{t("cleaner.checks")}</h4>
                <ul className="mt-4 space-y-3 text-sm text-[#c7c4d7]">
                  {policy.requiredChecks.map((check) => (
                    <li key={check} className="border-b border-[#262932] pb-3">
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-[#ef4444]/25 bg-[#ef4444]/5 p-5">
                <h4 className="font-semibold text-[#ef4444]">{t("cleaner.prohibited")}</h4>
                <ul className="mt-4 space-y-3 text-sm text-[#c7c4d7]">
                  {policy.prohibitedActions.map((action) => (
                    <li key={action} className="border-b border-[#ef4444]/15 pb-3">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-6">
          <h2 className="text-xl font-semibold text-[#f9fafb]">{t("cleaner.whyTitle")}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#9ca3af]">{t("cleaner.whyBody")}</p>
        </section>
      </div>
      <MobileNav active="wallet" />
    </main>
  );
}
