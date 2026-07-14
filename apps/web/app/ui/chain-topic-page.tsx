import Link from "next/link";
import { listMockRiskDatabaseEntries } from "@chainvigil/risk-core";
import { RiskBadge } from "./risk-badge";

export type ChainTopic = "solana" | "bsc";

interface ChainTopicPageProps {
  chain: ChainTopic;
}

const content = {
  solana: {
    title: "Solana Token 安全检查",
    shortName: "Solana",
    description: "在交易 Solana Token 前，先核对唯一 CA，再阅读代币权限、流动性与集中持仓等基础风险信号。",
    chainLabel: "Solana（SOL）",
    concerns: ["Mint / Freeze Authority", "流动性池可验证性", "前十地址集中度"],
    faq: [
      ["Solana Token 安检会连接我的钱包吗？", "不会。V0 只接受公开 CA 或链接进行只读 mock 风险报告，不要求连接钱包、签名或交易。"],
      ["为什么需要核对 Solana Token 的 CA？", "同名或相似名称的 Token 可能指向不同地址。唯一 CA 是核对项目身份和进一步检查的起点。"],
      ["Solana 报告是投资建议吗？", "不是。报告仅解释基础风险信号和 V0 mock 证据，链上状态可能变化，交易前应再次核验。"],
    ],
  },
  bsc: {
    title: "BNB Smart Chain Token 安全检查",
    shortName: "BNB Smart Chain",
    description: "在交易 BNB Smart Chain Token 前，先核对唯一 CA，再查看买卖限制、税率、权限和 LP 等基础风险信号。",
    chainLabel: "BNB Smart Chain（BNB / BSC）",
    concerns: ["买卖与高税风险", "Owner / 黑名单权限", "LP 锁定与持仓集中度"],
    faq: [
      ["BNB Token 安检会发起交易吗？", "不会。V0 只生成公开 CA 的只读 mock 风险报告，不会请求签名、执行 swap 或广播交易。"],
      ["为什么 BNB Token 要先查 CA？", "名称和图标可以被仿造，CA 是识别合约实例的唯一入口。先查 CA 能避免把同名仿盘当成官方代币。"],
      ["检测到风险是否代表一定无法交易？", "不代表。风险等级只说明当前可见信号，不能保证合约状态、流动性或价格未来不变，也不构成投资建议。"],
    ],
  },
} as const;

export function ChainTopicPage({ chain }: ChainTopicPageProps) {
  const topic = content[chain];
  const entries = listMockRiskDatabaseEntries().slice(0, 3);
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/${chain === "bsc" ? "bnb" : "solana"}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `${topic.title}｜ChainVigil AI`,
        description: topic.description,
        url,
        inLanguage: "zh-CN",
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
        <Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI｜链哨 AI</Link>
        <div className="flex flex-wrap gap-4"><Link href="/solana">Solana</Link><Link href="/bnb">BNB</Link><Link href="/risk-database">风险库</Link><Link href="/check" className="text-[#c0c1ff]">CA 安检</Link></div>
      </nav>

      <section className="mx-auto mt-12 max-w-4xl">
        <p className="text-sm font-semibold text-[#c0c1ff]">{topic.chainLabel} · V0 RISK GUIDE</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#f9fafb] sm:text-5xl">{topic.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#c7c4d7]">{topic.description}</p>
        <Link href="/check" className="mt-8 inline-flex min-h-12 items-center rounded-md bg-[#8083ff] px-5 text-sm font-semibold text-[#0d0096] transition hover:bg-[#c0c1ff]">查一个 CA</Link>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
        {topic.concerns.map((concern, index) => <article key={concern} className="rounded-lg border border-[#262932] bg-[#16181d] p-5"><p className="text-xs font-semibold text-[#c0c1ff]">0{index + 1}</p><h2 className="mt-4 text-lg font-semibold text-[#f9fafb]">{concern}</h2><p className="mt-3 text-sm leading-6 text-[#9ca3af]">先将这个信号与公开 CA、官方渠道和当前链上信息交叉核对。V0 仅提供 mock 解释，不替代独立尽调。</p></article>)}
      </section>

      <section className="mx-auto mt-14 max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-[#c0c1ff]">RISK TERMS</p><h2 className="mt-2 text-2xl font-semibold text-[#f9fafb]">常见风险怎么理解</h2></div><Link href="/risk-database" className="text-sm font-semibold text-[#c0c1ff]">进入风险库</Link></div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">{entries.map((entry) => <article key={entry.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-[#f9fafb]">{entry.title}</h3><RiskBadge level={entry.severity} /></div><p className="mt-3 text-sm leading-6 text-[#c7c4d7]">{entry.plainLanguage}</p><p className="mt-4 border-t border-[#262932] pt-4 text-sm leading-6 text-[#c0c1ff]">{entry.recommendedAction}</p></article>)}</div>
      </section>

      <section className="mx-auto mt-14 max-w-4xl rounded-lg border border-[#262932] bg-[#16181d] p-6 md:p-8"><p className="text-sm font-semibold text-[#c0c1ff]">FAQ</p><h2 className="mt-2 text-2xl font-semibold text-[#f9fafb]">{topic.shortName} 安检常见问题</h2><div className="mt-6 divide-y divide-[#262932]">{topic.faq.map(([question, answer]) => <article key={question} className="py-5 first:pt-0"><h3 className="font-semibold text-[#f9fafb]">{question}</h3><p className="mt-3 leading-7 text-[#c7c4d7]">{answer}</p></article>)}</div></section>
    </main>
  );
}
