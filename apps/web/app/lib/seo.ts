import type { Metadata } from "next";
import { getServerLocale } from "../i18n/server";
import type { Locale } from "../i18n/config";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function localizedPath(locale: Locale, path: string): string {
  return `/${locale}${path === "/" ? "" : path}`;
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
      title: "风险百科 · Solana 租金 / 貔貅 / 授权长尾词｜ChainVigil AI",
      description:
        "长尾搜索矩阵：Solana rent reclaim、pump.fun 防割、BSC 貔貅税率、撤销授权。固定 URL + GEO 结构化词条，导向 CA 安检与钱包体检。",
    },
    en: {
      title: "Risk encyclopedia · Solana rent, rugs, BSC honeypot, revoke｜ChainVigil AI",
      description:
        "Long-tail matrix: Solana rent reclaim, pump.fun rug checks, BSC honeypot/tax, approval revoke. Fixed URLs + GEO articles → CA check & wallet health.",
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
      title: "最新 Solana & BSC 高危/骗局 CA 榜单｜ChainVigil AI",
      description:
        "教育向高危与禁买样例榜（SOL/BNB）。固定 URL、内容会更新；当前 V0 为 mock 样例，非全量链上实时榜。交易前请重新 CA 安检。",
    },
    en: {
      title: "Latest Solana & BSC Scam / High-Risk Tokens List｜ChainVigil AI",
      description:
        "Sample high-risk & block CAs for SOL/BNB education. Fixed URL, content refreshes over time. V0 is mock samples — not a full live chain dump. Re-scan before trading.",
    },
  },
  fakeDb: {
    zh: {
      title: "假 USDT / USDC / Meme 仿盘合约对照库｜ChainVigil AI",
      description:
        "活跃仿盘与假稳定币模式对照：名称可伪造，买前务必核对唯一 CA。教育向样例，请独立复核。",
    },
    en: {
      title: "Active Fake USDT, USDC & Meme Impostor Contracts｜ChainVigil AI",
      description:
        "Official vs impostor patterns for stablecoins and memes. Names can be faked — always verify the unique CA. Educational samples; re-verify independently.",
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
      title: "Solana 合约安检 · 租金回收 · 垃圾币｜ChainVigil AI",
      description:
        "Solana contract check、rent reclaim（租金/空账户）、junk token 风险教育。买前查 CA；资产清理入口见资产理发师（V0 只读演示）。",
    },
    en: {
      title: "Solana Contract Check, Rent Reclaim & Junk Tokens｜ChainVigil AI",
      description:
        "Solana CA scan, rent reclaim education, and junk-token risk. Check CA before buy; asset barber for cleanup UX (V0 read-only demo).",
    },
  },
  bnb: {
    zh: {
      title: "BSC 貔貅扫描 · 撤销授权 · CA 安检｜ChainVigil AI",
      description:
        "BNB Smart Chain honeypot scanner 教育、Revoke approvals 说明与 CA 极速安检入口。买前查 CA，授权清理见工作台（V0 不广播交易）。",
    },
    en: {
      title: "BSC Honeypot Scanner, Revoke Approvals & CA Check｜ChainVigil AI",
      description:
        "BNB Smart Chain honeypot education, approval revoke guidance, and fast CA check. Cleanup UX is demo-only — no broadcast in V0.",
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
  const url = `${site}${localizedPath(locale, path)}`;
  const languages = {
    "zh-CN": `${site}${localizedPath("zh", path)}`,
    en: `${site}${localizedPath("en", path)}`,
    "x-default": `${site}${localizedPath("zh", path)}`,
  };

  return {
    metadataBase: new URL(site),
    title,
    description,
    alternates: { canonical: url, languages },
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
          target: `${site}${localizedPath(locale, "/check")}`,
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
        url: `${site}${localizedPath(locale, "/check")}`,
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

/** TechArticle + APIReference for /developers — AI/GEO citation surface. */
export function buildDevelopersJsonLd(locale: Locale = "zh") {
  const site = getSiteUrl();
  const isZh = locale === "zh";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: isZh ? "ChainVigil AI 开发者中心" : "ChainVigil AI Developers",
        description: isZh
          ? "Token / Wallet / Intel 风险检测 API 入口与 mock 契约。可用于扫描 Solana / BNB 合约安全信号。"
          : "Token, wallet, and intel risk APIs with mock contracts for Solana/BNB safety signals.",
        url: `${site}${localizedPath(locale, "/developers")}`,
        inLanguage: isZh ? "zh-CN" : "en",
        author: { "@type": "Organization", name: "ChainVigil AI" },
        publisher: { "@type": "Organization", name: "ChainVigil AI" },
        about: [
          { "@type": "Thing", name: "Solana token security API" },
          { "@type": "Thing", name: "BNB Smart Chain honeypot scan API" },
        ],
      },
      {
        "@type": "APIReference",
        name: "POST /api/v1/token/check",
        description: isZh
          ? "提交 CA 或链接，返回含 mode/confidence 的人话风险报告（V0 可为 mock）。"
          : "Submit a CA or link; returns a plain-language risk report with mode/confidence (V0 may be mock).",
        url: `${site}${localizedPath(locale, "/api")}`,
        documentation: `${site}${localizedPath(locale, "/developers")}`,
        provider: { "@type": "Organization", name: "ChainVigil AI" },
      },
      {
        "@type": "APIReference",
        name: "POST /api/v1/wallet/health",
        description: isZh
          ? "只读钱包体检：高危授权与可疑资产摘要，不请求签名。"
          : "Read-only wallet health: high-risk approvals and suspicious assets. No signing.",
        url: `${site}${localizedPath(locale, "/api")}`,
        documentation: `${site}${localizedPath(locale, "/developers")}`,
        provider: { "@type": "Organization", name: "ChainVigil AI" },
      },
    ],
  };
}

/** Dataset JSON-LD for /risk-database — educational catalog, not a live dump claim. */
export function buildRiskDatasetJsonLd(locale: Locale = "zh") {
  const site = getSiteUrl();
  const isZh = locale === "zh";
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: isZh ? "ChainVigil 风险类型与信号目录" : "ChainVigil risk type & signal catalog",
    description: isZh
      ? "教育向风险类型、人话解释与链上信号清单（貔貅、LP、无限授权等）。V0 含 mock 样例，不是全网黑名单实时库。"
      : "Educational risk types, plain-language explanations, and on-chain signal labels (honeypot, LP, unlimited approval). V0 includes mock samples — not a full live blacklist dump.",
    url: `${site}${localizedPath(locale, "/risk-database")}`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: { "@type": "Organization", name: "ChainVigil AI", url: site },
    keywords: isZh
      ? ["貔貅", "honeypot", "LP 未锁", "无限授权", "假 USDT", "CA 安检"]
      : ["honeypot", "unlocked LP", "unlimited approval", "fake USDT", "CA check", "Solana", "BSC"],
    isAccessibleForFree: true,
    inLanguage: isZh ? ["zh-CN", "en"] : ["en", "zh-CN"],
  };
}
