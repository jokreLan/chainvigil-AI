import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerLocale } from "../../i18n/server";
import { getSiteUrl, localizedPath } from "../../lib/seo";

const pages = {
  about: {
    zh: {
      title: "关于 ChainVigil AI",
      lead: "ChainVigil AI（链哨 AI）是一款面向全球用户的加密资产风险教育与只读检测产品。",
      sections: [
        ["我们解决什么", "帮助用户在买币或授权前核对合约地址、交易限制、合约权限与常见骗局信号。"],
        ["边界", "风险结果不是投资建议，也不是绝对安全保证。链上状态会变化，用户应在交易前重新检测并独立复核。"],
        ["团队原则", "不索取私钥，不自动交易；mock、降级和真实数据状态必须清晰展示。"],
      ],
    },
    en: {
      title: "About ChainVigil AI",
      lead: "ChainVigil AI is a crypto-risk education and read-only screening product built for global users.",
      sections: [
        ["What we solve", "We help users verify contract addresses, trading restrictions, privileges, and common scam signals before buying or approving."],
        ["Limits", "Results are not investment advice or a guarantee of safety. On-chain state changes; re-scan and verify independently."],
        ["Principles", "We never request private keys or auto-trade. Mock, degraded, and live data states must remain explicit."],
      ],
    },
  },
  methodology: {
    zh: {
      title: "风险检测方法",
      lead: "结论由多源证据、规则分级、降级状态和时间戳共同构成。",
      sections: [
        ["数据来源", "优先使用链上 RPC、GoPlus、Honeypot.is 与内部复核标签。每个来源都可能超时或缺少字段。"],
        ["风险分级", "禁买/高危用于明确的卖出失败、高税或危险权限；谨慎表示存在不确定项；低风险不等于无风险。"],
        ["置信度", "只有真实数据源成功执行后才产生置信度。mock 报告始终标记 UNASSESSED。"],
        ["更新与纠错", "报告带检测时间；如发现误报，请通过联系页面提交 CA、链、证据和检测时间。"],
      ],
    },
    en: {
      title: "Risk methodology",
      lead: "Conclusions combine multi-source evidence, severity rules, degradation state, and timestamps.",
      sections: [
        ["Sources", "We prioritize on-chain RPC, GoPlus, Honeypot.is, and reviewed internal labels. Any source may time out or omit fields."],
        ["Risk levels", "Block/high cover clear sell failures, extreme taxes, or dangerous privileges. Caution means uncertainty. Low observed risk is not zero risk."],
        ["Confidence", "Confidence is assigned only after live sources execute. Mock reports always remain UNASSESSED."],
        ["Corrections", "Reports include scan time. To dispute a result, send the CA, chain, evidence, and scan timestamp through Contact."],
      ],
    },
  },
  privacy: {
    zh: {
      title: "隐私政策",
      lead: "我们以最少数据原则运行产品。",
      sections: [
        ["处理的数据", "可能处理查询的公开钱包/合约地址、基础访问日志、限流标识和用户主动提交的反馈。"],
        ["不会收集", "绝不要求私钥、助记词或交易签名。请勿向任何人提交这些信息。"],
        ["用途与保留", "数据用于提供检测、防滥用和改进产品；生产保留周期应按部署地区法规与内部策略配置。"],
        ["全球用户", "不同地区可能拥有访问、更正或删除权。联系时请说明所在地区与请求内容。"],
      ],
    },
    en: {
      title: "Privacy policy",
      lead: "We operate under a data-minimization principle.",
      sections: [
        ["Data processed", "Public wallet/contract queries, basic access logs, rate-limit identifiers, and feedback you choose to submit may be processed."],
        ["Never requested", "We never request private keys, seed phrases, or transaction signatures. Do not send them to anyone."],
        ["Use and retention", "Data supports screening, abuse prevention, and product improvement. Production retention must follow deployment-region law and internal policy."],
        ["Global users", "Regional rights may include access, correction, or deletion. State your region and request when contacting us."],
      ],
    },
  },
  terms: {
    zh: {
      title: "服务条款",
      lead: "使用本产品即表示你理解它是风险教育与辅助工具，而非金融建议。",
      sections: [
        ["无保证", "检测可能遗漏风险或产生误报；第三方数据源和链上状态也可能中断或变化。"],
        ["用户责任", "你对自己的交易、授权、税务与合规决定负责。不要使用无法承受损失的资金。"],
        ["禁止滥用", "不得绕过限流、攻击服务、批量抓取敏感接口或利用产品侵害他人。"],
      ],
    },
    en: {
      title: "Terms of service",
      lead: "By using this product, you acknowledge it is a risk-education aid, not financial advice.",
      sections: [
        ["No guarantee", "Scans may miss risks or produce false positives. Third-party sources and on-chain state can fail or change."],
        ["Your responsibility", "You are responsible for transactions, approvals, tax, and compliance decisions. Never risk funds you cannot lose."],
        ["No abuse", "Do not bypass limits, attack the service, scrape restricted interfaces, or use the product to harm others."],
      ],
    },
  },
  contact: {
    zh: {
      title: "联系与纠错",
      lead: "上线前请在部署环境配置公开支持邮箱；安全问题不要公开披露敏感细节。",
      sections: [
        ["报告纠错", "请提供链、CA、报告 URL、检测时间和可复核证据。"],
        ["安全披露", "请发送到部署时配置的 SECURITY_CONTACT；在修复前避免公开漏洞利用细节。"],
        ["商务与媒体", "请使用部署时配置的 SUPPORT_EMAIL，并注明合作目的与地区。"],
      ],
    },
    en: {
      title: "Contact and corrections",
      lead: "Configure a public support email before launch. Do not disclose sensitive security details publicly.",
      sections: [
        ["Report corrections", "Include chain, CA, report URL, scan time, and independently verifiable evidence."],
        ["Security disclosure", "Use the configured SECURITY_CONTACT and avoid publishing exploit details before remediation."],
        ["Business and media", "Use the configured SUPPORT_EMAIL and include purpose and region."],
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
    title: `${page.title}｜ChainVigil AI`,
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
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-10 text-[#f9fafb]">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-[#c0c1ff]">← ChainVigil AI</Link>
        <h1 className="mt-8 text-4xl font-semibold">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-[#c7c4d7]">{page.lead}</p>
        <div className="mt-10 space-y-5">
          {page.sections.map(([title, body]) => (
            <section key={title} className="rounded-2xl border border-[#262932] bg-[#16181d] p-5">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 leading-7 text-[#c7c4d7]">{body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 text-xs text-[#6b7280]">Last updated: 2026-07-17</p>
      </article>
    </main>
  );
}
