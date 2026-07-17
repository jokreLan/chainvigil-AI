import type { Metadata } from "next";
import { getServerLocale } from "../i18n/server";
import type { Locale } from "../i18n/config";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export type PageSeoKey =
  | "home"
  | "check"
  | "walletCheck"
  | "intel"
  | "learn"
  | "riskDb"
  | "board"
  | "fakeDb"
  | "bot"
  | "pricing"
  | "developers"
  | "api"
  | "solana"
  | "bnb";

const copy: Record<PageSeoKey, Record<Locale, { title: string; description: string }>> = {
  home: {
    zh: {
      title: "ChainVigil AI｜链哨 AI — 买币前，先查 CA",
      description:
        "中文买前安检入口：人话风险结论，优先 SOL/BNB。查 CA、群内 Bot、哨点 VP。不构成投资建议。",
    },
    en: {
      title: "ChainVigil AI — Before you buy, check the CA",
      description:
        "Buy-before security scan for SOL/BNB. Plain-language risk, Telegram bot, Vigil Points. Not investment advice.",
    },
  },
  check: {
    zh: {
      title: "CA 安检｜ChainVigil AI",
      description: "粘贴 SOL/BNB 合约或 DexScreener/GMGN 链接，生成含 mode/confidence 的风险报告。无需连接钱包。",
    },
    en: {
      title: "CA Check｜ChainVigil AI",
      description:
        "Paste a SOL/BNB contract or DexScreener/GMGN link for a risk report with mode/confidence. No wallet connect.",
    },
  },
  walletCheck: {
    zh: {
      title: "钱包体检｜ChainVigil AI",
      description: "只读钱包风险摘要：高危授权、可疑资产与粉尘。不索取私钥，不自动撤销。",
    },
    en: {
      title: "Wallet health｜ChainVigil AI",
      description: "Read-only wallet risk summary: approvals, spam assets, dust. No keys, no auto-revoke.",
    },
  },
  intel: {
    zh: {
      title: "情报中心｜ChainVigil AI",
      description: "高危 CA 样例、假币对照与风险知识入口。教育向 mock/情报，查自己的合约请用 CA 安检。",
    },
    en: {
      title: "Intel hub｜ChainVigil AI",
      description: "High-risk samples, fake-token patterns, and education. Use CA check for your own contract.",
    },
  },
  learn: {
    zh: {
      title: "风险百科｜ChainVigil AI",
      description: "人话解释貔貅、LP 未锁、无限授权、假币与授权风险。先理解，再决定是否查 CA。",
    },
    en: {
      title: "Risk encyclopedia｜ChainVigil AI",
      description: "Plain guides on honeypots, unlocked LP, unlimited approvals, fakes. Learn first, then scan a CA.",
    },
  },
  riskDb: {
    zh: {
      title: "风险数据库｜ChainVigil AI",
      description: "风险类型人话解释与信号清单：貔貅、Owner 后门、LP、无限授权等。",
    },
    en: {
      title: "Risk database｜ChainVigil AI",
      description: "Plain-language risk types and signals: honeypot, owner powers, LP, unlimited approvals.",
    },
  },
  board: {
    zh: {
      title: "高危 CA 榜单｜ChainVigil AI",
      description: "高危/禁买样例榜（教育与联调）。非实时全量链上榜，交易前请独立复核。",
    },
    en: {
      title: "High-risk CA board｜ChainVigil AI",
      description: "Sample high-risk/block list for education. Not a full live chain board — re-verify before trading.",
    },
  },
  fakeDb: {
    zh: {
      title: "假币数据库｜ChainVigil AI",
      description: "官方 vs 仿盘对照：名称可伪造，买前务必核对唯一 CA。",
    },
    en: {
      title: "Fake token database｜ChainVigil AI",
      description: "Official vs impostor patterns. Names can be faked — always verify the unique CA.",
    },
  },
  bot: {
    zh: {
      title: "群内 Telegram Bot｜ChainVigil AI",
      description: "在中文交易群贴 CA，拿人话结论。优先 SOL/BNB。不自动交易。",
    },
    en: {
      title: "Telegram Bot｜ChainVigil AI",
      description: "Paste a CA in the group for plain-language results. SOL/BNB first. No auto-trading.",
    },
  },
  pricing: {
    zh: {
      title: "价格与额度｜ChainVigil AI",
      description: "Free / Pro / 群版包装与哨点 VP 抵扣说明。支付上线前仅产品契约。",
    },
    en: {
      title: "Pricing & quotas｜ChainVigil AI",
      description: "Free / Pro / group plans and Vigil Points cash-offset rules. Packaging first; checkout later.",
    },
  },
  developers: {
    zh: {
      title: "开发者中心｜ChainVigil AI",
      description: "Token/Wallet/Intel API 入口与 mock 契约说明。无生产 SLA 承诺。",
    },
    en: {
      title: "Developers｜ChainVigil AI",
      description: "Token, wallet, and intel API entry with mock contracts. No production SLA yet.",
    },
  },
  api: {
    zh: {
      title: "API 文档入口｜ChainVigil AI",
      description: "可运行 API 清单与 OpenAPI。密钥永不出现在响应中。",
    },
    en: {
      title: "API catalog｜ChainVigil AI",
      description: "Runnable API list and OpenAPI. Secrets never appear in responses.",
    },
  },
  solana: {
    zh: {
      title: "Solana Token 安全检查｜ChainVigil AI",
      description: "买 Solana Token 前先查 CA。权限、流动性与持仓集中度等人话信号。",
    },
    en: {
      title: "Solana token security check｜ChainVigil AI",
      description: "Check the CA before trading Solana tokens. Authority, liquidity, concentration signals.",
    },
  },
  bnb: {
    zh: {
      title: "BNB Smart Chain Token 安全检查｜ChainVigil AI",
      description: "买 BNB Token 前先查 CA。买卖限制、税率、权限与 LP 信号。",
    },
    en: {
      title: "BNB Smart Chain token security check｜ChainVigil AI",
      description: "Check the CA before trading BNB tokens. Buy/sell limits, tax, privileges, LP.",
    },
  },
};

const pathByKey: Record<PageSeoKey, string> = {
  home: "/",
  check: "/check",
  walletCheck: "/wallet-check",
  intel: "/intel",
  learn: "/learn",
  riskDb: "/risk-database",
  board: "/leaderboard/high-risk-tokens",
  fakeDb: "/fake-token-database",
  bot: "/bot",
  pricing: "/pricing",
  developers: "/developers",
  api: "/api",
  solana: "/solana",
  bnb: "/bnb",
};

export async function buildPageMetadata(key: PageSeoKey, extra?: Partial<Metadata>): Promise<Metadata> {
  const locale = await getServerLocale();
  const site = getSiteUrl();
  const { title, description } = copy[key][locale];
  const path = pathByKey[key];
  const url = `${site}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "ChainVigil AI",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
    ...extra,
  };
}

export function buildWebsiteJsonLd(locale: Locale = "zh") {
  const site = getSiteUrl();
  const isZh = locale === "zh";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site}/#organization`,
        name: isZh ? "ChainVigil AI｜链哨 AI" : "ChainVigil AI",
        url: site,
        slogan: isZh ? "买币前，先查 CA。" : "Before you buy, check the CA.",
        description: isZh
          ? "中文买前 CA 安检入口，优先 SOL/BNB。风险教育工具，不构成投资建议。"
          : "Buy-before CA security entry for SOL/BNB. Risk education only — not investment advice.",
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: site,
        name: "ChainVigil AI",
        inLanguage: isZh ? ["zh-CN", "en"] : ["en", "zh-CN"],
        publisher: { "@id": `${site}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${site}/check`,
          "query-input": "required name=ca",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "ChainVigil AI",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: isZh
          ? "粘贴合约地址获取人话风险结论（含检测模式说明）。"
          : "Paste a contract address for plain-language risk conclusions with detection mode honesty.",
        url: `${site}/check`,
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
