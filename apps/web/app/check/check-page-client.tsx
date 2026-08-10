"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { CheckForm } from "../ui/check-form";
import { ConsumerMobileNav } from "../ui/consumer-mobile-nav";
import { DappHeader } from "../ui/dapp-header";
import { DappIcon } from "../ui/dapp-icon";
import { ProviderCoverage } from "../ui/provider-coverage";
import { VigilCore } from "../ui/vigil-core";
import { WalletCheckForm } from "../ui/wallet-check-form";

export function CheckPageClient({ fromTask }: { fromTask: boolean }) {
  const { locale, t } = useLocale();
  const isZh = locale === "zh";

  return (
    <main className="cv-dapp-page min-h-screen pb-24 md:pb-0">
      <DappHeader active="scan" />

      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-[1120px] flex-col px-4 py-6 md:justify-center md:py-12">
        <div className="flex flex-col items-center">
          <div className="md:hidden">
            <VigilCore compact />
          </div>
          <div className="hidden md:block">
            <VigilCore />
          </div>

          <div className="-mt-5 flex flex-col items-center text-center md:-mt-28">
            <div className="inline-flex items-center gap-2 rounded-md bg-[#242b2d] px-3 py-1.5 cv-font-mono text-[10px] text-[#bac9cc] md:hidden">
              <span className="size-1.5 rounded-full bg-[#00e5ff]" />
              Vigil Core · MOCK / READINESS
            </div>
            <h1 className="mt-4 cv-font-display text-2xl font-semibold tracking-[-0.02em] text-[#dce4e5] md:mt-0 md:text-4xl">
              {isZh ? "Vigil Core｜只读安全检查" : "Vigil Core | Read-only security check"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#bac9cc] md:text-base">
              {isZh
                ? "输入公开合约或钱包地址。系统会明确标记 Mock、降级与未配置来源，不连接钱包，不代你执行链上操作。"
                : "Enter a public contract or wallet address. Mock, degraded, and unconfigured sources stay explicit. No wallet connection or on-chain execution."}
            </p>
            {fromTask ? <p className="mt-2 text-xs text-[#9de32e]">{t("check.fromTask")}</p> : null}
          </div>

          <div className="mt-7 grid w-full gap-4 md:mt-10 md:grid-cols-2 md:gap-6">
            <section className="cv-dapp-panel p-5 md:p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="cv-font-display text-xl font-semibold text-[#c3f5ff]">{t("nav.check")}</h2>
                  <span className="cv-font-mono text-[10px] uppercase text-[#00e5ff]">SOL / BNB</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#bac9cc]">
                  {isZh
                    ? "输入合约地址或项目 URL，检查蜜罐、权限、税费、流动性与风险证据。"
                    : "Check honeypot, privilege, tax, liquidity, and risk evidence from a contract address or project URL."}
                </p>
              </div>
              <CheckForm compact fromTask={fromTask} variant="dapp" hideSupportingText />
              <Link
                href="/wallet-check"
                className="mt-3 flex min-h-14 items-center justify-center gap-2 rounded-lg border border-[#c3f5ff]/25 bg-[#242b2d] cv-font-display font-semibold text-[#c3f5ff] md:hidden"
              >
                <DappIcon name="wallet" className="size-5" />
                {t("nav.wallet")}
              </Link>
            </section>

            <section className="cv-dapp-panel hidden p-6 md:block">
              <div className="mb-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="cv-font-display text-xl font-semibold text-[#c3f5ff]">{t("nav.wallet")}</h2>
                  <span className="cv-font-mono text-[10px] uppercase text-[#00e5ff]">BNB · READ-ONLY</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#bac9cc]">
                  {isZh
                    ? "输入公开钱包地址，只读分析资产风险、授权暴露与交互历史。"
                    : "Enter a public wallet address for read-only asset, approval, and interaction analysis."}
                </p>
              </div>
              <WalletCheckForm variant="dapp" />
            </section>
          </div>

          <div className="mt-7 w-full md:hidden">
            <ProviderCoverage mode="mock" chain="bnb" variant="strip" />
          </div>

          <Link
            href="/app"
            className="mt-6 hidden min-h-11 items-center gap-2 cv-font-mono text-xs uppercase tracking-[0.08em] text-[#bac9cc] transition hover:text-[#c3f5ff] md:flex"
          >
            <DappIcon name="terminal" className="size-4" />
            {isZh ? "进入高级工作台" : "Open advanced workspace"}
          </Link>

          <p className="mt-6 flex max-w-3xl items-start gap-2 text-xs leading-5 text-[#849396] md:hidden">
            <DappIcon name="alert" className="mt-0.5 size-4 shrink-0" />
            {isZh
              ? "目前支持 Solana 与 BNB Chain。风险检查基于可用证据，不构成投资建议，也不能保证资产绝对安全。"
              : "Supports Solana and BNB Chain. Results depend on available evidence, are not investment advice, and never guarantee safety."}
          </p>
        </div>
      </section>

      <footer className="hidden border-t border-[#3b494c]/25 bg-[#0d1516] py-6 md:block">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-6 px-4 text-xs text-[#849396]">
          <div className="flex flex-wrap gap-6 cv-font-mono">
            <span>GoPlus</span>
            <span>Honeypot.is</span>
            <span>Solana RPC</span>
            <span>BNB Chain RPC</span>
          </div>
          <p className="text-right">© 2026 ChainVigil · MOCK / READINESS · {t("report.disclaimer")}</p>
        </div>
      </footer>

      <ConsumerMobileNav active="scan" />
    </main>
  );
}
