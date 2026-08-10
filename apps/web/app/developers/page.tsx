"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { CopyValueButton } from "../ui/copy-value-button";
import { DeveloperSubnav } from "../ui/developer-subnav";
import { WebsiteFooter } from "../ui/website-footer";
import { WebsiteHeader } from "../ui/website-header";

const example = `import { ChainVigilClient } from "@chainvigil/sdk";

const client = new ChainVigilClient({
  baseUrl: process.env.CHAINVIGIL_API_URL!,
});

const { report } = await client.checkToken({
  chain: "bsc",
  address: "0x...",
});

console.log(report.riskLevel, report.mode, report.confidence);`;

export default function DevelopersPage() {
  const { locale, t } = useLocale();

  const engines = [
    {
      name: "Token Risk API",
      description: t("dev.tokenApi"),
      tag: t("dev.tokenTag"),
    },
    {
      name: "Wallet Approval API",
      description: t("dev.walletApi"),
      tag: t("dev.walletTag"),
    },
    {
      name: "Fake Token / Intel API",
      description: t("dev.intelApi"),
      tag: t("dev.intelTag"),
    },
  ];

  return (
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader active="developers" />
      <DeveloperSubnav active="developers" />

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="max-w-3xl">
          <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
            Developer Center · V0 contract · Readiness
          </p>
          <h1 className="mt-3 cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl lg:text-6xl">
            Objective Security Infrastructure
          </h1>
          <p className="mt-5 text-base leading-7 text-[#9dacad] sm:text-lg">
            {t("dev.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/api"
              className="inline-flex min-h-11 items-center bg-[#00d9f2] px-5 cv-font-mono text-xs font-semibold uppercase text-[#002b31]"
            >
              {t("dev.apiDocs")}
            </Link>
            <Link
              href="/pricing"
              className="inline-flex min-h-11 items-center border border-[#3b494c] px-5 cv-font-mono text-xs font-semibold uppercase text-[#dce4e5]"
            >
              {t("dev.pricing")}
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="cv-font-display text-2xl font-semibold text-[#dce4e5]">
            {t("dev.engines")}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {engines.map((engine) => (
              <article
                key={engine.name}
                className="cv-website-panel border border-[#3b494c]/70 bg-[#0d1516]/88 p-5"
              >
                <span className="border border-[#3b494c] bg-[#071012] px-2 py-1 cv-font-mono text-[10px] uppercase text-[#849396]">
                  {engine.tag}
                </span>
                <h3 className="mt-3 cv-font-display text-lg font-semibold text-[#dce4e5]">
                  {engine.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#9dacad]">
                  {engine.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="cv-font-display text-2xl font-semibold text-[#dce4e5]">
                Quickstart
              </h2>
              <p className="mt-2 text-sm text-[#849396]">
                {locale === "zh"
                  ? "将 CHAINVIGIL_API_URL 设置为你的 API 部署地址。"
                  : "Set CHAINVIGIL_API_URL to your deployed API origin."}
              </p>
            </div>
            <CopyValueButton
              value={example}
              label={locale === "zh" ? "复制示例" : "Copy example"}
              className="border-[#3b494c] text-[#bac9cc]"
            />
          </div>
          <pre className="mt-4 overflow-x-auto border border-[#3b494c] bg-[#071012] p-5 cv-font-mono text-xs leading-6 text-[#c3f5ff]">
            <code>{example}</code>
          </pre>
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
