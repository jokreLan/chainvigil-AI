"use client";

import Link from "next/link";
import { useLocale } from "./i18n/locale-context";
import { CheckForm } from "./ui/check-form";
import { DappIcon } from "./ui/dapp-icon";
import { WebsiteFooter } from "./ui/website-footer";
import { WebsiteHeader } from "./ui/website-header";

export default function HomePage() {
  const { locale, t } = useLocale();
  const zh = locale === "zh";
  const samples = [
    {
      name: "PEPE2.0 / WBNB",
      address: "0x742d…44e",
      badge: zh ? "样例 · 貔貅信号" : "Sample · Honeypot signal",
      tone: "border-[#fda4af]/65 text-[#fda4af]",
    },
    {
      name: "DOGEAI / SOL",
      address: "So11…392",
      badge: zh ? "样例 · Mint 权限" : "Sample · Mint authority",
      tone: "border-[#f9c56a]/65 text-[#f9c56a]",
    },
    {
      name: "SAFE / USDT",
      address: "0x1a2…99f",
      badge: zh ? "样例 · 未见高危信号" : "Sample · No high-risk signal",
      tone: "border-[#9de32e]/65 text-[#9de32e]",
    },
  ];

  const shortcuts = [
    {
      title: zh ? "钱包体检" : "Wallet Health",
      desc: zh ? "公开地址只读分析，无连接、无签名。" : "Read-only public address analysis. No connect or signature.",
      href: "/wallet-check",
      icon: "shield" as const,
      enabled: true,
    },
    {
      title: zh ? "风险数据库" : "Risk Database",
      desc: zh ? "历史骗局结构与风险教育样例。" : "Historical scam structures and educational samples.",
      href: "/risk-database",
      icon: "alert" as const,
      enabled: true,
    },
    {
      title: zh ? "学习中心" : "Learn",
      desc: zh ? "面向 Web3 用户的安全操作手册。" : "Practical Web3 security guides for users.",
      href: "/learn",
      icon: "document" as const,
      enabled: true,
    },
    {
      title: "Telegram Bot",
      desc: zh ? "自动提醒能力取决于实际配置。" : "Automated alerts depend on actual configuration.",
      href: "/bot",
      icon: "terminal" as const,
      enabled: false,
    },
  ];

  return (
    <main className="cv-website-page min-h-screen pb-20 md:pb-0">
      <WebsiteHeader active="home" />

      <div className="border-b border-[#3b494c]/55 px-4 py-2 sm:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 cv-font-mono text-[10px] uppercase tracking-[0.08em] text-[#849396]">
          <span className="inline-flex min-h-8 items-center gap-2 border border-[#3b494c] bg-[#151d1e] px-2">
            <span className="size-1.5 bg-[#9de32e]" /> Mock-readiness
          </span>
          <span className="inline-flex min-h-8 items-center border border-[#3b494c] px-2">No wallet</span>
          <Link href="/check" className="inline-flex min-h-11 items-center border border-[#c3f5ff]/40 px-2 text-[#c3f5ff]">DApp</Link>
        </div>
      </div>

      <section className="border-b border-[#3b494c]/45 px-4 py-12 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto max-w-[1040px] text-center">
          <div className="inline-flex min-h-9 items-center gap-2 border border-[#3b494c] bg-[#0d1516]/85 px-3 cv-font-mono text-[10px] uppercase tracking-[0.12em] text-[#c3f5ff] sm:text-xs">
            <span className="size-2 rounded-full bg-[#849396] shadow-[0_0_10px_rgba(195,245,255,0.45)]" />
            {zh ? "只读 / 无钱包 / 无签名 / 无交易 / Mock-readiness" : "Read-only / No wallet / No signature / No trade / Mock-readiness"}
          </div>
          <h1 className="mx-auto mt-7 max-w-4xl cv-font-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#dce4e5] sm:text-6xl lg:text-7xl">
            {zh ? "交互前先查 CA/证据" : "Audit before interaction."}
          </h1>
          <p className="mt-4 cv-font-display text-xl font-semibold text-[#849396] sm:text-3xl">
            {zh ? "Audit before interaction." : "交互前先查 CA/证据"}
          </p>
          <p className="mx-auto mt-7 max-w-3xl text-sm leading-7 text-[#bac9cc] sm:text-base">
            {zh
              ? "V0 提供只读 SOL / BNB 风险检查、mock/readiness 报告与风险教育；仅当已配置证据 Provider 成功响应时才展示对应证据。结果不是正式安全审计或投资建议。"
              : "V0 provides read-only SOL / BNB checks, mock/readiness reports, and risk education. Evidence appears only when a configured provider responds successfully. Results are not a formal audit or investment advice."}
          </p>

          <div className="cv-website-panel mx-auto mt-8 max-w-4xl p-4 text-left sm:p-2">
            <CheckForm compact={false} variant="website" hideSupportingText />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 cv-font-mono text-[11px] uppercase text-[#849396]">
            <span className="mr-1">{zh ? "支持网络" : "Supported networks"}:</span>
            <span className="inline-flex min-h-8 items-center gap-2 border border-[#3b494c] bg-[#151d1e] px-3 text-[#dce4e5]"><span className="size-2 rounded-full bg-[#19e59b]" />Solana</span>
            <span className="inline-flex min-h-8 items-center gap-2 border border-[#3b494c] bg-[#151d1e] px-3 text-[#dce4e5]"><span className="size-2 rounded-full bg-[#f3ba2f]" />BNB Chain</span>
          </div>
        </div>
      </section>

      <section className="border-b border-[#3b494c]/45 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1536px] flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <DappIcon name="shield" className="mt-0.5 size-6 shrink-0 text-[#9de32e]" />
            <div>
              <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">{zh ? "只读钱包体检" : "Read-Only Wallet Health"}</h2>
              <p className="mt-1 text-sm leading-6 text-[#bac9cc]">{zh ? "公开 BNB 地址只读分析；不连接钱包、不请求签名。" : "Read-only public BNB address analysis. No wallet connection or signature."}</p>
            </div>
          </div>
          <Link href="/wallet-check" className="inline-flex min-h-11 items-center justify-center border border-[#3b494c] px-5 cv-font-mono text-xs font-semibold uppercase text-[#c3f5ff] transition hover:border-[#c3f5ff]">
            {zh ? "启动体检" : "Launch checker"}
          </Link>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1536px] gap-5 lg:grid-cols-[2fr_1fr]">
          <article className="cv-website-panel p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3b494c]/55 pb-4">
              <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">{zh ? "风险教育样例" : "Mock Risk Examples"}</h2>
              <span className="border border-[#3b494c] px-2 py-1 cv-font-mono text-[10px] uppercase text-[#849396]">{t("home.alertMock")} · {zh ? "非实时列表" : "Not a live list"}</span>
            </div>
            <div className="mt-4 divide-y divide-[#3b494c]/50 border-y border-[#3b494c]/50">
              {samples.map((sample) => (
                <Link key={sample.name} href="/risk-database" className="flex min-h-20 items-center justify-between gap-4 px-3 py-3 transition hover:bg-[#151d1e]">
                  <div>
                    <p className="cv-font-mono text-sm font-semibold text-[#dce4e5]">{sample.name}</p>
                    <p className="mt-1 cv-font-mono text-xs text-[#849396]">{sample.address}</p>
                  </div>
                  <span className={`border px-2 py-1 text-right cv-font-mono text-[10px] uppercase ${sample.tone}`}>{sample.badge}</span>
                </Link>
              ))}
            </div>
          </article>

          <article className="cv-website-panel p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <DappIcon name="radar" className="size-7 text-[#c3f5ff]" />
              <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">{t("home.vpTitle")}</h2>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#bac9cc]">
              {zh ? "VP 仅为产品内权益积分，用于衡量教育参与度；不可提现、不可转让，不是代币、投资或收益产品。" : "VP are internal utility points for educational participation. They are non-withdrawable, non-transferable, and are not tokens, investments, or yield."}
            </p>
            <dl className="mt-6 grid gap-2 cv-font-mono text-xs">
              <div className="flex justify-between border border-[#3b494c]/55 bg-[#081012] px-3 py-2"><dt>Status</dt><dd className="text-[#849396]">Non-financial</dd></div>
              <div className="flex justify-between border border-[#3b494c]/55 bg-[#081012] px-3 py-2"><dt>Transferable</dt><dd className="text-[#fda4af]">False</dd></div>
            </dl>
          </article>
        </div>

        <div className="mx-auto mt-8 grid max-w-[1536px] grid-cols-2 border-l border-t border-[#3b494c] md:grid-cols-4">
          {shortcuts.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              aria-disabled={!item.enabled}
              className={`min-h-44 border-b border-r border-[#3b494c] p-5 transition ${item.enabled ? "bg-[#0d1516]/80 hover:bg-[#151d1e]" : "pointer-events-none bg-[#242b2d]/55 opacity-50"}`}
            >
              <span className="grid size-9 place-items-center border border-[#3b494c] text-[#c3f5ff]"><DappIcon name={item.icon} className="size-5" /></span>
              <h2 className="mt-5 cv-font-display text-base font-semibold text-[#dce4e5]">{item.title}</h2>
              <p className="mt-2 text-xs leading-5 text-[#849396]">{item.desc}</p>
              {!item.enabled ? <span className="mt-3 inline-block cv-font-mono text-[9px] uppercase">Not configured</span> : null}
            </Link>
          ))}
        </div>

        <article className="cv-website-panel mx-auto mt-12 max-w-[1100px]">
          <div className="flex items-center justify-between border-b border-[#3b494c] px-4 py-3 cv-font-mono text-[10px] uppercase tracking-[0.08em] text-[#849396]">
            <span>{zh ? "证据来源矩阵" : "Evidence Sources Matrix"}</span>
            <span>{zh ? "状态取决于配置" : "Configuration dependent"}</span>
          </div>
          <div className="grid sm:grid-cols-2">
            {[
              ["GoPlus Security", "Readiness", "#9de32e"],
              ["Honeypot.is", "Mock", "#f9c56a"],
              ["Solana RPC (Read)", "Readiness", "#9de32e"],
              ["BNB RPC (Read)", "Degraded", "#fda4af"],
            ].map(([name, status, color]) => (
              <div key={name} className="flex min-h-14 items-center justify-between border-b border-r border-[#3b494c]/55 px-4 cv-font-mono text-xs">
                <span className="inline-flex items-center gap-2"><span className="size-2" style={{ background: color }} />{name}</span>
                <span className="border border-[#3b494c] px-2 py-1 text-[9px] uppercase text-[#849396]">{status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <WebsiteFooter />

      <Link href="/check" className="fixed inset-x-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex min-h-14 items-center justify-center gap-2 bg-[#c3f5ff] cv-font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#00363d] shadow-[0_0_22px_rgba(0,229,255,0.32)] md:hidden">
        <DappIcon name="shield" className="size-5" /> {zh ? "安检 CA（查 CA）" : "Audit CA"}
      </Link>
    </main>
  );
}
