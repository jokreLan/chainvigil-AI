import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "¥0",
    features: ["基础 CA 安检", "基础 Token 报告", "基础钱包只读体检", "基础 Bot 查询额度"],
  },
  {
    name: "Pro",
    price: "待定",
    features: ["深度 CA 报告", "多链钱包体检", "批量授权清理", "高级 Bot 群额度"],
  },
  {
    name: "API",
    price: "联系开通",
    features: ["Token Risk API", "风险标签集成", "团队限流配置", "审计和调用统计"],
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-12">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/developers">开发者中心</Link>
      </nav>
      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Pricing
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">价格与额度</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/72">
          V0 不接入支付，先明确免费能力、会员方向和 API 商业化边界。
        </p>
      </section>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className="border border-emerald-300/14 bg-black/20 p-5">
            <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
            <p className="mt-3 text-3xl font-semibold text-emerald-200">{plan.price}</p>
            <ul className="mt-5 space-y-3 text-emerald-50/72">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
