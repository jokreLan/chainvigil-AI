"use client";

import Link from "next/link";
import { getPointProgram } from "@chainvigil/points";
import { useLocale } from "../i18n/locale-context";
import { DeveloperSubnav } from "../ui/developer-subnav";
import { WebsiteFooter } from "../ui/website-footer";
import { WebsiteHeader } from "../ui/website-header";

export default function PricingPage() {
  const { locale, t } = useLocale();
  const program = getPointProgram(locale);

  const plans = [
    {
      name: "Free",
      price: "$0 / ¥0",
      status: locale === "zh" ? "当前可用" : "AVAILABLE NOW",
      blurb: t("pricing.freeBlurb"),
      features: [
        t("pricing.freeF1"),
        t("pricing.freeF2"),
        t("pricing.freeF3"),
        t("pricing.freeF4"),
      ],
      cta: { href: "/check", label: t("pricing.freeCta") },
      highlight: false,
    },
    {
      name: "Pro",
      price: locale === "zh" ? "待定" : "TBD",
      status: locale === "zh" ? "预览 · 未开放收银" : "PREVIEW · NO CHECKOUT",
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
      price: locale === "zh" ? "待定" : "TBD",
      status: locale === "zh" ? "预览 · 商务未开放" : "PREVIEW · NOT FOR SALE",
      blurb: t("pricing.groupBlurb"),
      features: [
        t("pricing.groupF1"),
        t("pricing.groupF2"),
        t("pricing.groupF3"),
        t("pricing.groupF4"),
      ],
      cta: { href: "/bot", label: t("pricing.groupCta") },
      highlight: false,
    },
  ];

  return (
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader active="pricing" />
      <DeveloperSubnav active="pricing" />
      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section>
          <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
            Pricing preview · Global-ready · No checkout
          </p>
          <h1 className="mt-3 cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl lg:text-6xl">
            {t("pricing.title")}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#9dacad] sm:text-lg">
            {t("pricing.subtitle")} {program.tagline}
          </p>
          <p className="mt-5 max-w-3xl border border-[#e7b900]/30 bg-[#e7b900]/6 px-4 py-3 text-sm leading-6 text-[#f3d36b]">
            {locale === "zh"
              ? "当前仅 Free 路径可直接使用。Pro、群商业版、地区价格、税费与支付方式尚未发布，本页不会发起付款。"
              : "Only the Free path is available now. Pro, group plans, regional pricing, taxes, and payment methods are not published; this page cannot initiate payment."}
          </p>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`cv-website-panel border bg-[#0d1516]/88 p-6 ${
                plan.highlight
                  ? "border-[#00d9f2]/55 shadow-[0_0_0_1px_rgba(0,217,242,0.16)]"
                  : "border-[#3b494c]/70"
              }`}
            >
              <p className="cv-font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#00d9f2]">
                {plan.status}
              </p>
              <h2 className="mt-3 cv-font-display text-2xl font-semibold text-[#dce4e5]">
                {plan.name}
              </h2>
              <p className="mt-3 cv-font-display text-3xl font-semibold text-[#c3f5ff]">
                {plan.price}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#9dacad]">
                {plan.blurb}
              </p>
              <ul className="mt-5 space-y-3 text-[#bac9cc]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-[#00d9f2]">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.cta.href}
                className={`mt-8 flex min-h-11 items-center justify-center px-4 cv-font-mono text-xs font-semibold uppercase ${
                  plan.highlight
                    ? "bg-[#00d9f2] text-[#002b31]"
                    : "border border-[#3b494c] text-[#dce4e5]"
                }`}
              >
                {plan.cta.label}
              </Link>
            </article>
          ))}
        </section>

        <section className="mt-8 border border-[#e7b900]/25 bg-[#071012] p-5 text-sm leading-7 text-[#9dacad]">
          <p className="font-semibold text-[#f3d36b]">{t("pricing.vpCash")}</p>
          <p className="mt-2">
            {program.disclaimer} {t("pricing.vpCashBody")}{" "}
            {program.cashOffsetCapPercent}%.
          </p>
        </section>

        <section className="mt-6 border border-[#3b494c] bg-[#0d1516] p-5 text-sm leading-7 text-[#9dacad]">
          <p>{t("pricing.apiNote")}.</p>
          <Link
            href="/api"
            className="mt-3 inline-flex min-h-11 items-center cv-font-mono text-xs font-semibold uppercase text-[#c3f5ff]"
          >
            {t("common.apiList")} →
          </Link>
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
