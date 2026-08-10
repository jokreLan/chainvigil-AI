"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { ConsumerMobileNav } from "../ui/consumer-mobile-nav";
import { DappHeader } from "../ui/dapp-header";
import { DappIcon } from "../ui/dapp-icon";
import { ProviderCoverage } from "../ui/provider-coverage";
import { VigilCore } from "../ui/vigil-core";
import { WalletCheckForm } from "../ui/wallet-check-form";

export default function WalletCheckPage() {
  const { locale, t } = useLocale();
  const isZh = locale === "zh";

  const reasons = [
    {
      title: isZh ? "授权暴露" : "Approval exposure",
      description: isZh ? "识别无限授权、未知 spender 与长期未使用授权。" : "Review unlimited approvals, unknown spenders, and stale grants.",
      icon: "shield" as const,
      tone: "text-[#ffb4ab]",
    },
    {
      title: isZh ? "可疑资产" : "Suspicious assets",
      description: isZh ? "标记可疑空投 Token 与未知资产，不自动隐藏或处理。" : "Flag suspicious airdrops and unknown assets without changing the wallet.",
      icon: "alert" as const,
      tone: "text-[#ffc775]",
    },
    {
      title: isZh ? "数据覆盖" : "Data coverage",
      description: isZh ? "逐项展示 Provider 可用、未配置、降级和不适用状态。" : "See available, unconfigured, degraded, and not-applicable providers.",
      icon: "radar" as const,
      tone: "text-[#00e5ff]",
    },
  ];

  return (
    <main className="cv-dapp-page min-h-screen pb-24 md:pb-10">
      <DappHeader active="wallet" />

      <div className="mx-auto max-w-[1120px] px-4 py-8 md:py-12">
        <section className="flex flex-col items-center text-center">
          <VigilCore compact />
          <p className="-mt-4 cv-font-mono text-[10px] uppercase tracking-[0.08em] text-[#00e5ff]">
            BNB Smart Chain · READ-ONLY
          </p>
          <h1 className="mt-3 cv-font-display text-3xl font-semibold tracking-[-0.02em] text-[#dce4e5] md:text-4xl">
            {t("wallet.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#bac9cc] md:text-base">{t("wallet.subtitle")}</p>
        </section>

        <section className="cv-dapp-panel mx-auto mt-8 max-w-2xl p-5 md:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="cv-font-display text-lg font-semibold text-[#c3f5ff]">
                {isZh ? "公开钱包地址" : "Public wallet address"}
              </p>
              <p className="mt-1 text-xs text-[#849396]">{t("wallet.readonly")}</p>
            </div>
            <DappIcon name="wallet" className="size-6 text-[#00e5ff]" />
          </div>
          <WalletCheckForm variant="dapp" />
          <p className="mt-4 text-xs leading-5 text-[#849396]">{t("wallet.privacy")}</p>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-3">
          {reasons.map((item) => (
            <article key={item.title} className="cv-dapp-panel p-4">
              <DappIcon name={item.icon} className={`size-5 ${item.tone}`} />
              <h2 className="mt-3 cv-font-display font-semibold text-[#dce4e5]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#bac9cc]">{item.description}</p>
            </article>
          ))}
        </section>

        <div className="mt-8">
          <ProviderCoverage mode="mock" chain="bnb" variant="strip" />
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/check" className="flex min-h-11 items-center gap-2 cv-font-mono text-xs uppercase tracking-[0.08em] text-[#bac9cc] hover:text-[#c3f5ff]">
            <DappIcon name="scan" className="size-4" />
            {isZh ? "改查合约地址" : "Check a contract instead"}
          </Link>
        </div>
      </div>

      <ConsumerMobileNav active="wallet" />
    </main>
  );
}
