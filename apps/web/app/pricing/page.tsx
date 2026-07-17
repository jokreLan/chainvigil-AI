"use client";

import Link from "next/link";
import { getPointProgram } from "@chainvigil/points";
import { useLocale } from "../i18n/locale-context";
import { SiteHeader } from "../ui/site-header";

export default function PricingPage() {
  const { locale, t } = useLocale();
  const program = getPointProgram(locale);

  const plans = [
    {
      name: "Free",
      price: "¥0",
      blurb: t("pricing.freeBlurb"),
      features: [t("pricing.freeF1"), t("pricing.freeF2"), t("pricing.freeF3"), t("pricing.freeF4")],
      cta: { href: "/check", label: t("pricing.freeCta") },
      highlight: false,
    },
    {
      name: "Pro",
      price: "¥19–49/mo",
      blurb: t("pricing.proBlurb"),
      features: [
        t("pricing.proF1"),
        t("pricing.proF2"),
        t("pricing.proF3"),
        `${t("pricing.proF4")} ${program.cashOffsetCapPercent}%`,
      ],
      cta: { href: "/app/points", label: t("pricing.proCta") },
      highlight: true,
    },
    {
      name: t("pricing.groupName"),
      price: "¥99–399/mo",
      blurb: t("pricing.groupBlurb"),
      features: [t("pricing.groupF1"), t("pricing.groupF2"), t("pricing.groupF3"), t("pricing.groupF4")],
      cta: { href: "/bot", label: t("pricing.groupCta") },
      highlight: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-16 text-[#e4e1ed]">
      <SiteHeader active="other" />
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <section>
          <p className="text-sm font-semibold text-[#c0c1ff]">Pricing · second engine ready</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">{t("pricing.title")}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#9ca3af]">
            {t("pricing.subtitle")} {program.tagline}
          </p>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-xl border bg-[#16181d] p-6 ${
                plan.highlight
                  ? "border-[#8083ff]/50 shadow-[0_0_0_1px_rgba(128,131,255,0.2)]"
                  : "border-[#262932]"
              }`}
            >
              <h2 className="text-2xl font-semibold text-[#f9fafb]">{plan.name}</h2>
              <p className="mt-3 text-3xl font-semibold text-[#c0c1ff]">{plan.price}</p>
              <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{plan.blurb}</p>
              <ul className="mt-5 space-y-3 text-[#c7c4d7]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-[#8083ff]">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={`mt-8 flex min-h-11 items-center justify-center rounded-lg text-sm font-semibold ${
                  plan.highlight
                    ? "bg-[#c0c1ff] text-[#1000a9]"
                    : "border border-[#464554] text-[#f9fafb]"
                }`}
              >
                {plan.cta.label}
              </Link>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-[#eab308]/25 bg-[#1b1b23] p-5 text-sm leading-7 text-[#c7c4d7]">
          <p className="font-semibold text-[#eab308]">{t("pricing.vpCash")}</p>
          <p className="mt-2">
            {program.disclaimer} {t("pricing.vpCashBody")} {program.cashOffsetCapPercent}%.
          </p>
        </section>

        <section className="mt-6 rounded-xl border border-[#262932] bg-[#16181d] p-5 text-sm leading-7 text-[#9ca3af]">
          {t("pricing.apiNote")}{" "}
          <Link href="/api" className="text-[#c0c1ff]">
            {t("common.apiList")}
          </Link>
          .
        </section>
      </div>
    </main>
  );
}
