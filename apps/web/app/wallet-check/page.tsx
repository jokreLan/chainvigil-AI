"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { MobileNav } from "../ui/mobile-nav";
import { SiteHeader } from "../ui/site-header";
import { WalletCheckForm } from "../ui/wallet-check-form";

export default function WalletCheckPage() {
  const { locale, t } = useLocale();
  const isZh = locale === "zh";

  const reasons = [
    {
      title: isZh ? "授权风险" : "Approval risk",
      description: isZh
        ? "识别无限授权、未知 spender 与长期未使用授权，先读后写。"
        : "Spot unlimited approvals, unknown spenders, and stale grants — read before write.",
      tone: "border-l-[#ef4444]",
      href: "/app/approval-cleaner",
    },
    {
      title: isZh ? "垃圾资产" : "Spam assets",
      description: isZh
        ? "标记可疑空投 Token / Spam NFT，避免误点钓鱼链接。"
        : "Flag suspicious airdrop tokens / spam NFTs before you click phishing links.",
      tone: "border-l-[#f97316]",
      href: "/app/asset-barber",
    },
    {
      title: isZh ? "高危持仓" : "Risky holdings",
      description: isZh
        ? "对持仓 Token 做买前安检式摘要，提示貔貅与权限风险。"
        : "Buy-before style summary on holdings — honeypot and privilege risks.",
      tone: "border-l-[#f59e0b]",
      href: "/check",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0b0f] pb-28">
      <SiteHeader active="wallet" />

      <div className="mx-auto max-w-lg px-4 pt-10 md:max-w-xl">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight ai-gradient-text">{t("wallet.title")}</h1>
          <p className="mt-4 text-sm leading-7 text-[#c7c4d7]">{t("wallet.subtitle")}</p>
          <p className="mt-2 text-xs text-[#6b7280]">{t("wallet.readonly")}</p>
        </section>

        <section className="mt-8 rounded-2xl border border-[#262932] bg-[#16181d] p-5">
          <div className="mb-4 flex justify-center gap-3">
            {["EVM", "BNB", "BASE", "ARB"].map((chain, i) => (
              <span
                key={chain}
                className={`flex size-10 items-center justify-center rounded-full border text-[10px] font-semibold ${
                  i === 1
                    ? "border-[#8083ff] bg-[#8083ff]/15 text-[#c0c1ff]"
                    : "border-[#34343d] text-[#9ca3af]"
                }`}
              >
                {chain}
              </span>
            ))}
          </div>
          <WalletCheckForm />
          <p className="mt-4 text-center text-[11px] leading-5 text-[#9ca3af]">{t("wallet.privacy")}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-center text-sm font-semibold tracking-wide text-[#9ca3af]">
            {t("wallet.why")}
          </h2>
          <div className="mt-5 space-y-3">
            {reasons.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`block rounded-2xl border border-[#262932] border-l-4 bg-[#16181d] p-4 ${item.tone}`}
              >
                <p className="font-semibold text-[#f9fafb]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#c7c4d7]">{item.description}</p>
                <p className="mt-3 text-xs font-semibold text-[#c0c1ff]">{t("intel.open")}</p>
              </Link>
            ))}
          </div>
        </section>

        <Link
          href="/app/points"
          className="mt-8 mb-4 flex items-center justify-between rounded-2xl border border-[#eab308]/30 bg-[#16181d] p-4"
        >
          <p className="text-sm text-[#c7c4d7]">
            {isZh ? (
              <>
                贡献安全报告可获得 <span className="font-semibold text-[#eab308]">哨点 VP</span>
              </>
            ) : (
              <>
                Earn <span className="font-semibold text-[#eab308]">Vigil Points</span> by contributing
              </>
            )}
          </p>
          <span className="text-xs font-semibold text-[#eab308]">{t("points.goCheck")}</span>
        </Link>
      </div>
      <MobileNav active="wallet" />
    </main>
  );
}
