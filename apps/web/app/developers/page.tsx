"use client";

import Link from "next/link";
import { useT } from "../i18n/locale-context";
import { SiteHeader } from "../ui/site-header";

const example = `import { ChainVigilClient } from "@chainvigil/sdk";

const client = new ChainVigilClient({
  baseUrl: "http://localhost:4000",
});

const { report } = await client.checkToken({
  chain: "bsc",
  address: "0x...",
});

console.log(report.riskLevel, report.mode, report.confidence);`;

export default function DevelopersPage() {
  const t = useT();

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
    <main className="min-h-screen bg-[#0a0b0f] pb-16 text-[#e4e1ed]">
      <SiteHeader active="other" />

      <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <section className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#c0c1ff]">
            Developer Center · V0
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#f9fafb] md:text-5xl">
            Objective Security Infrastructure
          </h1>
          <p className="mt-4 text-base leading-7 text-[#9ca3af]">{t("dev.subtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/api"
              className="rounded-xl bg-[#c0c1ff] px-5 py-3 text-sm font-semibold text-[#1000a9]"
            >
              {t("dev.apiDocs")}
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-[#464554] px-5 py-3 text-sm font-semibold text-[#f9fafb]"
            >
              {t("dev.pricing")}
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[#f9fafb]">{t("dev.engines")}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {engines.map((engine) => (
              <article
                key={engine.name}
                className="rounded-2xl border border-[#262932] bg-[#16181d] p-5"
              >
                <span className="rounded-full bg-[#292932] px-2 py-1 text-[10px] text-[#9ca3af]">
                  {engine.tag}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[#f9fafb]">{engine.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{engine.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-[#f9fafb]">Quickstart</h2>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-[#262932] bg-[#0d0d15] p-4 text-xs leading-6 text-[#c0c1ff]">
            {example}
          </pre>
        </section>
      </div>
    </main>
  );
}
