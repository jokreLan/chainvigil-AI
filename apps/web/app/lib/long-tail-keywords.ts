import type { Locale } from "../i18n/config";
import type { GeoArticleSlug } from "./geo-articles";

/**
 * Long-tail SEO matrix (S0.5 content layer).
 * Each keyword maps to a durable URL — never a per-CA token page.
 */
export type LongTailCategory =
  | "solana-rent"
  | "solana-rug"
  | "bsc-honeypot"
  | "wallet-approval";

export type LongTailStatus = "live" | "mapped" | "deferred";

export interface LongTailKeyword {
  id: number;
  /** Primary query (search-shaped). */
  en: string;
  zh: string;
  category: LongTailCategory;
  /** Canonical landing for this intent. */
  href: string;
  articleSlug?: GeoArticleSlug;
  status: LongTailStatus;
  /** Product honesty / freeze note. */
  note?: string;
}

export const longTailCategoryMeta: Record<
  LongTailCategory,
  Record<Locale, { title: string; subtitle: string; ctaHref: string; ctaLabel: string }>
> = {
  "solana-rent": {
    zh: {
      title: "Solana 租金回收与垃圾清理",
      subtitle: "空账户、死 meme、rent reclaim → 资产理发师（V0 只读演示，默认不垫付 Gas）",
      ctaHref: "/app/asset-barber",
      ctaLabel: "打开资产理发师",
    },
    en: {
      title: "Solana rent reclaim & junk cleanup",
      subtitle: "Empty accounts, dead memes, rent reclaim → Asset barber (V0 read-only; no gas sponsor by default)",
      ctaHref: "/app/asset-barber",
      ctaLabel: "Open asset barber",
    },
  },
  "solana-rug": {
    zh: {
      title: "Solana / pump.fun 防割检测",
      subtitle: "冲新前先查 CA：权限、LP、集中度与开发者砸盘信号",
      ctaHref: "/check",
      ctaLabel: "CA 极速安检",
    },
    en: {
      title: "Solana / pump.fun rug checks",
      subtitle: "Before you ape: CA scan for privileges, LP, concentration, and dev-dump signals",
      ctaHref: "/check",
      ctaLabel: "Fast CA check",
    },
  },
  "bsc-honeypot": {
    zh: {
      title: "BNB Chain 避坑与防貔貅",
      subtitle: "黑名单、税率、只能买不能卖、Owner 权限 → CA 安检",
      ctaHref: "/check",
      ctaLabel: "BSC CA 安检",
    },
    en: {
      title: "BSC honeypot & trap checks",
      subtitle: "Blacklist, tax, sell-fail, owner powers → CA scan",
      ctaHref: "/check",
      ctaLabel: "BSC CA check",
    },
  },
  "wallet-approval": {
    zh: {
      title: "双链授权与钱包安全",
      subtitle: "无限授权、未知 Spender、疑似被盗 → 钱包体检 / 授权清理（演示）",
      ctaHref: "/wallet-check",
      ctaLabel: "钱包体检",
    },
    en: {
      title: "Approvals & wallet safety",
      subtitle: "Unlimited allowances, unknown spenders, compromise checks → wallet health / approvals demo",
      ctaHref: "/wallet-check",
      ctaLabel: "Wallet health",
    },
  },
};

export const longTailKeywords: LongTailKeyword[] = [
  // —— Category 1: Solana rent / cleanup ——
  {
    id: 1,
    en: "how to reclaim rent on solana wallet",
    zh: "如何在 Solana 钱包回收租金",
    category: "solana-rent",
    href: "/learn/how-to-reclaim-solana-rent",
    articleSlug: "how-to-reclaim-solana-rent",
    status: "live",
  },
  {
    id: 2,
    en: "close empty token accounts solana phantom",
    zh: "Phantom 关闭 Solana 空代币账户",
    category: "solana-rent",
    href: "/learn/close-empty-token-accounts-solana",
    articleSlug: "close-empty-token-accounts-solana",
    status: "live",
  },
  {
    id: 3,
    en: "how to get sol back from dead memecoins",
    zh: "死掉的 meme 币怎么退回 SOL",
    category: "solana-rent",
    href: "/learn/how-to-reclaim-solana-rent",
    articleSlug: "how-to-reclaim-solana-rent",
    status: "mapped",
  },
  {
    id: 4,
    en: "solana burn token for sol refund",
    zh: "烧毁 Solana 代币换 SOL 退款",
    category: "solana-rent",
    href: "/learn/solana-burn-token-sol-refund",
    articleSlug: "solana-burn-token-sol-refund",
    status: "live",
  },
  {
    id: 5,
    en: "free solana wallet cleanup tool",
    zh: "免费 Solana 钱包清理工具",
    category: "solana-rent",
    href: "/learn/free-solana-wallet-cleanup",
    articleSlug: "free-solana-wallet-cleanup",
    status: "live",
  },
  {
    id: 6,
    en: "recover sol rent from old token accounts",
    zh: "从旧代币账户恢复 SOL 租金",
    category: "solana-rent",
    href: "/learn/how-to-reclaim-solana-rent",
    articleSlug: "how-to-reclaim-solana-rent",
    status: "mapped",
  },
  {
    id: 7,
    en: "how to delete solana wallet spam airdrops",
    zh: "Solana 钱包里的垃圾空投怎么删除",
    category: "solana-rent",
    href: "/learn/close-empty-token-accounts-solana",
    articleSlug: "close-empty-token-accounts-solana",
    status: "mapped",
  },
  {
    id: 8,
    en: "solana token account rent refund",
    zh: "Solana 代币账户租金怎么退",
    category: "solana-rent",
    href: "/learn/how-to-reclaim-solana-rent",
    articleSlug: "how-to-reclaim-solana-rent",
    status: "mapped",
  },
  {
    id: 9,
    en: "one click clean dust tokens sol wallet",
    zh: "如何一键清理 sol 钱包零碎代币",
    category: "solana-rent",
    href: "/learn/free-solana-wallet-cleanup",
    articleSlug: "free-solana-wallet-cleanup",
    status: "mapped",
    note: "V0 无一键上链；只读扫描 + 人工确认叙事",
  },
  {
    id: 10,
    en: "cleanup empty accounts without sol gas",
    zh: "钱包里没有 SOL 怎么清理空账户",
    category: "solana-rent",
    href: "/learn/free-solana-wallet-cleanup",
    articleSlug: "free-solana-wallet-cleanup",
    status: "live",
    note: "平台垫付 Gas = 冻结权益；默认文案：不垫付",
  },

  // —— Category 2: Solana / pump.fun rug ——
  {
    id: 11,
    en: "how to check if pump fun dev rugged",
    zh: "如何检查 pump.fun 开发者是否跑路",
    category: "solana-rug",
    href: "/learn/pump-fun-dev-dump-check",
    articleSlug: "pump-fun-dev-dump-check",
    status: "live",
  },
  {
    id: 12,
    en: "solana contract metadata mutable risk",
    zh: "Solana 合约元数据可变风险",
    category: "solana-rug",
    href: "/learn/solana-metadata-mutable-risk",
    articleSlug: "solana-metadata-mutable-risk",
    status: "live",
  },
  {
    id: 13,
    en: "check if solana lp is locked or burned",
    zh: "检查 Solana LP 是锁仓还是烧毁",
    category: "solana-rug",
    href: "/learn/raydium-lp-lock-check",
    articleSlug: "raydium-lp-lock-check",
    status: "live",
  },
  {
    id: 14,
    en: "best free rug check tool for solana",
    zh: "Solana 最好的免费防 Rug 检测工具",
    category: "solana-rug",
    href: "/learn/free-solana-rug-check",
    articleSlug: "free-solana-rug-check",
    status: "live",
  },
  {
    id: 15,
    en: "raydium new pool liquidity lock check",
    zh: "Raydium 新池子流动性锁仓检查",
    category: "solana-rug",
    href: "/learn/raydium-lp-lock-check",
    articleSlug: "raydium-lp-lock-check",
    status: "mapped",
  },
  {
    id: 16,
    en: "solana address deployer history scanner",
    zh: "Solana 部署者历史地址扫描器",
    category: "solana-rug",
    href: "/check",
    status: "deferred",
    note: "需要 live 部署者图/历史情报；S1+ 再做专页",
  },
  {
    id: 17,
    en: "check if solana token authority renounced",
    zh: "如何看 sol 链代币权限有没有放弃",
    category: "solana-rug",
    href: "/learn/owner-renounced-meaning",
    articleSlug: "owner-renounced-meaning",
    status: "live",
  },
  {
    id: 18,
    en: "pump fun did dev buy their own supply",
    zh: "pump fun 怎么看项目方有没有买完自己发的币",
    category: "solana-rug",
    href: "/learn/pump-fun-dev-dump-check",
    articleSlug: "pump-fun-dev-dump-check",
    status: "mapped",
  },

  // —— Category 3: BSC honeypot ——
  {
    id: 19,
    en: "bsc contract blacklist function checker",
    zh: "BSC 合约黑名单功能检查器",
    category: "bsc-honeypot",
    href: "/learn/blacklist",
    articleSlug: "blacklist",
    status: "mapped",
  },
  {
    id: 20,
    en: "how to tell if bsc token is a honeypot",
    zh: "如何判断 BSC 代币是否是貔貅",
    category: "bsc-honeypot",
    href: "/learn/honeypot",
    articleSlug: "honeypot",
    status: "mapped",
  },
  {
    id: 21,
    en: "check buy sell tax on pancakeswap",
    zh: "检查 PancakeSwap 买卖税率",
    category: "bsc-honeypot",
    href: "/learn/sell-tax",
    articleSlug: "sell-tax",
    status: "mapped",
  },
  {
    id: 22,
    en: "can owner modify tax to 100 percent bsc",
    zh: "项目方能把 BSC 税率改成 100% 吗",
    category: "bsc-honeypot",
    href: "/learn/sell-tax",
    articleSlug: "sell-tax",
    status: "mapped",
  },
  {
    id: 23,
    en: "detect hidden mint authority bnb chain",
    zh: "检测 BNB 链隐藏增发权限",
    category: "bsc-honeypot",
    href: "/learn/bsc-hidden-mint-authority",
    articleSlug: "bsc-hidden-mint-authority",
    status: "live",
  },
  {
    id: 24,
    en: "bsc token owner renounced meaning",
    zh: "BSC 代币放弃所有权意味着什么",
    category: "bsc-honeypot",
    href: "/learn/owner-renounced-meaning",
    articleSlug: "owner-renounced-meaning",
    status: "live",
  },
  {
    id: 25,
    en: "bsc contract buy only cannot sell",
    zh: "BSC 合约怎么查是不是只能买不能卖",
    category: "bsc-honeypot",
    href: "/learn/honeypot",
    articleSlug: "honeypot",
    status: "mapped",
  },
  {
    id: 26,
    en: "metamask sell failed is it honeypot",
    zh: "小狐狸钱包提示卖出交易失败是貔貅吗",
    category: "bsc-honeypot",
    href: "/learn/bsc-honeypot-sell-fail",
    articleSlug: "bsc-honeypot-sell-fail",
    status: "live",
  },

  // —— Category 4: wallet / approvals ——
  {
    id: 27,
    en: "revoke unlimited token approval solana",
    zh: "撤销 Solana 无限代币授权",
    category: "wallet-approval",
    href: "/learn/unlimited-approval",
    articleSlug: "unlimited-approval",
    status: "mapped",
    note: "Solana 授权模型与 EVM 不同；页内说明差异",
  },
  {
    id: 28,
    en: "how to cancel high risk approval bsc",
    zh: "如何取消 BSC 高危授权",
    category: "wallet-approval",
    href: "/learn/is-it-safe-to-revoke-approvals",
    articleSlug: "is-it-safe-to-revoke-approvals",
    status: "mapped",
  },
  {
    id: 29,
    en: "revoke cash alternative for bnb chain",
    zh: "BNB 链上 Revoke.cash 的替代工具",
    category: "wallet-approval",
    href: "/learn/revoke-cash-alternative-bsc",
    articleSlug: "revoke-cash-alternative-bsc",
    status: "live",
  },
  {
    id: 30,
    en: "is it safe to leave unlimited approval active",
    zh: "保留无限授权安全吗",
    category: "wallet-approval",
    href: "/learn/is-it-safe-to-revoke-approvals",
    articleSlug: "is-it-safe-to-revoke-approvals",
    status: "mapped",
  },
  {
    id: 31,
    en: "wallet approve spender unknown warning",
    zh: "钱包授权 Spender 未知警告如何处理",
    category: "wallet-approval",
    href: "/learn/unlimited-approval",
    articleSlug: "unlimited-approval",
    status: "mapped",
  },
  {
    id: 32,
    en: "how to check if wallet is compromised web3",
    zh: "如何检查 Web3 钱包是否被黑",
    category: "wallet-approval",
    href: "/learn/check-wallet-compromised",
    articleSlug: "check-wallet-compromised",
    status: "live",
  },
  {
    id: 33,
    en: "mobile wallet one click revoke approvals",
    zh: "手机钱包怎么一键取消授权",
    category: "wallet-approval",
    href: "/learn/is-it-safe-to-revoke-approvals",
    articleSlug: "is-it-safe-to-revoke-approvals",
    status: "mapped",
    note: "无一键代签；须钱包内确认",
  },
  {
    id: 34,
    en: "does revoke affect tokens in wallet",
    zh: "授权清理对钱包里的币有影响吗",
    category: "wallet-approval",
    href: "/learn/is-it-safe-to-revoke-approvals",
    articleSlug: "is-it-safe-to-revoke-approvals",
    status: "mapped",
  },
];

export const longTailCategories = Object.keys(longTailCategoryMeta) as LongTailCategory[];

export function listLongTailByCategory(category: LongTailCategory): LongTailKeyword[] {
  return longTailKeywords.filter((item) => item.category === category);
}

export function listLiveLongTailArticles(): GeoArticleSlug[] {
  const slugs = new Set<GeoArticleSlug>();
  for (const item of longTailKeywords) {
    if (item.articleSlug && (item.status === "live" || item.status === "mapped")) {
      slugs.add(item.articleSlug);
    }
  }
  return [...slugs];
}

export function countLongTailByStatus() {
  return longTailKeywords.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    { live: 0, mapped: 0, deferred: 0 } as Record<LongTailStatus, number>,
  );
}
