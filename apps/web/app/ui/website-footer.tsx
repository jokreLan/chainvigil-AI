"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { DappIcon } from "./dapp-icon";

export function WebsiteFooter() {
  const { locale } = useLocale();
  const columns = [
    {
      title: locale === "zh" ? "资源" : "Resources",
      links: [
        [locale === "zh" ? "关于" : "About", "/about"],
        [locale === "zh" ? "方法论" : "Methodology", "/methodology"],
        [locale === "zh" ? "学习中心" : "Learn", "/learn"],
      ],
    },
    {
      title: locale === "zh" ? "法律" : "Legal",
      links: [
        [locale === "zh" ? "隐私政策" : "Privacy Policy", "/privacy"],
        [locale === "zh" ? "服务条款" : "Terms of Service", "/terms"],
        [locale === "zh" ? "风险披露" : "Risk Disclosure", "/risk-disclosure"],
      ],
    },
    {
      title: locale === "zh" ? "支持" : "Support",
      links: [
        [locale === "zh" ? "联系我们" : "Contact", "/contact"],
        [locale === "zh" ? "开发者" : "Developers", "/developers"],
        ["API", "/api"],
      ],
    },
  ] as const;

  return (
    <footer className="border-t border-[#3b494c]/45 bg-[#060c0e] px-5 py-12 text-[#bac9cc] sm:px-8">
      <div className="mx-auto grid max-w-[1536px] gap-10 md:grid-cols-[1.5fr_2fr]">
        <div>
          <Link href="/" className="inline-flex min-h-11 items-center gap-3 cv-font-display text-xl font-semibold text-[#dce4e5]">
            <span className="grid size-9 place-items-center border border-[#00e5ff]/30 text-[#c3f5ff]">
              <DappIcon name="shield" className="size-5" />
            </span>
            ChainVigil
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#849396]">
            {locale === "zh"
              ? "只读 V0 风险教育与 mock/readiness 参考。结果不构成正式安全审计、交易保证或投资建议。"
              : "Read-only V0 risk education and mock/readiness reference. Results are not a formal audit, trading guarantee, or investment advice."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="cv-font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#c3f5ff]">{column.title}</h2>
              <div className="mt-4 grid gap-2.5 text-sm">
                {column.links.map(([label, href]) => (
                  <Link key={href} href={href} className="flex min-h-11 items-center transition hover:text-[#dce4e5]">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1536px] flex-wrap justify-between gap-3 border-t border-[#3b494c]/35 pt-5 cv-font-mono text-[11px] uppercase tracking-[0.08em] text-[#849396]">
        <span>© 2026 ChainVigil</span>
        <span>V0 Read-only · Mock/Readiness · SOL/BNB</span>
      </div>
    </footer>
  );
}
