import type { Locale } from "../i18n/config";

export type GeoArticleSlug =
  | "honeypot"
  | "sell-tax"
  | "lp-unlocked"
  | "unlimited-approval"
  | "fake-usdt"
  | "blacklist"
  | "how-to-check-ca"
  | "not-investment-advice";

export interface GeoArticle {
  slug: GeoArticleSlug;
  title: string;
  description: string;
  definition: string;
  risk: string;
  howToDetect: string[];
  faq: Array<[string, string]>;
  relatedSignals: string[];
  ctaLabel: string;
}

const articles: Record<GeoArticleSlug, Record<Locale, Omit<GeoArticle, "slug">>> = {
  honeypot: {
    zh: {
      title: "什么是貔貅盘（Honeypot）？",
      description: "能买不能卖，或卖出税接近 100%。买币前最需要先排除的一票否决风险。",
      definition:
        "貔貅盘指合约或交易路径导致用户买入后难以按正常市场价格卖出，常见表现为卖出失败、极高卖出税或隐藏黑名单。",
      risk: "资金可能无法退出。名称和 K 线可以造假，唯一可靠入口是合约地址（CA）与可复查证据。",
      howToDetect: [
        "查 CA，不要只看名字、图标或群聊截图",
        "看卖出仿真 / canSell 与 sell tax 信号",
        "结合 LP 是否锁定、Owner 是否可改规则",
        "任何禁买/卖出失败信号：不要买入，已持有勿加仓",
      ],
      faq: [
        ["貔貅一定等于合约写死不能卖吗？", "不一定。也可能是高税、黑名单、暂停交易或流动性异常，结果都是「难退出」。"],
        ["K 线很好看能买吗？", "不能据此判断。刷量与假盘可同时存在，先查 CA。"],
      ],
      relatedSignals: ["canSell=false", "honeypotDetected", "sellTaxPercent>=90"],
      ctaLabel: "立即 CA 安检",
    },
    en: {
      title: "What is a honeypot?",
      description: "You can buy but cannot sell, or sell tax is near 100%. A hard-block risk before buying.",
      definition:
        "A honeypot is a contract or trade path that makes normal exits hard after buying — failed sells, extreme sell tax, or hidden blacklists.",
      risk: "You may not exit. Names and charts can be faked; the unique CA and verifiable evidence matter.",
      howToDetect: [
        "Check the CA — not just name, icon, or chat screenshots",
        "Review sell simulation / canSell and sell tax signals",
        "Combine with LP lock and owner privilege signals",
        "On block/sell-fail signals: do not buy; if holding, do not add size",
      ],
      faq: [
        ["Does honeypot always mean sell is hard-coded off?", "Not always. High tax, blacklist, pause, or broken liquidity can all trap exits."],
        ["Strong chart = safe?", "No. Volume can be faked. Check the CA first."],
      ],
      relatedSignals: ["canSell=false", "honeypotDetected", "sellTaxPercent>=90"],
      ctaLabel: "Scan CA now",
    },
  },
  "sell-tax": {
    zh: {
      title: "什么是卖出税（Sell Tax）？",
      description: "卖出时被合约抽成的比例。极高卖出税会让变现接近不可能。",
      definition: "卖出税是 token 转出/卖出路径上被合约收取的比例，可能固定也可能被 Owner 修改。",
      risk: "高卖出税会吞噬本金；若 Owner 可改税，风险会突然上升。",
      howToDetect: ["查看 buy/sell tax 字段", "确认 Owner 是否可改税", "小额验证前先读报告 mode/confidence", "税异常时停止加仓"],
      faq: [
        ["买入税低、卖出税高常见吗？", "常见于陷阱盘。必须同时看买卖两侧。"],
        ["税会变吗？", "若 Owner 未放弃权限，可能随时改。"],
      ],
      relatedSignals: ["sellTaxPercent", "buyTaxPercent", "ownerCanModifyTax"],
      ctaLabel: "查这个 CA 的税率信号",
    },
    en: {
      title: "What is sell tax?",
      description: "The fee taken on sell/transfer. Extreme sell tax can make exits nearly impossible.",
      definition: "Sell tax is the percentage taken on sell/transfer paths — fixed or owner-changeable.",
      risk: "High sell tax burns capital; if owner can change tax, risk can spike suddenly.",
      howToDetect: ["Read buy/sell tax fields", "Check if owner can modify tax", "Respect mode/confidence", "Stop adding size on abnormal tax"],
      faq: [
        ["Low buy tax + high sell tax?", "Common trap pattern. Always check both sides."],
        ["Can tax change?", "Yes if owner privileges remain."],
      ],
      relatedSignals: ["sellTaxPercent", "buyTaxPercent", "ownerCanModifyTax"],
      ctaLabel: "Scan CA tax signals",
    },
  },
  "lp-unlocked": {
    zh: {
      title: "为什么 LP 未锁有风险？",
      description: "流动性未锁定或未燃烧时，项目方可能撤池，用户难以按预期退出。",
      definition: "LP（流动性）支持兑换。未锁/未烧意味着控制方可能抽走流动性。",
      risk: "撤池后滑点极端或无法成交；热度 K 线不能证明 LP 安全。",
      howToDetect: ["查看 lpLocked / LP 价值信号", "交叉核对锁仓证明与浏览器", "无证明时把 LP 当谨慎项", "与持仓集中度一起看"],
      faq: [
        ["LP 有价值就安全吗？", "否。价值高也可被撤，关键是谁控制与是否锁定。"],
        ["锁仓截图可信吗？", "截图可伪造，需可复查来源。"],
      ],
      relatedSignals: ["lpLocked=false", "lpValueLow", "lpOwnerConcentrated"],
      ctaLabel: "检查 CA 的 LP 信号",
    },
    en: {
      title: "Why is unlocked LP risky?",
      description: "If liquidity is unlocked/unburned, the team may pull the pool and break exits.",
      definition: "LP enables swaps. Unlocked/unburned LP can be removed by whoever controls it.",
      risk: "After a pull, exits fail or slip wildly. Hot charts do not prove LP safety.",
      howToDetect: ["Check lpLocked / LP value signals", "Verify lock proofs on explorers", "Treat missing proof as caution", "Combine with holder concentration"],
      faq: [
        ["High LP value = safe?", "No. Control and lock status matter more."],
        ["Trust lock screenshots?", "Screenshots can be faked — need verifiable sources."],
      ],
      relatedSignals: ["lpLocked=false", "lpValueLow", "lpOwnerConcentrated"],
      ctaLabel: "Check LP signals",
    },
  },
  "unlimited-approval": {
    zh: {
      title: "无限授权为什么危险？",
      description: "授权额度过大时，spender 一旦被攻击或作恶，可能转走授权范围内资产。",
      definition: "无限授权指 allowance 极大或 setApprovalForAll，让 spender 可持续转走资产。",
      risk: "不必再次签名即可被转走资产；长期未用的未知 spender 尤其危险。",
      howToDetect: ["钱包体检看无限/高危授权", "核对 spender 是否为常用协议", "不用则在钱包中自行撤销", "V0 不代你签名或自动撤销"],
      faq: [
        ["ChainVigil 会帮我撤销吗？", "不会。只做只读提示，撤销须你在钱包确认。"],
        ["授权给知名 DEX 就安全吗？", "相对常见，但仍应控制额度并定期复查。"],
      ],
      relatedSignals: ["allowance=infinite", "spenderUnknown", "lastUsedAt=null"],
      ctaLabel: "去做钱包体检",
    },
    en: {
      title: "Why are unlimited approvals dangerous?",
      description: "Huge allowances let a compromised or malicious spender drain covered assets.",
      definition: "Unlimited approval means a very large allowance or setApprovalForAll for a spender.",
      risk: "Assets can move without a new signature; unknown long-unused spenders are especially risky.",
      howToDetect: ["Wallet health for infinite/high-risk approvals", "Verify spenders you actually use", "Revoke unused ones in your wallet", "V0 never signs or auto-revokes"],
      faq: [
        ["Will ChainVigil revoke for me?", "No. Read-only tips only — you confirm in-wallet."],
        ["Known DEX approvals safe?", "More common, still review amount and recency."],
      ],
      relatedSignals: ["allowance=infinite", "spenderUnknown", "lastUsedAt=null"],
      ctaLabel: "Run wallet health",
    },
  },
  "fake-usdt": {
    zh: {
      title: "如何识别假 USDT / 仿盘？",
      description: "名称和 Symbol 可伪造，唯一可靠的是合约地址是否与官方一致。",
      definition: "仿盘使用相似名称/图标诱导转账或交易，合约地址与官方资产不同。",
      risk: "转错地址资产不可追回；假盘常配高税或卖出限制。",
      howToDetect: ["只从官网/可信行情复制 CA", "对比浏览器与官方地址", "名称相似一律当可疑", "用 CA 安检看权限与税信号"],
      faq: [
        ["钱包里显示 USDT 就是真的吗？", "否。显示名可被仿盘自定义。"],
        ["群截图转账记录可信吗？", "不可作为唯一依据。"],
      ],
      relatedSignals: ["symbolImpersonation", "unverifiedContract", "newPair"],
      ctaLabel: "核对这个 CA",
    },
    en: {
      title: "How to spot fake USDT / impostors?",
      description: "Names and symbols can be faked. Only the official CA is reliable.",
      definition: "Impostors mimic names/icons to lure transfers or trades with a different contract.",
      risk: "Wrong-address transfers are often unrecoverable; fakes may add high tax or sell blocks.",
      howToDetect: ["Copy CA from official/trusted sources", "Compare on explorers", "Treat name similarity as suspicious", "Scan CA for privilege/tax signals"],
      faq: [
        ["Wallet shows USDT = real?", "No. Display names can be customized."],
        ["Trust chat screenshots?", "Never as the only proof."],
      ],
      relatedSignals: ["symbolImpersonation", "unverifiedContract", "newPair"],
      ctaLabel: "Verify this CA",
    },
  },
  blacklist: {
    zh: {
      title: "什么是黑名单权限？",
      description: "Owner 或特权地址可能限制特定账户交易，导致你无法卖出。",
      definition: "黑名单功能允许合约把地址加入限制列表，影响转账或交易。",
      risk: "即便有余额也可能无法卖出；权限在项目方时规则可突变。",
      howToDetect: ["看 blacklistFunction 等权限信号", "结合 Owner/暂停/改税", "小额前先查 CA", "权限未 renounce 保持谨慎"],
      faq: [
        ["没有黑名单就安全吗？", "否。还有税、LP、卖出路径等风险。"],
        ["如何确认已放弃权限？", "需可复查的链上证据，截图不够。"],
      ],
      relatedSignals: ["blacklistFunction", "pausable", "ownerCanModifyTax"],
      ctaLabel: "扫描合约权限",
    },
    en: {
      title: "What is blacklist privilege?",
      description: "Owner may restrict specific accounts so they cannot sell or transfer.",
      definition: "A blacklist feature lets privileged roles block addresses from transfer/trade.",
      risk: "Balances can become un-sellable; rules can change while privileges remain.",
      howToDetect: ["Check blacklistFunction-style signals", "Combine with owner/pause/tax powers", "Scan CA before sizing up", "Stay cautious until renounce is proven"],
      faq: [
        ["No blacklist = safe?", "No. Tax, LP, and sell-path risks remain."],
        ["How to prove renounce?", "Need verifiable on-chain evidence, not screenshots."],
      ],
      relatedSignals: ["blacklistFunction", "pausable", "ownerCanModifyTax"],
      ctaLabel: "Scan privileges",
    },
  },
  "how-to-check-ca": {
    zh: {
      title: "买币前如何查 CA？",
      description: "三步：拿到唯一 CA → 用链哨安检 → 再从官方与浏览器复核。",
      definition: "CA（Contract Address）是识别 token 合约实例的唯一入口，名称不能当身份。",
      risk: "跳过 CA 核对是仿盘与貔貅的主要入口。",
      howToDetect: [
        "从官网/可信行情复制完整 CA",
        "粘贴到 /check 生成报告（关注 mode/confidence）",
        "看结论、税、权限、LP、主要原因",
        "交易前再次复核官方渠道与区块浏览器",
      ],
      faq: [
        ["可以只看群友转发的报告吗？", "报告会过期；交易前请重新检测。"],
        ["SOL 和 BNB 都支持吗？", "V0 优先 SOL/BNB。"],
      ],
      relatedSignals: ["mode", "confidence", "riskLevel"],
      ctaLabel: "打开 CA 安检",
    },
    en: {
      title: "How to check a CA before you buy?",
      description: "Three steps: get the unique CA → scan → re-verify official + explorer sources.",
      definition: "The CA uniquely identifies a token contract instance. Names are not identity.",
      risk: "Skipping CA checks is the main door for impostors and honeypots.",
      howToDetect: [
        "Copy the full CA from official/trusted sources",
        "Paste into /check and read mode/confidence",
        "Review conclusion, tax, privileges, LP, top reasons",
        "Re-verify official channels and explorers before trading",
      ],
      faq: [
        ["Is a shared report enough?", "Reports go stale — re-scan before trading."],
        ["SOL and BNB?", "V0 prioritizes SOL/BNB."],
      ],
      relatedSignals: ["mode", "confidence", "riskLevel"],
      ctaLabel: "Open CA check",
    },
  },
  "not-investment-advice": {
    zh: {
      title: "相对低风险 ≠ 推荐买入",
      description: "ChainVigil 只做交易安全风险识别，不判断价格、收益或投资价值。",
      definition: "风险报告描述可见安全信号与不确定性，不是买卖建议。",
      risk: "把「低风险」当成「会涨」会导致错误决策；mock/降级结果更不能当依据。",
      howToDetect: ["始终阅读 mode/confidence", "把报告当检查清单而非推荐", "大额前多源复核", "不理解的权限与税不要碰"],
      faq: [
        ["LOW 可以重仓吗？", "工具不给出仓位建议；安全信号≠收益。"],
        ["mock 报告能信吗？", "仅演示流程；字段不代表真实可买卖。"],
      ],
      relatedSignals: ["riskLevel=LOW", "mode=mock", "notInvestmentAdvice"],
      ctaLabel: "用安检做检查，不做推荐",
    },
    en: {
      title: "Lower risk ≠ a buy recommendation",
      description: "ChainVigil assesses trade-safety risk only — not price, yield, or investment value.",
      definition: "Reports describe visible safety signals and uncertainty, not trade advice.",
      risk: "Treating “low risk” as “will pump” is a mistake; mock/degraded results are never a basis to size up.",
      howToDetect: ["Always read mode/confidence", "Use reports as checklists, not tips", "Multi-source verify before size", "Avoid unknown privileges/tax"],
      faq: [
        ["LOW = go heavy?", "No position advice. Safety ≠ return."],
        ["Trust mock reports?", "Demo only — not proof of real tradability."],
      ],
      relatedSignals: ["riskLevel=LOW", "mode=mock", "notInvestmentAdvice"],
      ctaLabel: "Scan for safety, not tips",
    },
  },
};

export const geoArticleSlugs = Object.keys(articles) as GeoArticleSlug[];

export function getGeoArticle(slug: string, locale: Locale): GeoArticle | null {
  if (!(slug in articles)) return null;
  const body = articles[slug as GeoArticleSlug][locale];
  return { slug: slug as GeoArticleSlug, ...body };
}

export function listGeoArticles(locale: Locale): GeoArticle[] {
  return geoArticleSlugs.map((slug) => ({ slug, ...articles[slug][locale] }));
}

export function buildGeoArticleJsonLd(article: GeoArticle, url: string, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        inLanguage: locale === "zh" ? "zh-CN" : "en",
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: "ChainVigil AI" },
        publisher: { "@type": "Organization", name: "ChainVigil AI", slogan: locale === "zh" ? "买币前，先查 CA。" : "Before you buy, check the CA." },
      },
      {
        "@type": "FAQPage",
        mainEntity: article.faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "HowTo",
        name: article.title,
        description: article.description,
        step: article.howToDetect.map((text, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          text,
        })),
      },
    ],
  };
}
