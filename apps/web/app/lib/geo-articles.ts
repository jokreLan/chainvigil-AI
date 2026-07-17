import type { Locale } from "../i18n/config";
import { extraArticles, type ExtraGeoSlug } from "./geo-articles-extra";

export type GeoArticleSlug =
  | "honeypot"
  | "sell-tax"
  | "lp-unlocked"
  | "unlimited-approval"
  | "fake-usdt"
  | "blacklist"
  | "how-to-check-ca"
  | "not-investment-advice"
  | "how-to-reclaim-solana-rent"
  | "is-it-safe-to-revoke-approvals"
  | "pump-fun-dev-dump-check"
  | ExtraGeoSlug;

export type SignalSeverity = "BLOCK" | "CAUTION" | "INFO";

export interface GeoSignalRow {
  signal: string;
  severity: SignalSeverity;
  plain: string;
}

export interface GeoArticle {
  slug: GeoArticleSlug;
  title: string;
  description: string;
  /** Hard one-line assertion for AI/GEO extractors (lead sentence). */
  assertion: string;
  definition: string;
  risk: string;
  howToDetect: string[];
  faq: Array<[string, string]>;
  relatedSignals: string[];
  /** Markdown-friendly risk table for AI card extraction. */
  signalTable: GeoSignalRow[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCta?: { href: string; label: string };
  publishedAt?: string;
  updatedAt?: string;
  reviewedBy?: string;
  sources?: Array<{ name: string; url: string }>;
}

type ArticleBody = Omit<GeoArticle, "slug">;

const articles = {
  honeypot: {
    zh: {
      title: "什么是貔貅盘（Honeypot）？",
      description: "能买不能卖，或卖出税接近 100%。买币前最需要先排除的一票否决风险。",
      assertion: "貔貅盘是指合约或交易路径限制正常卖出，常见表现为 canSell=false、极高卖出税或隐藏黑名单。",
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
      signalTable: [
        { signal: "canSell = false", severity: "BLOCK", plain: "无法按正常路径卖出，高度疑似貔貅" },
        { signal: "honeypotDetected", severity: "BLOCK", plain: "第三方/仿真判定存在蜜罐特征" },
        { signal: "sellTaxPercent ≥ 90", severity: "BLOCK", plain: "卖出税接近抽干，变现接近不可能" },
        { signal: "ownerCanModifyTax", severity: "CAUTION", plain: "项目方可随时把税改到极端" },
      ],
      ctaLabel: "立即 CA 安检",
      ctaHref: "/check",
    },
    en: {
      title: "What is a honeypot?",
      description: "You can buy but cannot sell, or sell tax is near 100%. A hard-block risk before buying.",
      assertion:
        "A honeypot is a contract or trade path that blocks normal sells — often canSell=false, extreme sell tax, or a hidden blacklist.",
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
      signalTable: [
        { signal: "canSell = false", severity: "BLOCK", plain: "Cannot sell on the normal path — strong honeypot signal" },
        { signal: "honeypotDetected", severity: "BLOCK", plain: "Simulation/provider flags honeypot traits" },
        { signal: "sellTaxPercent ≥ 90", severity: "BLOCK", plain: "Sell tax near 100% makes exit worthless" },
        { signal: "ownerCanModifyTax", severity: "CAUTION", plain: "Owner can raise tax to extreme levels" },
      ],
      ctaLabel: "Scan CA now",
      ctaHref: "/check",
    },
  },
  "sell-tax": {
    zh: {
      title: "什么是卖出税（Sell Tax）？",
      description: "卖出时被合约抽成的比例。极高卖出税会让变现接近不可能。",
      assertion: "卖出税是 token 卖出/转出路径上被合约收取的比例；Owner 可改税时风险会突然升高。",
      definition: "卖出税是 token 转出/卖出路径上被合约收取的比例，可能固定也可能被 Owner 修改。",
      risk: "高卖出税会吞噬本金；若 Owner 可改税，风险会突然上升。",
      howToDetect: ["查看 buy/sell tax 字段", "确认 Owner 是否可改税", "小额验证前先读报告 mode/confidence", "税异常时停止加仓"],
      faq: [
        ["买入税低、卖出税高常见吗？", "常见于陷阱盘。必须同时看买卖两侧。"],
        ["税会变吗？", "若 Owner 未放弃权限，可能随时改。"],
      ],
      relatedSignals: ["sellTaxPercent", "buyTaxPercent", "ownerCanModifyTax"],
      signalTable: [
        { signal: "sellTaxPercent 很高", severity: "BLOCK", plain: "卖出几乎无剩余" },
        { signal: "ownerCanModifyTax", severity: "CAUTION", plain: "税可被改成 100%" },
        { signal: "buyTax ≠ sellTax", severity: "CAUTION", plain: "常见诱饵结构，需双侧核对" },
      ],
      ctaLabel: "查这个 CA 的税率信号",
      ctaHref: "/check",
    },
    en: {
      title: "What is sell tax?",
      description: "The fee taken on sell/transfer. Extreme sell tax can make exits nearly impossible.",
      assertion: "Sell tax is the percentage taken on sell/transfer paths — fixed or owner-changeable.",
      definition: "Sell tax is the percentage taken on sell/transfer paths — fixed or owner-changeable.",
      risk: "High sell tax burns capital; if owner can change tax, risk can spike suddenly.",
      howToDetect: ["Read buy/sell tax fields", "Check if owner can modify tax", "Respect mode/confidence", "Stop adding size on abnormal tax"],
      faq: [
        ["Low buy tax + high sell tax?", "Common trap pattern. Always check both sides."],
        ["Can tax change?", "Yes if owner privileges remain."],
      ],
      relatedSignals: ["sellTaxPercent", "buyTaxPercent", "ownerCanModifyTax"],
      signalTable: [
        { signal: "high sellTaxPercent", severity: "BLOCK", plain: "Exit value near zero" },
        { signal: "ownerCanModifyTax", severity: "CAUTION", plain: "Tax can jump to 100%" },
        { signal: "buyTax ≠ sellTax", severity: "CAUTION", plain: "Classic bait structure" },
      ],
      ctaLabel: "Scan CA tax signals",
      ctaHref: "/check",
    },
  },
  "lp-unlocked": {
    zh: {
      title: "为什么 LP 未锁有风险？",
      description: "流动性未锁定或未燃烧时，项目方可能撤池，用户难以按预期退出。",
      assertion: "LP 未锁/未烧意味着控制方可能抽走流动性，导致无法按预期退出。",
      definition: "LP（流动性）支持兑换。未锁/未烧意味着控制方可能抽走流动性。",
      risk: "撤池后滑点极端或无法成交；热度 K 线不能证明 LP 安全。",
      howToDetect: ["查看 lpLocked / LP 价值信号", "交叉核对锁仓证明与浏览器", "无证明时把 LP 当谨慎项", "与持仓集中度一起看"],
      faq: [
        ["LP 有价值就安全吗？", "否。价值高也可被撤，关键是谁控制与是否锁定。"],
        ["锁仓截图可信吗？", "截图可伪造，需可复查来源。"],
      ],
      relatedSignals: ["lpLocked=false", "lpValueLow", "lpOwnerConcentrated"],
      signalTable: [
        { signal: "lpLocked = false", severity: "CAUTION", plain: "流动性可能被撤走" },
        { signal: "lpValue 过低", severity: "CAUTION", plain: "滑点与退出困难" },
        { signal: "LP 控制权集中", severity: "CAUTION", plain: "少数人可决定池子命运" },
      ],
      ctaLabel: "检查 CA 的 LP 信号",
      ctaHref: "/check",
    },
    en: {
      title: "Why is unlocked LP risky?",
      description: "If liquidity is unlocked/unburned, the team may pull the pool and break exits.",
      assertion: "Unlocked/unburned LP means whoever controls it may pull liquidity and break exits.",
      definition: "LP enables swaps. Unlocked/unburned LP can be removed by whoever controls it.",
      risk: "After a pull, exits fail or slip wildly. Hot charts do not prove LP safety.",
      howToDetect: ["Check lpLocked / LP value signals", "Verify lock proofs on explorers", "Treat missing proof as caution", "Combine with holder concentration"],
      faq: [
        ["High LP value = safe?", "No. Control and lock status matter more."],
        ["Trust lock screenshots?", "Screenshots can be faked — need verifiable sources."],
      ],
      relatedSignals: ["lpLocked=false", "lpValueLow", "lpOwnerConcentrated"],
      signalTable: [
        { signal: "lpLocked = false", severity: "CAUTION", plain: "Liquidity may be removed" },
        { signal: "low LP value", severity: "CAUTION", plain: "High slippage / hard exits" },
        { signal: "concentrated LP control", severity: "CAUTION", plain: "Few actors control the pool" },
      ],
      ctaLabel: "Check LP signals",
      ctaHref: "/check",
    },
  },
  "unlimited-approval": {
    zh: {
      title: "无限授权为什么危险？",
      description: "授权额度过大时，spender 一旦被攻击或作恶，可能转走授权范围内资产。",
      assertion: "无限授权让 spender 在额度内可持续转走资产；不用的未知 spender 应优先处理。",
      definition: "无限授权指 allowance 极大或 setApprovalForAll，让 spender 可持续转走资产。",
      risk: "不必再次签名即可被转走资产；长期未用的未知 spender 尤其危险。",
      howToDetect: ["钱包体检看无限/高危授权", "核对 spender 是否为常用协议", "不用则在钱包中自行撤销", "V0 不代你签名或自动撤销"],
      faq: [
        ["ChainVigil 会帮我撤销吗？", "不会。只做只读提示，撤销须你在钱包确认。"],
        ["授权给知名 DEX 就安全吗？", "相对常见，但仍应控制额度并定期复查。"],
      ],
      relatedSignals: ["allowance=infinite", "spenderUnknown", "lastUsedAt=null"],
      signalTable: [
        { signal: "allowance = infinite", severity: "CAUTION", plain: "额度过大，被盗影响面大" },
        { signal: "spender 未知", severity: "BLOCK", plain: "不明合约拿了权限" },
        { signal: "长期未使用", severity: "CAUTION", plain: "遗留授权应优先清理" },
      ],
      ctaLabel: "去做钱包体检",
      ctaHref: "/wallet-check",
      secondaryCta: { href: "/app/approvals", label: "查看授权列表（演示）" },
    },
    en: {
      title: "Why are unlimited approvals dangerous?",
      description: "Huge allowances let a compromised or malicious spender drain covered assets.",
      assertion: "Unlimited approvals let a spender move assets within allowance — unused unknown spenders first.",
      definition: "Unlimited approval means a very large allowance or setApprovalForAll for a spender.",
      risk: "Assets can move without a new signature; unknown long-unused spenders are especially risky.",
      howToDetect: ["Wallet health for infinite/high-risk approvals", "Verify spenders you actually use", "Revoke unused ones in your wallet", "V0 never signs or auto-revokes"],
      faq: [
        ["Will ChainVigil revoke for me?", "No. Read-only tips only — you confirm in-wallet."],
        ["Known DEX approvals safe?", "More common, still review amount and recency."],
      ],
      relatedSignals: ["allowance=infinite", "spenderUnknown", "lastUsedAt=null"],
      signalTable: [
        { signal: "allowance = infinite", severity: "CAUTION", plain: "Large blast radius if spender is bad" },
        { signal: "unknown spender", severity: "BLOCK", plain: "Unfamiliar contract holds power" },
        { signal: "long unused", severity: "CAUTION", plain: "Stale approvals should be cleaned" },
      ],
      ctaLabel: "Run wallet health",
      ctaHref: "/wallet-check",
      secondaryCta: { href: "/app/approvals", label: "Open approvals (demo)" },
    },
  },
  "fake-usdt": {
    zh: {
      title: "如何识别假 USDT / 仿盘？",
      description: "名称和 Symbol 可伪造，唯一可靠的是合约地址是否与官方一致。",
      assertion: "仿盘用相似名称诱导转账；唯一可靠身份是官方 CA，不是钱包里显示的名字。",
      definition: "仿盘使用相似名称/图标诱导转账或交易，合约地址与官方资产不同。",
      risk: "转错地址资产不可追回；假盘常配高税或卖出限制。",
      howToDetect: ["只从官网/可信行情复制 CA", "对比浏览器与官方地址", "名称相似一律当可疑", "用 CA 安检看权限与税信号"],
      faq: [
        ["钱包里显示 USDT 就是真的吗？", "否。显示名可被仿盘自定义。"],
        ["群截图转账记录可信吗？", "不可作为唯一依据。"],
      ],
      relatedSignals: ["symbolImpersonation", "unverifiedContract", "newPair"],
      signalTable: [
        { signal: "symbolImpersonation", severity: "BLOCK", plain: "名称/符号仿冒官方资产" },
        { signal: "unverifiedContract", severity: "CAUTION", plain: "源码未验证增加后门风险" },
        { signal: "newPair", severity: "INFO", plain: "新池需额外谨慎" },
      ],
      ctaLabel: "核对这个 CA",
      ctaHref: "/check",
      secondaryCta: { href: "/fake-token-database", label: "打开假币对照库" },
    },
    en: {
      title: "How to spot fake USDT / impostors?",
      description: "Names and symbols can be faked. Only the official CA is reliable.",
      assertion: "Impostors mimic names; only the official CA is identity — not the wallet display label.",
      definition: "Impostors mimic names/icons to lure transfers or trades with a different contract.",
      risk: "Wrong-address transfers are often unrecoverable; fakes may add high tax or sell blocks.",
      howToDetect: ["Copy CA from official/trusted sources", "Compare on explorers", "Treat name similarity as suspicious", "Scan CA for privilege/tax signals"],
      faq: [
        ["Wallet shows USDT = real?", "No. Display names can be customized."],
        ["Trust chat screenshots?", "Never as the only proof."],
      ],
      relatedSignals: ["symbolImpersonation", "unverifiedContract", "newPair"],
      signalTable: [
        { signal: "symbolImpersonation", severity: "BLOCK", plain: "Name/symbol clones an official asset" },
        { signal: "unverifiedContract", severity: "CAUTION", plain: "Unverified code raises backdoor risk" },
        { signal: "newPair", severity: "INFO", plain: "New pools need extra caution" },
      ],
      ctaLabel: "Verify this CA",
      ctaHref: "/check",
      secondaryCta: { href: "/fake-token-database", label: "Open fake-token DB" },
    },
  },
  blacklist: {
    zh: {
      title: "什么是黑名单权限？",
      description: "Owner 或特权地址可能限制特定账户交易，导致你无法卖出。",
      assertion: "黑名单权限允许特权地址限制特定账户转账或交易，余额也可能卖不掉。",
      definition: "黑名单功能允许合约把地址加入限制列表，影响转账或交易。",
      risk: "即便有余额也可能无法卖出；权限在项目方时规则可突变。",
      howToDetect: ["看 blacklistFunction 等权限信号", "结合 Owner/暂停/改税", "小额前先查 CA", "权限未 renounce 保持谨慎"],
      faq: [
        ["没有黑名单就安全吗？", "否。还有税、LP、卖出路径等风险。"],
        ["如何确认已放弃权限？", "需可复查的链上证据，截图不够。"],
      ],
      relatedSignals: ["blacklistFunction", "pausable", "ownerCanModifyTax"],
      signalTable: [
        { signal: "blacklistFunction", severity: "CAUTION", plain: "可针对地址限制交易" },
        { signal: "pausable", severity: "CAUTION", plain: "可暂停转账/交易" },
        { signal: "owner 未 renounce", severity: "INFO", plain: "规则仍可能变更" },
      ],
      ctaLabel: "扫描合约权限",
      ctaHref: "/check",
    },
    en: {
      title: "What is blacklist privilege?",
      description: "Owner may restrict specific accounts so they cannot sell or transfer.",
      assertion: "Blacklist privileges let roles block specific addresses from transfer or trade.",
      definition: "A blacklist feature lets privileged roles block addresses from transfer/trade.",
      risk: "Balances can become un-sellable; rules can change while privileges remain.",
      howToDetect: ["Check blacklistFunction-style signals", "Combine with owner/pause/tax powers", "Scan CA before sizing up", "Stay cautious until renounce is proven"],
      faq: [
        ["No blacklist = safe?", "No. Tax, LP, and sell-path risks remain."],
        ["How to prove renounce?", "Need verifiable on-chain evidence, not screenshots."],
      ],
      relatedSignals: ["blacklistFunction", "pausable", "ownerCanModifyTax"],
      signalTable: [
        { signal: "blacklistFunction", severity: "CAUTION", plain: "Addresses can be blocked" },
        { signal: "pausable", severity: "CAUTION", plain: "Transfers/trades can be paused" },
        { signal: "owner not renounced", severity: "INFO", plain: "Rules may still change" },
      ],
      ctaLabel: "Scan privileges",
      ctaHref: "/check",
    },
  },
  "how-to-check-ca": {
    zh: {
      title: "买币前如何查 CA？",
      description: "三步：拿到唯一 CA → 用链哨安检 → 再从官方与浏览器复核。",
      assertion: "CA 是识别 token 的唯一入口；买前应：复制官方 CA → 安检 → 独立复核。",
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
      signalTable: [
        { signal: "mode = mock", severity: "INFO", plain: "演示数据，不能当实盘依据" },
        { signal: "confidence 低", severity: "CAUTION", plain: "证据不足，勿重仓" },
        { signal: "riskLevel = BLOCK", severity: "BLOCK", plain: "先别买，先搞清楚原因" },
      ],
      ctaLabel: "打开 CA 安检",
      ctaHref: "/check",
    },
    en: {
      title: "How to check a CA before you buy?",
      description: "Three steps: get the unique CA → scan → re-verify official + explorer sources.",
      assertion: "The CA uniquely identifies a token — copy official CA → scan → re-verify before buy.",
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
      signalTable: [
        { signal: "mode = mock", severity: "INFO", plain: "Demo data — not live proof" },
        { signal: "low confidence", severity: "CAUTION", plain: "Thin evidence — do not size up" },
        { signal: "riskLevel = BLOCK", severity: "BLOCK", plain: "Do not buy until reasons are clear" },
      ],
      ctaLabel: "Open CA check",
      ctaHref: "/check",
    },
  },
  "not-investment-advice": {
    zh: {
      title: "相对低风险 ≠ 推荐买入",
      description: "ChainVigil 只做交易安全风险识别，不判断价格、收益或投资价值。",
      assertion: "风险报告只描述安全信号与不确定性，不是买卖或仓位建议。",
      definition: "风险报告描述可见安全信号与不确定性，不是买卖建议。",
      risk: "把「低风险」当成「会涨」会导致错误决策；mock/降级结果更不能当依据。",
      howToDetect: ["始终阅读 mode/confidence", "把报告当检查清单而非推荐", "大额前多源复核", "不理解的权限与税不要碰"],
      faq: [
        ["LOW 可以重仓吗？", "工具不给出仓位建议；安全信号≠收益。"],
        ["mock 报告能信吗？", "仅演示流程；字段不代表真实可买卖。"],
      ],
      relatedSignals: ["riskLevel=LOW", "mode=mock", "notInvestmentAdvice"],
      signalTable: [
        { signal: "riskLevel = LOW", severity: "INFO", plain: "仅表示可见安全信号较少，不是推荐" },
        { signal: "mode = mock", severity: "INFO", plain: "演示模式，禁止当真金白银依据" },
        { signal: "notInvestmentAdvice", severity: "INFO", plain: "工具边界：不做收益判断" },
      ],
      ctaLabel: "用安检做检查，不做推荐",
      ctaHref: "/check",
    },
    en: {
      title: "Lower risk ≠ a buy recommendation",
      description: "ChainVigil assesses trade-safety risk only — not price, yield, or investment value.",
      assertion: "Risk reports describe safety signals and uncertainty — never buy or size advice.",
      definition: "Reports describe visible safety signals and uncertainty, not trade advice.",
      risk: "Treating “low risk” as “will pump” is a mistake; mock/degraded results are never a basis to size up.",
      howToDetect: ["Always read mode/confidence", "Use reports as checklists, not tips", "Multi-source verify before size", "Avoid unknown privileges/tax"],
      faq: [
        ["LOW = go heavy?", "No position advice. Safety ≠ return."],
        ["Trust mock reports?", "Demo only — not proof of real tradability."],
      ],
      relatedSignals: ["riskLevel=LOW", "mode=mock", "notInvestmentAdvice"],
      signalTable: [
        { signal: "riskLevel = LOW", severity: "INFO", plain: "Fewer visible hazards — not a tip" },
        { signal: "mode = mock", severity: "INFO", plain: "Demo mode — never size on it" },
        { signal: "notInvestmentAdvice", severity: "INFO", plain: "Tool boundary: no yield judgment" },
      ],
      ctaLabel: "Scan for safety, not tips",
      ctaHref: "/check",
    },
  },
  "how-to-reclaim-solana-rent": {
    zh: {
      title: "如何回收 Solana 租金（Rent Reclaim）？",
      description: "空账户与无用 token 账户会占用 rent；理解回收原理，再使用清理工具（V0 只读演示）。",
      assertion:
        "Solana 上关闭空 token 账户可退回 rent（租金）；先识别可关闭账户，再由你在钱包确认交易——平台默认不代付 Gas。",
      definition:
        "Solana 账户需维持 rent-exempt 余额。空的 ATA/无用账户关闭后，锁定的 SOL 可退回钱包。",
      risk: "误关仍有余额或仍需使用的账户会损失资产或功能；务必只读扫描后再人工确认。",
      howToDetect: [
        "用钱包体检/资产清理入口查看可回收提示（V0 mock）",
        "区分「空账户可关」与「仍有余额勿动」",
        "了解关闭账户是链上交易，需签名与网络费",
        "ChainVigil V0 不广播交易；真回收须你在钱包确认",
      ],
      faq: [
        ["会自动帮我退 SOL 吗？", "不会。V0 只做只读提示与教育；执行须你签名。"],
        ["和貔貅安检有什么关系？", "安检防买错；租金回收是持仓卫生，两者都服务「少亏冤枉钱」。"],
      ],
      relatedSignals: ["emptyTokenAccount", "rentReclaimable", "doNotTouchBalance"],
      signalTable: [
        { signal: "empty ATA", severity: "INFO", plain: "可评估关闭以退回 rent" },
        { signal: "余额 > 0", severity: "BLOCK", plain: "禁止当空账户关闭" },
        { signal: "mode = mock", severity: "INFO", plain: "当前演示列表，非链上实扫保证" },
      ],
      ctaLabel: "打开资产理发师（演示）",
      ctaHref: "/app/asset-barber",
      secondaryCta: { href: "/solana", label: "Solana 专题" },
    },
    en: {
      title: "How to reclaim Solana rent?",
      description: "Empty/unused token accounts hold rent. Learn reclaim basics before cleanup tools (V0 read-only demo).",
      assertion:
        "Closing empty Solana token accounts can return rent SOL; scan first, then you confirm in-wallet — platform does not sponsor gas by default.",
      definition:
        "Solana accounts keep rent-exempt balances. Closing empty ATAs/unused accounts can return locked SOL.",
      risk: "Closing accounts that still hold value or are needed can lose funds or break flows — confirm carefully.",
      howToDetect: [
        "Use wallet health / asset cleanup views for reclaim hints (V0 mock)",
        "Separate empty closable accounts from balances you must keep",
        "Closing is an on-chain tx needing your signature and fee",
        "ChainVigil V0 never broadcasts — you confirm in wallet",
      ],
      faq: [
        ["Will you auto-return SOL?", "No. V0 is read-only education; you sign."],
        ["Relation to honeypot checks?", "CA checks stop bad buys; rent reclaim is portfolio hygiene."],
      ],
      relatedSignals: ["emptyTokenAccount", "rentReclaimable", "doNotTouchBalance"],
      signalTable: [
        { signal: "empty ATA", severity: "INFO", plain: "Candidate to close for rent return" },
        { signal: "balance > 0", severity: "BLOCK", plain: "Do not close as empty" },
        { signal: "mode = mock", severity: "INFO", plain: "Demo list — not a live guarantee" },
      ],
      ctaLabel: "Open asset barber (demo)",
      ctaHref: "/app/asset-barber",
      secondaryCta: { href: "/solana", label: "Solana guide" },
    },
  },
  "is-it-safe-to-revoke-approvals": {
    zh: {
      title: "撤销授权（Revoke）安全吗？",
      description: "正确的 revoke 只把 allowance 设为 0，不转走资产；仍须核对 spender 与 Gas。",
      assertion:
        "标准 Revoke 签名只取消授权额度，不会转走资产；仍会消耗网络 Gas，且可能影响该 DApp 后续使用。",
      definition:
        "Revoke 通过链上交易把对某 spender 的 allowance 改为 0（或关闭 setApprovalForAll）。",
      risk: "签错交易类型（假 revoke 钓鱼）、连错网络、或授权给恶意站点仍危险；平台默认不垫付 Gas。",
      howToDetect: [
        "钱包体检标出高危/无限授权",
        "确认 asset、spender、当前额度",
        "弹窗应明示：仅撤销、不转账、预估 Gas",
        "在钱包内核对交易详情后再签名；V0 演示不上链",
      ],
      faq: [
        ["撤销会把币转走吗？", "标准 revoke 不会；若钱包展示异常转账字段请立刻停止。"],
        ["Gas 谁付？", "默认你付网络费；若有活动垫付会单独标明。"],
      ],
      relatedSignals: ["revokeOnly", "noTransfer", "gasNetworkFee"],
      signalTable: [
        { signal: "仅改 allowance→0", severity: "INFO", plain: "正常 revoke 语义" },
        { signal: "出现 transfer/swap 字段", severity: "BLOCK", plain: "可能不是真撤销，停止签名" },
        { signal: "无限授权未处理", severity: "CAUTION", plain: "优先处理未知 spender" },
      ],
      ctaLabel: "钱包体检",
      ctaHref: "/wallet-check",
      secondaryCta: { href: "/app/approvals", label: "授权清理演示" },
    },
    en: {
      title: "Is it safe to revoke approvals?",
      description: "A proper revoke sets allowance to 0 and does not transfer assets — still verify spender and gas.",
      assertion:
        "A standard revoke only cancels allowance; it does not transfer assets. You still pay network gas and may break that DApp until re-approve.",
      definition: "Revoke is an on-chain tx that sets allowance to 0 (or turns off setApprovalForAll) for a spender.",
      risk: "Phishing “fake revoke”, wrong network, or malicious sites remain dangerous; platform does not sponsor gas by default.",
      howToDetect: [
        "Wallet health flags high-risk/infinite approvals",
        "Confirm asset, spender, and current allowance",
        "UI should state: revoke only, no transfer, est. gas",
        "Verify tx details in-wallet before signing; V0 demo does not broadcast",
      ],
      faq: [
        ["Does revoke move my tokens?", "Standard revoke does not. Stop if you see unexpected transfer fields."],
        ["Who pays gas?", "You pay network fees unless a labeled promo says otherwise."],
      ],
      relatedSignals: ["revokeOnly", "noTransfer", "gasNetworkFee"],
      signalTable: [
        { signal: "allowance → 0 only", severity: "INFO", plain: "Normal revoke semantics" },
        { signal: "unexpected transfer fields", severity: "BLOCK", plain: "Stop — may not be a real revoke" },
        { signal: "unused infinite allowance", severity: "CAUTION", plain: "Prioritize unknown spenders" },
      ],
      ctaLabel: "Wallet health",
      ctaHref: "/wallet-check",
      secondaryCta: { href: "/app/approvals", label: "Approvals demo" },
    },
  },
  "pump-fun-dev-dump-check": {
    zh: {
      title: "如何看 pump.fun 项目方砸盘风险？",
      description: "meme 发射盘常见：集中持仓、可铸权限、捆绑卖出。先查 CA 与持仓结构，再谈热度。",
      assertion:
        "pump.fun 类新币要优先查 CA、开发者/捆绑持仓与可卖路径；热度不能证明不可砸盘。",
      definition:
        "发射平台加速创建与交易，但不消除权限、集中度与流动性操纵风险；「项目方砸盘」表现为集中卖出或规则突变。",
      risk: "上线数分钟内即可归零；分享链接与 K 线均可伪造情绪。",
      howToDetect: [
        "复制准确 mint/CA，不要只点群短链",
        "CA 安检看权限、可卖性、集中度类信号（以报告 mode 为准）",
        "交叉看开发者钱包/捆绑地址是否仍持巨仓",
        "小额或观望；报告过期后必须重扫",
      ],
      faq: [
        ["榜上有名就安全吗？", "否。榜单是教育样例或延迟数据，不能替代你的 CA 安检。"],
        ["AI 说安全能信吗？", "以可复查链上证据与 mode/confidence 为准。"],
      ],
      relatedSignals: ["holderConcentration", "mintAuthority", "canSell", "freshDeploy"],
      signalTable: [
        { signal: "持仓极度集中", severity: "CAUTION", plain: "少数人可砸盘" },
        { signal: "mint/freeze 仍开", severity: "CAUTION", plain: "供给或账户规则可被改" },
        { signal: "canSell 异常", severity: "BLOCK", plain: "退出路径不可用" },
        { signal: "部署极新", severity: "INFO", plain: "信息少，默认更高不确定" },
      ],
      ctaLabel: "先查这个 CA",
      ctaHref: "/check",
      secondaryCta: { href: "/leaderboard/high-risk-tokens", label: "高危样例榜" },
    },
    en: {
      title: "How to check pump.fun dev dump risk?",
      description: "Launch memes often have concentrated holdings, mint powers, and bundled sells. Check CA structure before hype.",
      assertion:
        "For pump.fun-style launches, verify CA, dev/bundle concentration, and sell path first — hype does not prevent dumps.",
      definition:
        "Launchpads speed listing and trading but do not remove privilege, concentration, or liquidity manipulation risk.",
      risk: "Tokens can go to zero in minutes; charts and chat can fake urgency.",
      howToDetect: [
        "Copy the exact mint/CA — not just short group links",
        "Scan CA for privileges, sellability, concentration-style signals (respect mode)",
        "Cross-check whether dev/bundle wallets still hold large supply",
        "Size small or wait; re-scan when reports go stale",
      ],
      faq: [
        ["On a leaderboard = safe?", "No. Boards are educational/delayed — always re-scan the CA."],
        ["Trust AI summaries?", "Prefer verifiable evidence plus mode/confidence."],
      ],
      relatedSignals: ["holderConcentration", "mintAuthority", "canSell", "freshDeploy"],
      signalTable: [
        { signal: "extreme concentration", severity: "CAUTION", plain: "Few wallets can dump" },
        { signal: "mint/freeze still on", severity: "CAUTION", plain: "Supply/rules may change" },
        { signal: "canSell issues", severity: "BLOCK", plain: "Exit path broken" },
        { signal: "fresh deploy", severity: "INFO", plain: "Thin history — higher uncertainty" },
      ],
      ctaLabel: "Scan this CA first",
      ctaHref: "/check",
      secondaryCta: { href: "/leaderboard/high-risk-tokens", label: "High-risk samples" },
    },
  },
  ...extraArticles,
} as Record<GeoArticleSlug, Record<Locale, ArticleBody>>;

export const geoArticleSlugs = Object.keys(articles) as GeoArticleSlug[];

export function getGeoArticle(slug: string, locale: Locale): GeoArticle | null {
  if (!(slug in articles)) return null;
  const body = articles[slug as GeoArticleSlug][locale];
  const isSolana = slug.includes("solana") || slug.includes("pump-fun");
  return {
    slug: slug as GeoArticleSlug,
    ...body,
    publishedAt: "2026-07-17",
    updatedAt: "2026-07-17",
    reviewedBy: "ChainVigil Research",
    sources: isSolana
      ? [
          { name: "Solana RPC documentation", url: "https://solana.com/docs/rpc" },
          { name: "Solana token documentation", url: "https://solana.com/docs/tokens" },
        ]
      : [
          { name: "GoPlus Token Security API", url: "https://docs.gopluslabs.io/reference/tokensecurityusingget_1" },
          { name: "Honeypot.is IsHoneypot API", url: "https://docs.honeypot.is/ishoneypot" },
        ],
  };
}

export function listGeoArticles(locale: Locale): GeoArticle[] {
  return geoArticleSlugs.map((slug) => ({ slug, ...articles[slug][locale] }));
}

export function buildGeoArticleJsonLd(article: GeoArticle, url: string, locale: Locale) {
  const severityLabel =
    locale === "zh"
      ? { BLOCK: "禁买/阻断", CAUTION: "谨慎", INFO: "提示" }
      : { BLOCK: "Block", CAUTION: "Caution", INFO: "Info" };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        abstract: article.assertion,
        inLanguage: locale === "zh" ? "zh-CN" : "en",
        mainEntityOfPage: url,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: { "@type": "Organization", name: article.reviewedBy ?? "ChainVigil AI", url: new URL("/about", url).toString() },
        publisher: {
          "@type": "Organization",
          name: "ChainVigil AI",
          slogan: locale === "zh" ? "买币前，先查 CA。" : "Before you buy, check the CA.",
        },
        citation: article.sources?.map((source) => source.url),
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
      {
        "@type": "Table",
        about: "Risk signal severity",
        name: locale === "zh" ? "风险信号对照表" : "Risk signal table",
        description: article.signalTable
          .map(
            (row) =>
              `${row.signal} | ${severityLabel[row.severity]} | ${row.plain}`,
          )
          .join(" · "),
      },
    ],
  };
}
