import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerLocale } from "../../i18n/server";
import { getSiteUrl, localizedPath } from "../../lib/seo";
import { WebsiteFooter } from "../../ui/website-footer";
import { WebsiteHeader } from "../../ui/website-header";

const pages = {
  about: {
    zh: {
      title: "关于 ChainVigil",
      lead: "ChainVigil是一款面向全球用户的加密资产风险教育与只读检测产品。",
      sections: [
        [
          "我们解决什么",
          "帮助用户在买币或授权前核对合约地址、交易限制、合约权限与常见骗局信号。",
        ],
        [
          "边界",
          "风险结果不是投资建议，也不是绝对安全保证。链上状态会变化，用户应在交易前重新检测并独立复核。",
        ],
        [
          "团队原则",
          "不索取私钥，不自动交易；mock、降级和真实 Provider 数据状态必须清晰展示。",
        ],
      ],
    },
    en: {
      title: "About ChainVigil",
      lead: "ChainVigil is a crypto-risk education and read-only screening product built for global users.",
      sections: [
        [
          "What we solve",
          "We help users verify contract addresses, trading restrictions, privileges, and common scam signals before buying or approving.",
        ],
        [
          "Limits",
          "Results are not investment advice or a guarantee of safety. On-chain state changes; re-scan and verify independently.",
        ],
        [
          "Principles",
          "We never request private keys or auto-trade. Mock, degraded, and real-provider data states must remain explicit.",
        ],
      ],
    },
  },
  methodology: {
    zh: {
      title: "风险检测方法",
      lead: "结论由多源证据、规则分级、降级状态和时间戳共同构成。",
      sections: [
        [
          "数据来源",
          "优先使用链上 RPC、GoPlus、Honeypot.is 与内部复核标签。每个来源都可能超时或缺少字段。",
        ],
        [
          "风险分级",
          "禁买/高危用于明确的卖出失败、高税或危险权限；谨慎表示存在不确定项；低风险不等于无风险。",
        ],
        [
          "置信度",
          "只有真实数据源成功执行后才产生置信度。mock 报告始终标记 UNASSESSED。",
        ],
        [
          "更新与纠错",
          "报告带检测时间；如发现误报，请通过联系页面提交 CA、链、证据和检测时间。",
        ],
      ],
    },
    en: {
      title: "Risk methodology",
      lead: "Conclusions combine multi-source evidence, severity rules, degradation state, and timestamps.",
      sections: [
        [
          "Sources",
          "We prioritize on-chain RPC, GoPlus, Honeypot.is, and reviewed internal labels. Any source may time out or omit fields.",
        ],
        [
          "Risk levels",
          "Block/high cover clear sell failures, extreme taxes, or dangerous privileges. Caution means uncertainty. Low observed risk is not zero risk.",
        ],
        [
          "Confidence",
          "Confidence is assigned only after live sources execute. Mock reports always remain UNASSESSED.",
        ],
        [
          "Corrections",
          "Reports include scan time. To dispute a result, send the CA, chain, evidence, and scan timestamp through Contact.",
        ],
      ],
    },
  },
  privacy: {
    zh: {
      title: "隐私政策",
      lead: "我们以最少数据原则运行产品。",
      sections: [
        [
          "处理的数据",
          "可能处理查询的公开钱包/合约地址、基础访问日志、限流标识和用户主动提交的反馈。",
        ],
        [
          "不会收集",
          "绝不要求私钥、助记词或交易签名。请勿向任何人提交这些信息。",
        ],
        [
          "用途与保留",
          "数据用于提供检测、防滥用和改进产品；生产保留周期应按部署地区法规与内部策略配置。",
        ],
        [
          "全球用户",
          "不同地区可能拥有访问、更正或删除权。联系时请说明所在地区与请求内容。",
        ],
      ],
    },
    en: {
      title: "Privacy policy",
      lead: "We operate under a data-minimization principle.",
      sections: [
        [
          "Data processed",
          "Public wallet/contract queries, basic access logs, rate-limit identifiers, and feedback you choose to submit may be processed.",
        ],
        [
          "Never requested",
          "We never request private keys, seed phrases, or transaction signatures. Do not send them to anyone.",
        ],
        [
          "Use and retention",
          "Data supports screening, abuse prevention, and product improvement. Production retention must follow deployment-region law and internal policy.",
        ],
        [
          "Global users",
          "Regional rights may include access, correction, or deletion. State your region and request when contacting us.",
        ],
      ],
    },
  },
  terms: {
    zh: {
      title: "服务条款",
      lead: "使用本产品即表示你理解它是风险教育与辅助工具，而非金融建议。",
      sections: [
        [
          "无保证",
          "检测可能遗漏风险或产生误报；第三方数据源和链上状态也可能中断或变化。",
        ],
        [
          "用户责任",
          "你对自己的交易、授权、税务与合规决定负责。不要使用无法承受损失的资金。",
        ],
        [
          "禁止滥用",
          "不得绕过限流、攻击服务、批量抓取敏感接口或利用产品侵害他人。",
        ],
      ],
    },
    en: {
      title: "Terms of service",
      lead: "By using this product, you acknowledge it is a risk-education aid, not financial advice.",
      sections: [
        [
          "No guarantee",
          "Scans may miss risks or produce false positives. Third-party sources and on-chain state can fail or change.",
        ],
        [
          "Your responsibility",
          "You are responsible for transactions, approvals, tax, and compliance decisions. Never risk funds you cannot lose.",
        ],
        [
          "No abuse",
          "Do not bypass limits, attack the service, scrape restricted interfaces, or use the product to harm others.",
        ],
      ],
    },
  },
  "risk-disclosure": {
    zh: {
      title: "风险披露",
      lead: "ChainVigil 提供风险教育和只读辅助判断，不提供安全保证、交易执行或投资建议。",
      sections: [
        [
          "结果局限",
          "任何检测都可能遗漏风险、产生误报或因数据源不可用而降级；低风险观察不等于资产安全。",
        ],
        [
          "链上变化",
          "权限、流动性、税率和交易限制可能在报告生成后变化。操作前应重新检测并独立核验。",
        ],
        [
          "第三方来源",
          "GoPlus、Honeypot.is 与链上 RPC 等来源可能延迟、缺字段或中断；界面会区分 Mock、Readiness、Degraded 与可验证结果。",
        ],
        [
          "用户责任",
          "你需要自行评估交易、授权、税务、地区法规和资金损失风险。ChainVigil 不代替专业审计或法律意见。",
        ],
      ],
    },
    en: {
      title: "Risk disclosure",
      lead: "ChainVigil provides risk education and read-only decision support—not a security guarantee, transaction service, or investment advice.",
      sections: [
        [
          "Result limits",
          "Any scan can miss risks, produce false positives, or degrade when sources are unavailable. Low observed risk does not mean an asset is safe.",
        ],
        [
          "On-chain changes",
          "Privileges, liquidity, taxes, and trading restrictions may change after a report is produced. Re-scan and verify independently before acting.",
        ],
        [
          "Third-party sources",
          "GoPlus, Honeypot.is, and chain RPCs may be delayed, incomplete, or unavailable. The interface distinguishes Mock, Readiness, Degraded, and verifiable results.",
        ],
        [
          "Your responsibility",
          "You remain responsible for transactions, approvals, tax, regional compliance, and loss exposure. ChainVigil does not replace a professional audit or legal advice.",
        ],
      ],
    },
  },
  contact: {
    zh: {
      title: "联系与纠错",
      lead: "上线前请在部署环境配置公开支持邮箱；安全问题不要公开披露敏感细节。",
      sections: [
        ["报告纠错", "请提供链、CA、报告 URL、检测时间和可复核证据。"],
        [
          "安全披露",
          "请发送到部署时配置的 SECURITY_CONTACT；在修复前避免公开漏洞利用细节。",
        ],
        [
          "商务与媒体",
          "请使用部署时配置的 SUPPORT_EMAIL，并注明合作目的与地区。",
        ],
      ],
    },
    en: {
      title: "Contact and corrections",
      lead: "Configure a public support email before launch. Do not disclose sensitive security details publicly.",
      sections: [
        [
          "Report corrections",
          "Include chain, CA, report URL, scan time, and independently verifiable evidence.",
        ],
        [
          "Security disclosure",
          "Use the configured SECURITY_CONTACT and avoid publishing exploit details before remediation.",
        ],
        [
          "Business and media",
          "Use the configured SUPPORT_EMAIL and include purpose and region.",
        ],
      ],
    },
  },
} as const;

type TrustPage = keyof typeof pages;

function isTrustPage(value: string): value is TrustPage {
  return value in pages;
}

export function generateStaticParams() {
  return Object.keys(pages).map((trust) => ({ trust }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trust: string }>;
}): Promise<Metadata> {
  const { trust } = await params;
  if (!isTrustPage(trust)) return { robots: { index: false, follow: false } };
  const locale = await getServerLocale();
  const page = pages[trust][locale];
  const site = getSiteUrl();
  return {
    title: `${page.title}｜ChainVigil`,
    description: page.lead,
    alternates: {
      canonical: `${site}${localizedPath(locale, `/${trust}`)}`,
      languages: {
        "zh-CN": `${site}${localizedPath("zh", `/${trust}`)}`,
        en: `${site}${localizedPath("en", `/${trust}`)}`,
      },
    },
  };
}

export default async function TrustPageView({
  params,
}: {
  params: Promise<{ trust: string }>;
}) {
  const { trust } = await params;
  if (!isTrustPage(trust)) notFound();
  const locale = await getServerLocale();
  const page = pages[trust][locale];
  return (
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader />
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
          ChainVigil · Trust center · Read-only
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 items-center cv-font-mono text-xs font-semibold uppercase text-[#c3f5ff]"
        >
          ← ChainVigil
        </Link>
        <h1 className="mt-5 cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl">
          {page.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[#9dacad]">{page.lead}</p>
        <div className="mt-10 space-y-5">
          {page.sections.map(([title, body]) => (
            <section
              key={title}
              className="cv-website-panel border border-[#3b494c]/70 bg-[#0d1516]/88 p-5 sm:p-6"
            >
              <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">
                {title}
              </h2>
              <p className="mt-3 leading-7 text-[#9dacad]">{body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 cv-font-mono text-xs uppercase text-[#849396]">
          {locale === "zh"
            ? "最后更新：2026-08-10"
            : "Last updated: 2026-08-10"}
        </p>
      </article>
      <WebsiteFooter />
    </main>
  );
}
