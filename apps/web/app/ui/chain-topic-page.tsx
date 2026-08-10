import Link from "next/link";
import { getServerT } from "../i18n/server";
import { DappIcon, type DappIconName } from "./dapp-icon";
import { WebsiteFooter } from "./website-footer";
import { WebsiteHeader } from "./website-header";

export type ChainTopic = "solana" | "bsc";

interface ChainTopicPageProps {
  chain: ChainTopic;
}

interface VectorCard {
  title: string;
  subtitle: string;
  body: string;
  severity: string;
  accent: string;
  icon: DappIconName;
}

export async function ChainTopicPage({ chain }: ChainTopicPageProps) {
  const { locale } = await getServerT();
  const zh = locale === "zh";
  const isSol = chain === "solana";
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/${isSol ? "solana" : "bnb"}`;

  const faq = isSol
    ? zh
      ? [
          [
            "什么是貔貅盘？",
            "貔貅盘通常允许买入却限制卖出。应结合模拟交易、权限状态、流动性和公开 CA 进行交叉核验。",
          ],
          [
            "为什么检查 Top 10 持仓？",
            "高度集中的持仓可能放大抛售、操纵和流动性风险，但集中度不能单独作为结论。",
          ],
          [
            "可变元数据有什么风险？",
            "名称、图标或描述可被后续修改时，项目展示与最初认知可能不一致，应继续核对官方来源。",
          ],
        ]
      : [
          [
            "What is a honeypot?",
            "A honeypot commonly allows buying while restricting selling. Cross-check simulation, authority, liquidity, and the public CA.",
          ],
          [
            "Why check Top 10 holders?",
            "High concentration can amplify dumping, manipulation, and liquidity risk, but it is not a conclusion by itself.",
          ],
          [
            "What is mutable metadata risk?",
            "If names, icons, or descriptions can change later, the displayed identity may diverge from what you first reviewed.",
          ],
        ]
    : zh
      ? [
          [
            "什么是代理合约？",
            "代理模式允许逻辑升级。它不一定危险，但应明确管理员、升级权限、实现地址与时间锁。",
          ],
          [
            "为什么检查隐藏 Mint？",
            "可增发或变更余额的权限可能稀释持仓或破坏供应假设，需要结合源码、字节码和权限状态核验。",
          ],
          [
            "检测结果可以替代审计吗？",
            "不可以。V0 页面用于只读风险教育与 mock/readiness 验收，不替代正式审计与独立尽调。",
          ],
        ]
      : [
          [
            "What is a proxy contract?",
            "A proxy can upgrade contract logic. It is not inherently unsafe, but admins, upgrade rights, implementations, and timelocks matter.",
          ],
          [
            "Why check for hidden mints?",
            "Supply-changing or balance-changing privileges can dilute holders or invalidate supply assumptions.",
          ],
          [
            "Can this replace an audit?",
            "No. V0 is read-only risk education and mock/readiness validation, not a formal audit or independent due diligence.",
          ],
        ];

  const vectors: VectorCard[] = isSol
    ? [
        {
          title: "Mint Authority",
          subtitle: zh ? "增发权限" : "Supply control",
          body: zh
            ? "若仍为 active，创建者可能继续增发代币并稀释持仓。优先核验权限是否已撤销及证据来源。"
            : "If active, the creator may mint more supply and dilute holders. Verify revocation and the evidence source.",
          severity: "Critical",
          accent: "#fda4af",
          icon: "alert",
        },
        {
          title: "Freeze Authority",
          subtitle: zh ? "冻结权限" : "Transfer control",
          body: zh
            ? "冻结权限可限制特定账户转账。它不等于貔貅，但必须与交易模拟和项目说明一起审查。"
            : "Freeze authority can restrict transfers for selected accounts. Review it with simulation and project disclosures.",
          severity: "High",
          accent: "#f9c56a",
          icon: "radar",
        },
        {
          title: "LP Lock / Burn",
          subtitle: zh ? "流动性可验证性" : "Liquidity verifiability",
          body: zh
            ? "LP 是否销毁、锁定或由集中地址持有，会影响撤池与 rug 风险；链上状态需在交互前再次核验。"
            : "Whether LP is burned, locked, or concentrated affects withdrawal and rug risk. Re-check before interaction.",
          severity: "High",
          accent: "#9de32e",
          icon: "chart",
        },
      ]
    : [
        {
          title: zh ? "税率分析" : "Tax Analysis",
          subtitle: zh
            ? "买卖费用与可修改税率"
            : "Buy/sell fees and mutable tax",
          body: zh
            ? "极端或可修改税率可能阻断卖出。应区分当前模拟结果、合约上限和 Owner 可变更权限。"
            : "Extreme or mutable taxes may block exits. Separate current simulation, contract limits, and owner privileges.",
          severity: "Critical",
          accent: "#fda4af",
          icon: "alert",
        },
        {
          title: zh ? "Owner 权限" : "Owner Privileges",
          subtitle: zh
            ? "黑名单、暂停与增发"
            : "Blacklist, pause, and mint controls",
          body: zh
            ? "保留的控制函数可能冻结地址、暂停交易或增发。需核验 Owner、代理管理员和时间锁。"
            : "Retained controls may blacklist addresses, pause trading, or mint supply. Verify owners, proxy admins, and timelocks.",
          severity: "High",
          accent: "#f9c56a",
          icon: "radar",
        },
        {
          title: zh ? "LP 状态" : "Liquidity Status",
          subtitle: zh
            ? "锁定、集中与撤池风险"
            : "Lock, concentration, and withdrawal risk",
          body: zh
            ? "LP 由普通地址集中持有或缺少可验证锁定时，流动性可能被快速移除。"
            : "When LP is concentrated in EOAs or lacks a verifiable lock, liquidity may be removed quickly.",
          severity: "High",
          accent: "#9de32e",
          icon: "chart",
        },
      ];

  const title = isSol
    ? zh
      ? "Solana 风险教育与 V0 范围参考"
      : "Solana Risk Education & V0 Scope Reference"
    : zh
      ? "BNB Chain 风险情报与 V0 范围参考"
      : "BNB Chain Risk Intelligence & V0 Scope Reference";
  const description = isSol
    ? zh
      ? "识别 SPL Token 中的 Mint / Freeze 权限、流动性可验证性与集中持仓风险。所有状态均需以实际证据 Provider 响应为准。"
      : "Identify mint/freeze authority, liquidity verifiability, and concentration risk in SPL tokens. All states depend on actual provider evidence."
    : zh
      ? "识别 BSC 合约中的高税、卖出限制、Owner 权限、黑名单和 LP 风险。页面只做只读教育，不执行交易。"
      : "Identify high tax, sell restrictions, owner privileges, blacklists, and LP risk on BSC. This page is read-only education and never executes trades.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `${title}｜ChainVigil`,
        description,
        url,
        inLanguage: zh ? "zh-CN" : "en",
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <main className="cv-website-page min-h-screen pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WebsiteHeader active="learn" />

      <div className="hidden md:block">
        <section className="border-b border-[#3b494c]/45 px-8 py-20">
          <div className="mx-auto grid max-w-[1536px] gap-12 lg:grid-cols-[1.8fr_1fr] lg:items-start">
            <div>
              <p className="flex items-center gap-3 cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#c3f5ff]">
                <span className="size-2 rounded-full bg-[#849396]" />{" "}
                {isSol
                  ? "Protocol Intelligence · SLP-V2"
                  : "Contract Intelligence · BSC-V2"}
              </p>
              <h1 className="mt-7 max-w-5xl cv-font-display text-5xl font-semibold leading-tight tracking-[-0.035em] text-[#dce4e5]">
                {title}
              </h1>
              <p className="mt-6 max-w-4xl text-lg leading-8 text-[#bac9cc]">
                {description}
              </p>
              <p className="mt-4 max-w-4xl text-sm leading-6 text-[#849396]">
                {zh
                  ? "所有地址、指标和结论均为教育结构或 mock/readiness 示例，不构成实时列表、正式审计或投资建议。"
                  : "All addresses, metrics, and conclusions are educational structures or mock/readiness examples—not a live list, formal audit, or investment advice."}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/check"
                  className="inline-flex min-h-12 min-w-64 items-center justify-center gap-3 bg-[#c3f5ff] px-6 cv-font-mono text-xs font-semibold uppercase text-[#00363d] transition hover:bg-[#9cf0ff]"
                >
                  <DappIcon name="scan" className="size-5" />{" "}
                  {zh ? "开始只读检查" : "Start read-only check"}
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex min-h-12 min-w-52 items-center justify-center gap-3 border border-[#3b494c] px-6 cv-font-mono text-xs font-semibold uppercase text-[#dce4e5] transition hover:border-[#c3f5ff]"
                >
                  <DappIcon name="document" className="size-5" />{" "}
                  {zh ? "查看方法论" : "View methodology"}
                </Link>
              </div>
            </div>

            <aside className="cv-website-panel cv-website-scanline p-6">
              <div className="flex items-center justify-between border-b border-[#3b494c]/55 pb-4 cv-font-mono text-xs font-semibold uppercase text-[#bac9cc]">
                <span>
                  {zh ? "覆盖 / 就绪映射" : "Coverage / Readiness Map"}
                </span>
                <span className="text-[#c3f5ff]">
                  {isSol ? "SLP-V2" : "BSC-V2"}
                </span>
              </div>
              <div className="mt-4 grid gap-4 text-sm text-[#bac9cc]">
                {(isSol
                  ? [
                      "Mint authority detection",
                      "Freeze authority state",
                      "LP lock verification",
                      "Top 10 holder density",
                    ]
                  : [
                      "Tax simulation",
                      "Owner privilege map",
                      "LP concentration",
                      "Approval exposure",
                    ]
                ).map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between gap-4"
                  >
                    <span>{item}</span>
                    <span className="inline-flex items-center gap-2 cv-font-mono text-[10px] uppercase text-[#9de32e]">
                      <span className="size-2 border border-current" /> Rule
                      mapped
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid min-h-40 place-items-center border border-[#3b494c]/55 bg-[#081012] text-center">
                <div>
                  <DappIcon
                    name="radar"
                    className="mx-auto size-11 text-[#c3f5ff]"
                  />
                  <p className="mt-4 cv-font-mono text-xs uppercase text-[#bac9cc]">
                    {zh
                      ? "证据 Provider 依赖配置"
                      : "Evidence provider dependent"}
                  </p>
                  <p className="mt-2 cv-font-mono text-[10px] uppercase text-[#849396]">
                    Signatures: disabled · Swaps: disabled
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-[#3b494c]/45 bg-[#151d1e]/62 px-8 py-14">
          <div className="mx-auto max-w-[1536px]">
            <h2 className="cv-font-display text-3xl font-semibold text-[#dce4e5]">
              {zh ? "主要风险向量" : "Primary Risk Vectors"}
            </h2>
            <p className="mt-2 text-sm text-[#bac9cc]">
              {zh
                ? "用于解释启发式引擎关注的关键合约参数。"
                : "A reference for the key contract parameters reviewed by the heuristic engine."}
            </p>
            <div className="mt-10 grid border-l border-t border-[#3b494c] lg:grid-cols-3">
              {vectors.map((vector) => (
                <article
                  key={vector.title}
                  className="min-h-[330px] border-b border-r border-[#3b494c] bg-[#081012]/75 p-7"
                >
                  <span
                    className="grid size-12 place-items-center rounded-full bg-[#242b2d]"
                    style={{ color: vector.accent }}
                  >
                    <DappIcon name={vector.icon} className="size-7" />
                  </span>
                  <p
                    className="mt-7 cv-font-mono text-[10px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: vector.accent }}
                  >
                    {vector.severity} · {vector.subtitle}
                  </p>
                  <h3 className="mt-3 cv-font-display text-2xl font-semibold text-[#dce4e5]">
                    {vector.title}
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-[#bac9cc]">
                    {vector.body}
                  </p>
                  <div className="mt-8 flex items-center justify-between border-t border-[#3b494c]/55 pt-4 cv-font-mono text-[10px] uppercase text-[#849396]">
                    <span>Evidence required</span>
                    <span>Read-only</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {!isSol ? (
          <section className="px-8 py-16">
            <div className="mx-auto grid max-w-[1536px] gap-6 lg:grid-cols-2">
              <article className="cv-website-panel p-7">
                <h2 className="cv-font-display text-2xl font-semibold text-[#dce4e5]">
                  {zh ? "授权暴露只读检查" : "Approval Exposure Review"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#bac9cc]">
                  {zh
                    ? "粘贴公开地址后仅生成风险说明；不会连接钱包、广播撤权或请求签名。"
                    : "Paste a public address for risk guidance only. No wallet connection, revoke broadcast, or signature request."}
                </p>
                <Link
                  href="/approvals"
                  className="mt-7 inline-flex min-h-11 items-center border border-[#3b494c] px-5 cv-font-mono text-xs uppercase text-[#c3f5ff] hover:border-[#c3f5ff]"
                >
                  {zh ? "打开只读授权检查" : "Open read-only approval check"}
                </Link>
              </article>
              <article className="cv-website-panel p-7">
                <h2 className="cv-font-display text-2xl font-semibold text-[#dce4e5]">
                  {zh ? "貔貅结构手册" : "Honeypot Architecture"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#bac9cc]">
                  {zh
                    ? "阅读常见卖出限制、白名单与路由器识别模式，建立交互前核验习惯。"
                    : "Study sell restrictions, whitelist controls, and router patterns before interaction."}
                </p>
                <Link
                  href="/learn/honeypot"
                  className="mt-7 inline-flex min-h-11 items-center border border-[#3b494c] px-5 cv-font-mono text-xs uppercase text-[#c3f5ff] hover:border-[#c3f5ff]"
                >
                  {zh ? "访问文档" : "Access documentation"}
                </Link>
              </article>
            </div>
          </section>
        ) : null}

        <WebsiteFooter />
      </div>

      <div className="md:hidden">
        <section className="px-4 pb-9 pt-8">
          {isSol ? (
            <div className="cv-website-panel cv-website-scanline p-5">
              <p className="flex items-center gap-2 cv-font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#c3f5ff]">
                <span className="size-2 rounded-full bg-[#c3f5ff] shadow-[0_0_12px_rgba(195,245,255,0.7)]" />{" "}
                Solana Intel HQ
              </p>
              <h1 className="mt-6 cv-font-display text-4xl font-semibold leading-tight text-[#dce4e5]">
                {zh ? "风险行动手册" : "Risk Operations Manual."}
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#bac9cc]">
                {zh
                  ? "用于识别 SPL Token 貔貅、rug 与关键结构风险的分类简报。"
                  : "Classified briefing on identifying honeypots, rugs, and terminal structural flaws in SPL tokens."}
              </p>
            </div>
          ) : (
            <div>
              <p className="flex items-center gap-2 text-sm uppercase text-[#bac9cc]">
                <DappIcon name="shield" className="size-5 text-[#c3f5ff]" /> BNB
                Chain Risk Intelligence
              </p>
              <h1 className="mt-4 cv-font-display text-2xl font-semibold text-[#dce4e5]">
                {zh ? "合约风险评估指南" : "Contract Risk Assessment Guide"}
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#bac9cc]">
                {zh
                  ? "面向 BSC Token 的只读分析参数。不要轻信，始终核验。"
                  : "Read-only analysis parameters for BSC tokens. Do not trust—verify."}
              </p>
              <div className="cv-website-panel mt-6">
                <div className="flex items-center justify-between border-b border-[#3b494c] px-4 py-3 cv-font-mono text-xs uppercase">
                  <span className="text-[#9de32e]">Readiness Status</span>
                  <span className="text-[#849396]">Provider dependent</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  {[
                    zh ? "税率规则" : "Tax rules",
                    zh ? "权限映射" : "Privilege map",
                    zh ? "LP 规则" : "LP rules",
                    zh ? "授权教育" : "Approval guide",
                  ].map((item) => (
                    <div
                      key={item}
                      className="border-b border-r border-[#3b494c]/55 p-4"
                    >
                      <p className="text-[#bac9cc]">{item}</p>
                      <p className="mt-2 cv-font-mono text-[10px] uppercase text-[#9de32e]">
                        Mapped · no live claim
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="border-t border-[#3b494c]/55 px-4 py-8">
          <h2 className="cv-font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#849396]">
            {zh ? "关键风险向量" : "Critical Vectors"}
          </h2>
          <div className="mt-5 grid gap-4">
            {vectors.map((vector) => (
              <article
                key={vector.title}
                className="cv-website-panel border-l-4 p-5"
                style={{ borderLeftColor: vector.accent }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 cv-font-display text-2xl font-semibold text-[#dce4e5]">
                    <DappIcon
                      name={vector.icon}
                      className="size-6"
                      style={{ color: vector.accent }}
                    />
                    {vector.title}
                  </h3>
                  <span
                    className="shrink-0 border px-2 py-1 cv-font-mono text-[10px] font-semibold uppercase"
                    style={{ borderColor: vector.accent, color: vector.accent }}
                  >
                    {vector.severity}
                  </span>
                </div>
                <p className="mt-5 text-base leading-7 text-[#bac9cc]">
                  {vector.body}
                </p>
                <div className="mt-5 border border-[#3b494c]/60 bg-[#081012] px-3 py-3 cv-font-mono text-[11px] uppercase text-[#849396]">
                  {zh ? "状态：需要实际证据" : "Status: evidence required"}
                </div>
              </article>
            ))}
          </div>
        </section>

        {isSol ? (
          <section className="px-4 py-8">
            <h2 className="cv-font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#849396]">
              {zh ? "操作策略" : "Operational Tactics"}
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Link
                href="/app/asset-barber"
                className="cv-website-panel min-h-48 p-5"
              >
                <DappIcon name="scan" className="size-8 text-[#c3f5ff]" />
                <h3 className="mt-5 cv-font-display text-xl font-semibold text-[#dce4e5]">
                  Asset Barber
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#bac9cc]">
                  {zh
                    ? "公开地址演示空账户与租金回收教育流程。"
                    : "Public-address demo for empty accounts and rent reclaim education."}
                </p>
              </Link>
              <Link
                href="/learn/how-to-reclaim-solana-rent"
                className="cv-website-panel min-h-48 p-5"
              >
                <DappIcon name="wallet" className="size-8 text-[#c3f5ff]" />
                <h3 className="mt-5 cv-font-display text-xl font-semibold text-[#dce4e5]">
                  Rent Reclaim
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#bac9cc]">
                  {zh
                    ? "理解账户租金与实际操作前的核验步骤。"
                    : "Understand account rent and checks required before any action."}
                </p>
              </Link>
            </div>
          </section>
        ) : (
          <>
            <section className="border-t border-[#3b494c]/55 px-4 py-8">
              <h2 className="flex items-center gap-2 text-sm uppercase text-[#bac9cc]">
                <DappIcon name="radar" className="size-4" />{" "}
                {zh
                  ? "钱包授权扫描（只读样例）"
                  : "Wallet Approval Scanner (Read-only sample)"}
              </h2>
              <div className="mt-5 grid gap-3">
                {[
                  [
                    "Unlimited spend",
                    "PancakeSwap V2 Router",
                    "High-risk sample",
                    "#fda4af",
                  ],
                  [
                    "Limited allowance",
                    "Unknown contract",
                    "Moderate sample",
                    "#f9c56a",
                  ],
                ].map(([label, spender, badge, color]) => (
                  <article
                    key={label}
                    className="border-2 bg-[#151d1e] p-4"
                    style={{ borderColor: color }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className="cv-font-mono text-xs font-semibold uppercase"
                          style={{ color }}
                        >
                          {label}
                        </p>
                        <p className="mt-1 text-sm text-[#bac9cc]">{spender}</p>
                      </div>
                      <span
                        className="border px-2 py-1 cv-font-mono text-[10px] uppercase"
                        style={{ borderColor: color, color }}
                      >
                        {badge}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href="/approvals"
                        className="flex min-h-11 items-center justify-center border border-[#3b494c] cv-font-mono text-[10px] uppercase text-[#c3f5ff]"
                      >
                        {zh ? "查看说明" : "Review guidance"}
                      </Link>
                      <span className="flex min-h-11 items-center justify-center border border-[#3b494c] cv-font-mono text-[10px] uppercase text-[#849396]">
                        No revoke / No sign
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="border-t border-[#3b494c]/55 px-4 py-8">
              <h2 className="flex items-center gap-2 text-sm uppercase text-[#bac9cc]">
                <DappIcon name="terminal" className="size-4" />{" "}
                {zh ? "貔貅结构示意" : "Anatomy of a Honeypot"}
              </h2>
              <pre className="mt-5 overflow-hidden border border-[#3b494c] bg-[#020608] p-4 cv-font-mono text-[9px] leading-5 text-[#c3f5ff]">{`function transfer(from, to, amount) {
  require(!blocked[from]);
  require(tradingOpen || allowed[from]);
  // sample structure — not executable code
}`}</pre>
              <p className="mt-4 border-l-2 border-[#c3f5ff] pl-4 text-sm leading-6 text-[#bac9cc]">
                {zh
                  ? "典型结构会允许买入，却通过恶意条件限制特定钱包卖出。任何单一代码片段都不足以形成结论。"
                  : "A typical pattern allows buying but restricts selling for selected wallets. No single snippet is sufficient for a conclusion."}
              </p>
            </section>
          </>
        )}

        <section className="border-t border-[#3b494c]/55 px-4 py-8">
          <h2 className="cv-font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#849396]">
            FAQ / Protocol Specs
          </h2>
          <div className="mt-5 border-l border-t border-[#3b494c]">
            {faq.map(([question, answer]) => (
              <details
                key={question}
                className="group border-b border-r border-[#3b494c] bg-[#151d1e]/80"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 cv-font-display text-base font-semibold text-[#dce4e5] [&::-webkit-details-marker]:hidden">
                  {question}
                  <span className="text-[#849396] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t border-[#3b494c]/55 px-5 py-4 text-sm leading-6 text-[#bac9cc]">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <p className="px-6 pb-8 text-center cv-font-mono text-[9px] uppercase leading-5 tracking-[0.09em] text-[#849396]">
          {zh
            ? "数据仅供风险教育。链上状态会变化；任何自动化审计都不能保证安全。"
            : "Data is for risk education only. On-chain state changes; no automated review can guarantee safety."}
        </p>
      </div>

      <Link
        href="/check"
        className="fixed inset-x-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex min-h-14 items-center justify-center gap-2 bg-[#c3f5ff] cv-font-mono text-xs font-semibold uppercase tracking-[0.05em] text-[#00363d] shadow-[0_0_22px_rgba(0,229,255,0.32)] md:hidden"
      >
        <DappIcon name="shield" className="size-5" />{" "}
        {zh ? "安检 CA（查 CA）" : "Audit CA"}
      </Link>
    </main>
  );
}
