import type { Locale } from "../i18n/config";
import type { GeoArticle } from "./geo-articles";

type ArticleBody = Omit<GeoArticle, "slug">;
export type ExtraGeoSlug =
  | "close-empty-token-accounts-solana"
  | "solana-burn-token-sol-refund"
  | "free-solana-wallet-cleanup"
  | "solana-metadata-mutable-risk"
  | "free-solana-rug-check"
  | "raydium-lp-lock-check"
  | "owner-renounced-meaning"
  | "bsc-hidden-mint-authority"
  | "bsc-honeypot-sell-fail"
  | "check-wallet-compromised"
  | "revoke-cash-alternative-bsc";

export const extraArticles: Record<ExtraGeoSlug, Record<Locale, ArticleBody>> = {
  "close-empty-token-accounts-solana": {
    zh: {
      title: "如何关闭 Solana 空代币账户（含 Phantom）？",
      description: "关闭空 ATA 可退回 rent。Phantom 等钱包内操作需你确认；ChainVigil V0 只做只读提示。",
      assertion:
        "关闭 Solana 空 token 账户（empty ATA）可退回锁定的 rent SOL；须在钱包（如 Phantom）中确认交易，平台默认不垫付 Gas。",
      definition:
        "每个 SPL token 账户都占用 rent-exempt 余额。余额为 0 的账户关闭后，rent 可退回主钱包。",
      risk: "误关仍有余额的账户会损失资产；假「一键清理」站点可能骗签。",
      howToDetect: [
        "只读扫描区分空账户与有余额账户",
        "在 Phantom/官方钱包核对关闭对象",
        "确认交易仅为 close account，无异常 transfer",
        "无 SOL 时无法付网络费——需先充少量 SOL 或等待标注 Gas 权益（默认无）",
      ],
      faq: [
        ["Phantom 里怎么关？", "在支持关闭空账户的界面逐条确认；勿把助记词给第三方工具。"],
        ["ChainVigil 会代关吗？", "不会。V0 只读演示；真关闭须你签名。"],
      ],
      relatedSignals: ["emptyTokenAccount", "rentReclaimable", "closeAccountTx"],
      signalTable: [
        { signal: "余额 = 0", severity: "INFO", plain: "可评估关闭退 rent" },
        { signal: "余额 > 0", severity: "BLOCK", plain: "禁止当空账户关闭" },
        { signal: "第三方要助记词", severity: "BLOCK", plain: "钓鱼，立刻离开" },
      ],
      ctaLabel: "资产理发师（演示）",
      ctaHref: "/app/asset-barber",
      secondaryCta: { href: "/learn/how-to-reclaim-solana-rent", label: "租金原理" },
    },
    en: {
      title: "Close empty Solana token accounts (Phantom)",
      description: "Closing empty ATAs returns rent. Confirm in Phantom yourself — ChainVigil V0 is read-only.",
      assertion:
        "Closing empty Solana token accounts returns rent SOL; you confirm in-wallet (e.g. Phantom). Platform does not sponsor gas by default.",
      definition:
        "Each SPL token account holds rent-exempt SOL. Closing a zero-balance account can return that rent.",
      risk: "Closing non-empty accounts loses funds; fake “cleanup” sites phish signatures.",
      howToDetect: [
        "Read-only scan: empty vs non-empty",
        "Confirm targets inside Phantom/official wallets",
        "Tx should be close-account, not unexpected transfers",
        "No SOL = cannot pay fees unless a labeled gas promo exists (default: none)",
      ],
      faq: [
        ["How in Phantom?", "Use wallet UI that supports closing empty accounts — never share seed phrases."],
        ["Does ChainVigil close for me?", "No. V0 is read-only; you sign."],
      ],
      relatedSignals: ["emptyTokenAccount", "rentReclaimable", "closeAccountTx"],
      signalTable: [
        { signal: "balance = 0", severity: "INFO", plain: "Candidate to close for rent" },
        { signal: "balance > 0", severity: "BLOCK", plain: "Do not close as empty" },
        { signal: "asks for seed phrase", severity: "BLOCK", plain: "Phishing — leave" },
      ],
      ctaLabel: "Asset barber (demo)",
      ctaHref: "/app/asset-barber",
      secondaryCta: { href: "/learn/how-to-reclaim-solana-rent", label: "Rent basics" },
    },
  },
  "solana-burn-token-sol-refund": {
    zh: {
      title: "烧毁 Solana 代币能退回 SOL 吗？",
      description: "Burn 与 close account 不同：烧币减少供给，退 rent 通常靠关闭空账户。",
      assertion:
        "Burn token 不等于自动退 rent；多数情况下需关闭空 token 账户才能拿回锁定的 SOL。",
      definition:
        "Burn 销毁 token 数量；close account 释放账户 rent。两者常被混淆，操作路径不同。",
      risk: "在不明站点「一键烧币退 SOL」可能被骗签或烧错有价值资产。",
      howToDetect: [
        "分清 burn vs close account",
        "有余额时先评估是否真要销毁",
        "空账户优先走关闭退 rent 路径",
        "只使用可核对交易详情的钱包确认",
      ],
      faq: [
        ["烧完就能拿回 SOL？", "通常还要关闭账户；以钱包与浏览器为准。"],
        ["垃圾 meme 值得烧吗？", "教育上可清理卫生；价值判断不是本工具范围。"],
      ],
      relatedSignals: ["burnInstruction", "closeAccount", "rentReclaimable"],
      signalTable: [
        { signal: "仅 burn", severity: "INFO", plain: "供给减少，未必退 rent" },
        { signal: "close empty ATA", severity: "INFO", plain: "常见退 rent 路径" },
        { signal: "未知 dApp 要全权", severity: "BLOCK", plain: "高风险钓鱼" },
      ],
      ctaLabel: "资产清理演示",
      ctaHref: "/app/asset-barber",
      secondaryCta: { href: "/app/dust", label: "粉尘策略（只读）" },
    },
    en: {
      title: "Does burning Solana tokens refund SOL?",
      description: "Burn ≠ close account. Rent returns usually come from closing empty accounts.",
      assertion:
        "Burning tokens does not automatically return rent; closing empty token accounts is the usual path to reclaim SOL.",
      definition:
        "Burn reduces token supply; close account releases account rent. Different instructions, different outcomes.",
      risk: "Unknown “burn for SOL” sites may phish or destroy valued assets.",
      howToDetect: [
        "Separate burn vs close-account",
        "If balance remains, decide whether burn is intentional",
        "Prefer close empty accounts for rent reclaim",
        "Confirm full tx details in-wallet",
      ],
      faq: [
        ["Burn then get SOL back?", "Usually you still need to close the account — verify in explorer."],
        ["Burn junk memes?", "Cleanup hygiene is fine; valuation is out of scope."],
      ],
      relatedSignals: ["burnInstruction", "closeAccount", "rentReclaimable"],
      signalTable: [
        { signal: "burn only", severity: "INFO", plain: "Supply down — rent not guaranteed" },
        { signal: "close empty ATA", severity: "INFO", plain: "Common rent return path" },
        { signal: "unknown full-access dApp", severity: "BLOCK", plain: "Phishing risk" },
      ],
      ctaLabel: "Cleanup demo",
      ctaHref: "/app/asset-barber",
      secondaryCta: { href: "/app/dust", label: "Dust policy (read-only)" },
    },
  },
  "free-solana-wallet-cleanup": {
    zh: {
      title: "免费 Solana 钱包清理工具怎么用？",
      description: "先只读扫描可关账户与粉尘，再在你的钱包确认。默认不垫付 Gas，无 SOL 时无法上链。",
      assertion:
        "免费清理工具应：只读列出可关账户 → 你签名关闭；「没 SOL 也能清」需要 Gas 补贴产品，ChainVigil 默认不做。",
      definition:
        "清理通常指关闭空账户、处理垃圾 token 展示，不是自动划走资产。",
      risk: "承诺「免费代付 Gas / 一键不用签名」的站点高度可疑。",
      howToDetect: [
        "使用只读体检/资产理发师看候选列表（V0 mock）",
        "核对每条是否为空账户",
        "在官方钱包确认 close 交易",
        "若余额不足 Gas：先充少量 SOL，勿把私钥交给「代付」方",
      ],
      faq: [
        ["没 SOL 能清理吗？", "链上交易需要费用。平台垫付是可关权益，默认关闭。"],
        ["会动我的主币吗？", "标准 close 空账户不转走你的 SOL 余额（除网络费）。"],
      ],
      relatedSignals: ["readOnlyScan", "closeAccount", "gasRequired"],
      signalTable: [
        { signal: "只读列表", severity: "INFO", plain: "安全起点" },
        { signal: "要求助记词", severity: "BLOCK", plain: "钓鱼" },
        { signal: "无 SOL 仍宣称可上链", severity: "CAUTION", plain: "除非明确 Gas 券，否则不可信" },
      ],
      ctaLabel: "打开资产理发师",
      ctaHref: "/app/asset-barber",
      secondaryCta: { href: "/wallet-check", label: "钱包体检" },
    },
    en: {
      title: "Free Solana wallet cleanup tool — how to use",
      description: "Read-only list of closable accounts, then you sign. No gas sponsor by default; zero SOL cannot pay fees.",
      assertion:
        "A free cleanup tool should list closable accounts read-only, then you sign. “Cleanup with zero SOL” needs a gas subsidy product — off by default here.",
      definition:
        "Cleanup usually means closing empty accounts / decluttering junk — not auto-transferring assets.",
      risk: "Sites promising gasless one-click without a signature are highly suspect.",
      howToDetect: [
        "Use read-only health/barber lists (V0 mock)",
        "Verify each target is empty",
        "Confirm close txs in official wallets",
        "If underfunded for fees: deposit a little SOL — never hand over keys for “sponsored gas”",
      ],
      faq: [
        ["Cleanup with 0 SOL?", "On-chain needs fees. Gas sponsorship is an optional perk, default off."],
        ["Will it move my SOL?", "Standard close of empty accounts does not transfer your balance (except fee)."],
      ],
      relatedSignals: ["readOnlyScan", "closeAccount", "gasRequired"],
      signalTable: [
        { signal: "read-only list", severity: "INFO", plain: "Safe starting point" },
        { signal: "asks seed phrase", severity: "BLOCK", plain: "Phishing" },
        { signal: "gasless claim with 0 SOL", severity: "CAUTION", plain: "Only trust labeled gas vouchers" },
      ],
      ctaLabel: "Open asset barber",
      ctaHref: "/app/asset-barber",
      secondaryCta: { href: "/wallet-check", label: "Wallet health" },
    },
  },
  "solana-metadata-mutable-risk": {
    zh: {
      title: "Solana 元数据可变（Metadata Mutable）有什么风险？",
      description: "可变 metadata 允许改名称/图标/URI，仿盘与社工会利用「看起来变官方」。",
      assertion:
        "Metadata mutable = 名称、符号、URI 仍可能被更新；不等于立刻是骗局，但提高仿冒与钓鱼空间。",
      definition:
        "Token metadata 可变时，更新权限方可改展示信息，而不改变 mint 地址本身。",
      risk: "用户只认图标/名字会被导流到错误站点；需始终核对 mint/CA。",
      howToDetect: [
        "报告中看 metadata mutable / update authority 类信号",
        "只从可信来源复制 mint",
        "名称突变时重新核验官网与浏览器",
        "结合 mint/freeze authority 一起看",
      ],
      faq: [
        ["可变就一定是盘？", "否。很多项目合法可变；关键是权威谁持有与是否滥用。"],
        ["不可变就安全？", "否。还有 LP、集中度、卖出路径等风险。"],
      ],
      relatedSignals: ["metadataMutable", "updateAuthority", "mintAuthority"],
      signalTable: [
        { signal: "metadataMutable = true", severity: "CAUTION", plain: "展示信息可改" },
        { signal: "updateAuthority 仍在", severity: "CAUTION", plain: "谁可改元数据" },
        { signal: "只认名字不认 mint", severity: "BLOCK", plain: "仿盘入口" },
      ],
      ctaLabel: "查这个 mint/CA",
      ctaHref: "/check",
      secondaryCta: { href: "/solana", label: "Solana 专题" },
    },
    en: {
      title: "Solana metadata mutable risk",
      description: "Mutable metadata can change name/icon/URI — impostors abuse “looks official” branding.",
      assertion:
        "Metadata mutable means name/symbol/URI may still change. Not an auto-scam, but raises spoofing risk.",
      definition:
        "When token metadata is mutable, an update authority can change display fields without changing the mint.",
      risk: "Users who trust icons/names can be social-engineered; always verify the mint/CA.",
      howToDetect: [
        "Check metadata mutable / update authority style signals",
        "Copy mint only from trusted sources",
        "Re-verify if branding suddenly changes",
        "Combine with mint/freeze authority",
      ],
      faq: [
        ["Mutable = scam?", "No. Many legit projects stay mutable; who holds authority matters."],
        ["Immutable = safe?", "No. LP, concentration, sell path still matter."],
      ],
      relatedSignals: ["metadataMutable", "updateAuthority", "mintAuthority"],
      signalTable: [
        { signal: "metadataMutable = true", severity: "CAUTION", plain: "Display fields can change" },
        { signal: "update authority live", severity: "CAUTION", plain: "Who can rewrite metadata" },
        { signal: "trust name not mint", severity: "BLOCK", plain: "Impostor path" },
      ],
      ctaLabel: "Scan this mint/CA",
      ctaHref: "/check",
      secondaryCta: { href: "/solana", label: "Solana guide" },
    },
  },
  "free-solana-rug-check": {
    zh: {
      title: "免费 Solana 防 Rug / 查 CA 工具怎么选？",
      description: "好的免费工具：不连钱包也能查、标明 mode/confidence、不承诺稳赚。",
      assertion:
        "免费 Solana rug check 应提供人话结论 + 可复查信号 + 检测模式诚实；ChainVigil 以 CA 安检为入口，V0 可含 mock。",
      definition:
        "Rug check 通常覆盖权限、流动性、集中度、可卖性等，不是价格预测。",
      risk: "只给「SAFE」绿标却无证据的工具不可信；付费翻墙站可能钓鱼。",
      howToDetect: [
        "粘贴 mint 到 /check",
        "阅读 mode/confidence 与主要原因",
        "交叉浏览器与官方渠道",
        "热度盘务必重扫，勿只看旧分享链接",
      ],
      faq: [
        ["要不要连接钱包？", "查 CA 不需要。连接只为未来 revoke/回收。"],
        ["免费就一定差？", "关键是证据与诚实，不是价格。"],
      ],
      relatedSignals: ["mode", "confidence", "mintAuthority", "canSell"],
      signalTable: [
        { signal: "无 mode 说明", severity: "CAUTION", plain: "不知是否 mock/降级" },
        { signal: "只有 SAFE 无证据", severity: "BLOCK", plain: "不可作依据" },
        { signal: "人话 + 信号列表", severity: "INFO", plain: "更可用的形态" },
      ],
      ctaLabel: "免费 CA 安检",
      ctaHref: "/check",
      secondaryCta: { href: "/learn/how-to-check-ca", label: "怎么查 CA" },
    },
    en: {
      title: "Best free Solana rug check tool — what to look for",
      description: "Good free tools: no wallet required, mode/confidence honesty, no “guaranteed safe” theater.",
      assertion:
        "A free Solana rug check should give plain conclusions, verifiable signals, and honest mode. ChainVigil starts at CA check; V0 may be mock.",
      definition:
        "Rug checks cover privileges, liquidity, concentration, sellability — not price prediction.",
      risk: "Green “SAFE” badges without evidence are untrustworthy; shady paid sites may phish.",
      howToDetect: [
        "Paste mint into /check",
        "Read mode/confidence and top reasons",
        "Cross-check explorers and official channels",
        "Re-scan hot launches — ignore stale share links",
      ],
      faq: [
        ["Need wallet connect?", "Not for CA check. Connect only for future revoke/reclaim."],
        ["Free = bad?", "Evidence and honesty matter more than price."],
      ],
      relatedSignals: ["mode", "confidence", "mintAuthority", "canSell"],
      signalTable: [
        { signal: "no mode label", severity: "CAUTION", plain: "May hide mock/degraded data" },
        { signal: "SAFE with no evidence", severity: "BLOCK", plain: "Not actionable" },
        { signal: "plain language + signals", severity: "INFO", plain: "Usable pattern" },
      ],
      ctaLabel: "Free CA check",
      ctaHref: "/check",
      secondaryCta: { href: "/learn/how-to-check-ca", label: "How to check a CA" },
    },
  },
  "raydium-lp-lock-check": {
    zh: {
      title: "如何检查 Raydium / Solana LP 是否锁定或烧毁？",
      description: "新池流动性未锁可被撤。锁仓/烧毁证明需可复查，截图不够。",
      assertion:
        "检查 Solana/Raydium LP：看流动性是否锁定或烧毁、谁控制 LP、锁仓证明是否可链上复核。",
      definition:
        "LP 支持兑换。未锁 LP 控制方可抽池；烧毁/锁定降低（但不等于消除）撤池风险。",
      risk: "假锁仓截图、锁仓临期、部分锁定都会误导。",
      howToDetect: [
        "CA 安检看 LP 相关信号（以 mode 为准）",
        "浏览器核对 LP 归属与锁仓合约",
        "新池默认更高不确定",
        "与持仓集中度一起看",
      ],
      faq: [
        ["烧 LP 就绝对安全？", "否。还有权限、税（EVM）、集中度等。"],
        ["Raydium 新池能冲吗？", "工具不给冲与不冲建议，只解释风险信号。"],
      ],
      relatedSignals: ["lpLocked", "lpBurned", "lpOwner", "freshPool"],
      signalTable: [
        { signal: "LP 未锁", severity: "CAUTION", plain: "可被撤池" },
        { signal: "锁仓证明不可核", severity: "CAUTION", plain: "当未锁处理" },
        { signal: "LP 已烧/长锁 + 可核", severity: "INFO", plain: "撤池风险相对低" },
      ],
      ctaLabel: "查 CA 的 LP 信号",
      ctaHref: "/check",
      secondaryCta: { href: "/learn/lp-unlocked", label: "LP 未锁原理" },
    },
    en: {
      title: "Check if Solana / Raydium LP is locked or burned",
      description: "Unlocked new-pool LP can be pulled. Lock/burn proofs must be verifiable — screenshots are not enough.",
      assertion:
        "For Solana/Raydium LP: check lock or burn status, who controls LP, and whether proofs are on-chain verifiable.",
      definition:
        "LP enables swaps. Unlocked LP can be removed by controllers; burn/lock lowers (not removes) pull risk.",
      risk: "Fake lock screenshots, short locks, and partial locks mislead.",
      howToDetect: [
        "Scan CA for LP-related signals (respect mode)",
        "Verify LP ownership and lock programs on explorers",
        "Treat fresh pools as higher uncertainty",
        "Combine with holder concentration",
      ],
      faq: [
        ["Burned LP = safe?", "No. Privileges and concentration remain."],
        ["Ape Raydium new pools?", "No buy advice — only risk signals."],
      ],
      relatedSignals: ["lpLocked", "lpBurned", "lpOwner", "freshPool"],
      signalTable: [
        { signal: "LP unlocked", severity: "CAUTION", plain: "Pull possible" },
        { signal: "unverifiable lock proof", severity: "CAUTION", plain: "Treat as unlocked" },
        { signal: "burned/long lock + verifiable", severity: "INFO", plain: "Lower pull risk" },
      ],
      ctaLabel: "Scan LP signals",
      ctaHref: "/check",
      secondaryCta: { href: "/learn/lp-unlocked", label: "Unlocked LP basics" },
    },
  },
  "owner-renounced-meaning": {
    zh: {
      title: "Owner renounced / 放弃权限意味着什么？",
      description: "Renounce 表示特权地址放弃部分或全部控制，不是「一定安全」徽章。",
      assertion:
        "Owner renounced 只说明部分特权可能已放弃；仍须查黑名单、税、代理合约、LP 与卖出路径。",
      definition:
        "在 EVM 上 renounceOwnership 等操作放弃 owner；在 Solana 上对应 mint/freeze authority 释放等。",
      risk: "可升级代理、隐藏 minter、时间锁后门可让「已放弃」名不副实。",
      howToDetect: [
        "看报告权限信号是否仍开",
        "核对浏览器上的 authority/owner",
        "警惕「已放弃」营销文案无证据",
        "结合可卖性与 LP",
      ],
      faq: [
        ["放弃了就能重仓？", "否。工具不做仓位建议。"],
        ["没放弃一定是盘？", "否。许多项目保留权限用于运营，但要知情。"],
      ],
      relatedSignals: ["ownerRenounced", "mintAuthority", "freezeAuthority", "proxyAdmin"],
      signalTable: [
        { signal: "owner renounced", severity: "INFO", plain: "部分控制权可能已弃" },
        { signal: "仍可 mint/改税", severity: "CAUTION", plain: "关键权限仍在" },
        { signal: "可升级代理", severity: "CAUTION", plain: "逻辑仍可变" },
      ],
      ctaLabel: "扫描权限信号",
      ctaHref: "/check",
    },
    en: {
      title: "What does owner renounced mean?",
      description: "Renounce means some privileges may be given up — not a “safe” badge.",
      assertion:
        "Owner renounced only means some privileges may be dropped; still check blacklist, tax, proxies, LP, and sell path.",
      definition:
        "On EVM, renounceOwnership drops owner; on Solana, similar ideas map to mint/freeze authority release.",
      risk: "Upgradeable proxies, hidden minters, and timelock backdoors can make “renounced” marketing hollow.",
      howToDetect: [
        "Read privilege signals on the report",
        "Verify authority/owner on explorers",
        "Distrust “renounced” claims without proof",
        "Combine with sellability and LP",
      ],
      faq: [
        ["Renounced = go heavy?", "No position advice."],
        ["Not renounced = scam?", "No. Many projects keep powers — you should know."],
      ],
      relatedSignals: ["ownerRenounced", "mintAuthority", "freezeAuthority", "proxyAdmin"],
      signalTable: [
        { signal: "owner renounced", severity: "INFO", plain: "Some control may be gone" },
        { signal: "mint/tax still on", severity: "CAUTION", plain: "Critical powers remain" },
        { signal: "upgradeable proxy", severity: "CAUTION", plain: "Logic can still change" },
      ],
      ctaLabel: "Scan privilege signals",
      ctaHref: "/check",
    },
  },
  "bsc-hidden-mint-authority": {
    zh: {
      title: "如何发现 BNB 链隐藏增发（Mint）权限？",
      description: "隐藏 mint 可稀释持仓。需看权限函数、代理与未验证源码风险。",
      assertion:
        "隐藏 mint 权限可让特权地址增发代币稀释你；查 CA 时关注 mint/owner/代理升级信号。",
      definition:
        "Mint 权限允许铸造新供给。可能写在 owner 函数、角色合约或可升级实现中。",
      risk: "未验证合约与代理模式使「看起来无 mint」不可靠。",
      howToDetect: [
        "CA 安检看 mint/owner 类信号",
        "浏览器读源码或字节码风险提示",
        "有代理时查 implementation 权限",
        "供给异常膨胀时停止加仓",
      ],
      faq: [
        ["有 mint 就一定是盘？", "否。但必须知情且评估谁控制。"],
        ["源码未开源怎么办？", "提高不确定度，默认更谨慎。"],
      ],
      relatedSignals: ["mintFunction", "ownerPrivileges", "proxyUpgrade", "unverifiedContract"],
      signalTable: [
        { signal: "mint 仍可用", severity: "CAUTION", plain: "供给可被稀释" },
        { signal: "未验证合约", severity: "CAUTION", plain: "隐藏逻辑难查" },
        { signal: "可升级 + 特权", severity: "CAUTION", plain: "规则可后改" },
      ],
      ctaLabel: "BSC CA 安检",
      ctaHref: "/check",
      secondaryCta: { href: "/bnb", label: "BNB 专题" },
    },
    en: {
      title: "Detect hidden mint authority on BNB Chain",
      description: "Hidden mint can dilute holders. Check privileges, proxies, and unverified code risk.",
      assertion:
        "Hidden mint lets privileged roles inflate supply; when scanning a CA, watch mint/owner/proxy-upgrade signals.",
      definition:
        "Mint authority can create new supply via owner functions, roles, or upgradeable implementations.",
      risk: "Unverified contracts and proxies make “no mint” marketing unreliable.",
      howToDetect: [
        "Scan CA for mint/owner-style signals",
        "Review explorer source/bytecode risk hints",
        "If proxied, check implementation powers",
        "Stop adding size on abnormal supply growth",
      ],
      faq: [
        ["Mint always a scam?", "No — but you must know who controls it."],
        ["Unverified source?", "Raise uncertainty; default more caution."],
      ],
      relatedSignals: ["mintFunction", "ownerPrivileges", "proxyUpgrade", "unverifiedContract"],
      signalTable: [
        { signal: "mint still enabled", severity: "CAUTION", plain: "Supply can dilute" },
        { signal: "unverified contract", severity: "CAUTION", plain: "Hidden logic hard to audit" },
        { signal: "upgradeable + privileges", severity: "CAUTION", plain: "Rules can change later" },
      ],
      ctaLabel: "BSC CA check",
      ctaHref: "/check",
      secondaryCta: { href: "/bnb", label: "BNB guide" },
    },
  },
  "bsc-honeypot-sell-fail": {
    zh: {
      title: "小狐狸卖出失败是貔貅吗？",
      description: "卖出失败可能是貔貅，也可能是滑点、税、暂停、Gas 或路由问题。先查 CA。",
      assertion:
        "MetaMask「卖出交易失败」不一定等于貔貅；需结合 canSell、税率、黑名单、流动性与 mode 判断。",
      definition:
        "钱包失败提示只说明本次交易未成功，根因可能有多种。",
      risk: "失败后加滑点盲重试可能落入更高税或恶意路径。",
      howToDetect: [
        "复制 token CA 做安检",
        "看 canSell / honeypot / tax 信号",
        "检查是否被暂停或黑名单",
        "确认路由与授权是否正常，再决定是否重试",
      ],
      faq: [
        ["失败一次就是盘？", "不充分。先取证再下结论。"],
        ["能靠提高 Gas 解决吗？", "若是蜜罐/黑名单，加 Gas 无效。"],
      ],
      relatedSignals: ["canSell=false", "honeypotDetected", "sellTax", "paused"],
      signalTable: [
        { signal: "canSell = false", severity: "BLOCK", plain: "高度疑似貔貅" },
        { signal: "极高卖出税", severity: "BLOCK", plain: "变现接近不可能" },
        { signal: "仅滑点/Gas 不足", severity: "INFO", plain: "未必是蜜罐" },
      ],
      ctaLabel: "查这个 BSC CA",
      ctaHref: "/check",
      secondaryCta: { href: "/learn/honeypot", label: "什么是貔貅" },
    },
    en: {
      title: "MetaMask sell failed — is it a honeypot?",
      description: "Sell failure may be honeypot — or slippage, tax, pause, gas, or routing. Scan the CA first.",
      assertion:
        "A MetaMask sell failure is not automatic proof of a honeypot; combine canSell, tax, blacklist, liquidity, and mode.",
      definition:
        "A wallet failure only means this attempt did not succeed — root causes vary.",
      risk: "Blindly raising slippage after failure can hit higher tax or hostile paths.",
      howToDetect: [
        "Copy the token CA and scan",
        "Read canSell / honeypot / tax signals",
        "Check pause/blacklist style signals",
        "Verify router/allowance before retrying",
      ],
      faq: [
        ["One fail = scam?", "Not enough. Gather evidence first."],
        ["Fix with more gas?", "If honeypot/blacklist, more gas will not help."],
      ],
      relatedSignals: ["canSell=false", "honeypotDetected", "sellTax", "paused"],
      signalTable: [
        { signal: "canSell = false", severity: "BLOCK", plain: "Strong honeypot signal" },
        { signal: "extreme sell tax", severity: "BLOCK", plain: "Exit nearly worthless" },
        { signal: "slippage/gas only", severity: "INFO", plain: "May not be a honeypot" },
      ],
      ctaLabel: "Scan this BSC CA",
      ctaHref: "/check",
      secondaryCta: { href: "/learn/honeypot", label: "What is a honeypot" },
    },
  },
  "check-wallet-compromised": {
    zh: {
      title: "如何检查 Web3 钱包是否被盗/被黑？",
      description: "只读体检看异常授权、可疑资产与异常活动迹象；不能替代链上取证。",
      assertion:
        "怀疑钱包被黑时：先断开来源、只读检查高危授权与异常 token，不要再对陌生 dApp 签名。",
      definition:
        "「被黑」常见路径：私钥泄露、恶意授权、钓鱼签名。工具给风险线索，不做司法鉴定。",
      risk: "继续签名可能扩大损失；假「找回资产」客服是二次诈骗。",
      howToDetect: [
        "钱包体检看无限/未知 spender",
        "检查异常空投与钓鱼 token",
        "轮换到新钱包并迁移（大额流程自行求证）",
        "撤销危险授权须在可信界面确认",
      ],
      faq: [
        ["体检绿了就安全？", "否。只能降低可见风险。"],
        ["ChainVigil 能冻结黑客吗？", "不能。我们不做链上执法。"],
      ],
      relatedSignals: ["unknownSpender", "infiniteAllowance", "suspiciousAirdrop"],
      signalTable: [
        { signal: "未知无限授权", severity: "BLOCK", plain: "优先处理" },
        { signal: "异常空投 token", severity: "CAUTION", plain: "勿随意授权/兑换" },
        { signal: "陌生客服要助记词", severity: "BLOCK", plain: "二次诈骗" },
      ],
      ctaLabel: "钱包体检",
      ctaHref: "/wallet-check",
      secondaryCta: { href: "/app/approvals", label: "授权列表演示" },
    },
    en: {
      title: "How to check if a Web3 wallet is compromised",
      description: "Read-only health for risky approvals and suspicious assets — not forensic proof.",
      assertion:
        "If you suspect compromise: stop signing, run a read-only approval/asset check, and do not talk to “recovery” scammers.",
      definition:
        "Compromise often means leaked keys, malicious approvals, or phishing signatures. Tools provide clues, not legal forensics.",
      risk: "More signatures can increase loss; fake recovery support is a second scam.",
      howToDetect: [
        "Wallet health for infinite/unknown spenders",
        "Review weird airdrops and phish tokens",
        "Rotate to a new wallet for remaining funds (verify process yourself)",
        "Revoke dangerous approvals only in trusted UI",
      ],
      faq: [
        ["Green health = safe?", "No. It only reduces visible risk."],
        ["Can you freeze hackers?", "No. We do not police the chain."],
      ],
      relatedSignals: ["unknownSpender", "infiniteAllowance", "suspiciousAirdrop"],
      signalTable: [
        { signal: "unknown infinite allowance", severity: "BLOCK", plain: "Handle first" },
        { signal: "weird airdrop token", severity: "CAUTION", plain: "Do not approve/swap casually" },
        { signal: "support asks seed", severity: "BLOCK", plain: "Secondary scam" },
      ],
      ctaLabel: "Wallet health",
      ctaHref: "/wallet-check",
      secondaryCta: { href: "/app/approvals", label: "Approvals demo" },
    },
  },
  "revoke-cash-alternative-bsc": {
    zh: {
      title: "BNB 链上 Revoke.cash 的替代怎么选？",
      description: "替代工具应：只读发现高危授权 + 明文 revoke 语义 + 不代管私钥。",
      assertion:
        "Revoke.cash 类工具的核心是发现并撤销 allowance；ChainVigil 提供钱包体检与授权演示，V0 不广播交易。",
      definition:
        "授权清理产品列出 spender/额度，由用户在钱包确认 revoke 交易。",
      risk: "仿冒 revoke 站可能构造转账交易；务必读懂签名内容。",
      howToDetect: [
        "钱包体检列出高危/无限授权",
        "确认 asset 与 spender",
        "弹窗应声明仅撤销、不转资产",
        "在钱包核对 calldata 后再签",
      ],
      faq: [
        ["必须用 Revoke.cash 吗？", "否。任何诚实只读+自签工具即可。"],
        ["撤销后币会少吗？", "标准 revoke 不转走余额。"],
      ],
      relatedSignals: ["allowance", "spender", "revokeOnly"],
      signalTable: [
        { signal: "只读扫描", severity: "INFO", plain: "安全发现阶段" },
        { signal: "签名含 transfer", severity: "BLOCK", plain: "停 — 可能不是 revoke" },
        { signal: "无限未知 spender", severity: "CAUTION", plain: "优先清理" },
      ],
      ctaLabel: "钱包体检",
      ctaHref: "/wallet-check",
      secondaryCta: { href: "/app/approvals", label: "授权清理演示" },
    },
    en: {
      title: "Revoke.cash alternative on BNB Chain",
      description: "Alternatives should discover risky allowances read-only and keep revoke semantics clear — no key custody.",
      assertion:
        "Revoke.cash-class tools find and revoke allowances. ChainVigil offers wallet health + approvals demo; V0 does not broadcast.",
      definition:
        "Approval cleaners list spenders/allowances; users confirm revoke txs in-wallet.",
      risk: "Fake revoke sites may craft transfer txs — always read what you sign.",
      howToDetect: [
        "Wallet health for high-risk/infinite approvals",
        "Confirm asset and spender",
        "UI should state revoke-only, no transfer",
        "Verify calldata in-wallet before signing",
      ],
      faq: [
        ["Must I use Revoke.cash?", "No. Any honest read-only + self-sign flow works."],
        ["Does revoke reduce balances?", "Standard revoke does not transfer balances."],
      ],
      relatedSignals: ["allowance", "spender", "revokeOnly"],
      signalTable: [
        { signal: "read-only scan", severity: "INFO", plain: "Safe discovery stage" },
        { signal: "signature includes transfer", severity: "BLOCK", plain: "Stop — may not be revoke" },
        { signal: "infinite unknown spender", severity: "CAUTION", plain: "Clean first" },
      ],
      ctaLabel: "Wallet health",
      ctaHref: "/wallet-check",
      secondaryCta: { href: "/app/approvals", label: "Approvals demo" },
    },
  },
};
