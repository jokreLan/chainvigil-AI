"use client";

import Link from "next/link";
import { useState } from "react";
import type { GrowthChannel } from "@chainvigil/types";
import { useT } from "../../i18n/locale-context";
import { WorkspaceHeader } from "../../ui/workspace-header";
import { WorkspaceMobileNav } from "../../ui/workspace-mobile-nav";
import { useToast } from "../../ui/toast";

export function GrowthClient({
  channels,
  confirmedVp,
  pendingVp,
  visits,
  checks,
  referralLink,
}: {
  channels: GrowthChannel[];
  confirmedVp: number;
  pendingVp: number;
  visits: number;
  checks: number;
  referralLink: string;
}) {
  const t = useT();
  const { pushToast } = useToast();
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      pushToast(t("growth.copiedLink"), "success");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      pushToast(t("growth.copyFail"), "error");
    }
  }

  return (
    <main className="cv-workspace-page min-h-screen pb-28 text-[#e4e1ed]">
      <WorkspaceHeader desktopActive="points" />

      <div className="mx-auto max-w-lg px-4 py-8 md:max-w-xl">
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#eab308]">Growth Center</p>
          <h1 className="mt-2 text-3xl font-bold text-[#f9fafb]">{t("growth.title")}</h1>
          <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{t("growth.subtitle")}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-[#262932] bg-[#16181d] p-5">
          <h2 className="text-sm font-semibold text-[#f9fafb]">Your Referral Link</h2>
          <p className="mt-1 text-xs text-[#9ca3af]">{t("growth.linkHint")}</p>
          <div className="mt-4 flex gap-2">
            <code className="min-w-0 flex-1 truncate rounded-xl border border-[#34343d] bg-[#0d0d15] px-3 py-3 font-mono text-xs text-[#c0c1ff]">
              {referralLink}
            </code>
            <button
              type="button"
              onClick={() => void copyLink()}
              className="flex min-h-11 shrink-0 items-center rounded-xl bg-[#8083ff] px-4 text-xs font-bold text-[#0d0096]"
            >
              {copied ? t("common.copied") : t("growth.copyLink")}
            </button>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3">
          {[
            ["Confirmed VP", confirmedVp, "#eab308"],
            ["Pending VP", pendingVp, "#f59e0b"],
            [t("growth.visits"), visits, "#c0c1ff"],
            [t("growth.checks"), checks, "#10b981"],
          ].map(([label, value, color]) => (
            <article key={String(label)} className="rounded-2xl border border-[#262932] bg-[#16181d] p-4">
              <p className="text-xs text-[#9ca3af]">{label}</p>
              <p className="mt-2 text-2xl font-semibold" style={{ color: String(color) }}>
                {value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-6">
          <h2 className="text-base font-semibold text-[#f9fafb]">{t("growth.tools")}</h2>
          <div className="mt-3 space-y-2">
            <ToolRow title="Channel Codes" desc={t("growth.toolChannels")} href="/app/growth" />
            <ToolRow title={t("nav.bot")} desc={t("growth.toolBot")} href="/bot" />
            <ToolRow title={t("nav.points")} desc={t("growth.toolPerks")} href="/app/points" />
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#f9fafb]">{t("growth.channels")}</h2>
            <span className="text-[11px] text-[#9ca3af]">
              {channels.length === 0 ? t("common.empty") : t("common.v0Readonly")}
            </span>
          </div>
          {channels.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-dashed border-[#464554] bg-[#16181d] p-6 text-center">
              <p className="text-sm text-[#c7c4d7]">{t("growth.empty")}</p>
              <Link href="/check" className="mt-3 inline-block text-sm font-semibold text-[#c0c1ff]">
                {t("growth.emptyCta")}
              </Link>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {channels.map((channel) => (
                <article key={channel.id} className="rounded-2xl border border-[#262932] bg-[#16181d] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-[#f9fafb]">{channel.name}</h3>
                    <span className="rounded bg-[#292932] px-2 py-1 font-mono text-[11px] text-[#c7c4d7]">
                      {channel.referralCode}
                    </span>
                  </div>
                  <p className="mt-1 text-xs uppercase text-[#9ca3af]">{channel.type}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[#c7c4d7]">
                    <p>
                      {t("growth.visits")} {channel.effectiveVisits}
                    </p>
                    <p>
                      {t("growth.checks")} {channel.effectiveCaChecks}
                    </p>
                    <p className="text-[#f59e0b]">
                      {t("common.pending")} {channel.pendingVp}
                    </p>
                    <p className="text-[#eab308]">
                      {t("common.confirmed")} {channel.confirmedVp}
                    </p>
                  </div>
                  <p className="mt-3 border-t border-[#262932] pt-3 text-xs leading-5 text-[#9ca3af]">
                    {channel.note}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      <WorkspaceMobileNav active="points" />
    </main>
  );
}

function ToolRow({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-2xl border border-[#262932] bg-[#16181d] px-4 py-3"
    >
      <div>
        <p className="font-semibold text-[#f9fafb]">{title}</p>
        <p className="mt-0.5 text-xs text-[#9ca3af]">{desc}</p>
      </div>
      <span className="text-[#c0c1ff]">›</span>
    </Link>
  );
}
