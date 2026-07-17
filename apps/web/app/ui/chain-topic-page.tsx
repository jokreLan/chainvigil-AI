import Link from "next/link";
import { listMockRiskDatabaseEntries } from "@chainvigil/risk-core";
import { getServerT } from "../i18n/server";
import { RiskBadge } from "./risk-badge";

export type ChainTopic = "solana" | "bsc";

interface ChainTopicPageProps {
  chain: ChainTopic;
}

export async function ChainTopicPage({ chain }: ChainTopicPageProps) {
  const { t, locale } = await getServerT();
  const entries = listMockRiskDatabaseEntries(locale).slice(0, 3);
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/${chain === "bsc" ? "bnb" : "solana"}`;
  const isSol = chain === "solana";

  const topic = isSol
    ? {
        title: t("chain.solTitle"),
        shortName: "Solana",
        description: t("chain.solDesc"),
        chainLabel: "Solana（SOL）",
        concerns: ["Mint / Freeze Authority", "Liquidity verifiability", "Top-10 concentration"],
        faq:
          locale === "zh"
            ? ([
                [
                  "Solana Token 安检会连接我的钱包吗？",
                  "不会。V0 只接受公开 CA 或链接进行只读 mock 风险报告，不要求连接钱包、签名或交易。",
                ],
                [
                  "为什么需要核对 Solana Token 的 CA？",
                  "同名或相似名称的 Token 可能指向不同地址。唯一 CA 是核对项目身份和进一步检查的起点。",
                ],
                [
                  "Solana 报告是投资建议吗？",
                  "不是。报告仅解释基础风险信号和 V0 mock 证据，链上状态可能变化，交易前应再次核验。",
                ],
              ] as const)
            : ([
                [
                  "Does a Solana check connect my wallet?",
                  "No. V0 only accepts a public CA or link for a read-only mock report — no connect, sign, or trade.",
                ],
                [
                  "Why verify the Solana CA?",
                  "Same or similar names can map to different addresses. The unique CA is the starting point for identity and further checks.",
                ],
                [
                  "Is the Solana report investment advice?",
                  "No. It explains basic risk signals and V0 mock evidence. On-chain state can change — re-verify before trading.",
                ],
              ] as const),
      }
    : {
        title: t("chain.bnbTitle"),
        shortName: "BNB Smart Chain",
        description: t("chain.bnbDesc"),
        chainLabel: "BNB Smart Chain（BNB / BSC）",
        concerns: ["Buy/sell & high tax", "Owner / blacklist powers", "LP lock & concentration"],
        faq:
          locale === "zh"
            ? ([
                [
                  "BNB Token 安检会发起交易吗？",
                  "不会。V0 只生成公开 CA 的只读 mock 风险报告，不会请求签名、执行 swap 或广播交易。",
                ],
                [
                  "为什么 BNB Token 要先查 CA？",
                  "名称和图标可以被仿造，CA 是识别合约实例的唯一入口。先查 CA 能避免把同名仿盘当成官方代币。",
                ],
                [
                  "检测到风险是否代表一定无法交易？",
                  "不代表。风险等级只说明当前可见信号，不能保证合约状态、流动性或价格未来不变，也不构成投资建议。",
                ],
              ] as const)
            : ([
                [
                  "Does a BNB check broadcast a trade?",
                  "No. V0 only builds a read-only mock risk report for a public CA — no signing, swaps, or broadcasts.",
                ],
                [
                  "Why check the BNB CA first?",
                  "Names and icons can be faked. The CA uniquely identifies the contract instance and helps avoid same-name scams.",
                ],
                [
                  "Does a risk label mean I cannot trade?",
                  "No. Levels describe currently visible signals only. They do not guarantee future state and are not investment advice.",
                ],
              ] as const),
      };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `${topic.title}｜ChainVigil AI`,
        description: topic.description,
        url,
        inLanguage: locale === "zh" ? "zh-CN" : "en",
        about: { "@type": "Thing", name: topic.chainLabel },
      },
      {
        "@type": "FAQPage",
        mainEntity: topic.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ChainVigil AI", item: baseUrl },
          { "@type": "ListItem", position: 2, name: topic.shortName, item: url },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 pb-28 md:px-8 md:pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          {t("brand.name")}
        </Link>
        <div className="flex flex-wrap gap-4">
          <Link href="/solana">Solana</Link>
          <Link href="/bnb">BNB</Link>
          <Link href="/risk-database">{t("common.riskDb")}</Link>
          <Link href="/check" className="text-[#c0c1ff]">
            {t("nav.check")}
          </Link>
        </div>
      </nav>

      <section className="mx-auto mt-12 max-w-4xl">
        <p className="text-sm font-semibold text-[#c0c1ff]">
          {topic.chainLabel} · V0 RISK GUIDE
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-[#f9fafb] sm:text-5xl">{topic.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#c7c4d7]">{topic.description}</p>
        <Link
          href="/check"
          className="mt-8 inline-flex min-h-12 items-center rounded-md bg-[#8083ff] px-5 text-sm font-semibold text-[#0d0096] transition hover:bg-[#c0c1ff]"
        >
          {t("chain.checkCa")}
        </Link>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
        {topic.concerns.map((concern, index) => (
          <article key={concern} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
            <p className="text-xs font-semibold text-[#c0c1ff]">0{index + 1}</p>
            <h2 className="mt-4 text-lg font-semibold text-[#f9fafb]">{concern}</h2>
            <p className="mt-3 text-sm leading-6 text-[#9ca3af]">{t("chain.crossCheck")}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-14 max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#c0c1ff]">RISK TERMS</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#f9fafb]">{t("chain.riskTerms")}</h2>
          </div>
          <Link href="/risk-database" className="text-sm font-semibold text-[#c0c1ff]">
            {t("chain.enterRiskDb")}
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-[#f9fafb]">{entry.title}</h3>
                <RiskBadge level={entry.severity} />
              </div>
              <p className="mt-3 text-sm leading-6 text-[#c7c4d7]">{entry.plainLanguage}</p>
              <p className="mt-4 border-t border-[#262932] pt-4 text-sm leading-6 text-[#c0c1ff]">
                {entry.recommendedAction}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-4xl rounded-lg border border-[#262932] bg-[#16181d] p-6 md:p-8">
        <p className="text-sm font-semibold text-[#c0c1ff]">FAQ</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#f9fafb]">
          {topic.shortName} {t("chain.faqTitle")}
        </h2>
        <div className="mt-6 divide-y divide-[#262932]">
          {topic.faq.map(([question, answer]) => (
            <article key={question} className="py-5 first:pt-0">
              <h3 className="font-semibold text-[#f9fafb]">{question}</h3>
              <p className="mt-3 leading-7 text-[#c7c4d7]">{answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
