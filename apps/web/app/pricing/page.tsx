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
    <main className="min-h-screen bg-[#0a0b0f] pb-16 text-[#e4e1ed]">
      <nav className="flex h-16 items-center justify-between border-b border-[#262932] px-5 text-sm md:px-8">
        <Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI</Link>
        <Link href="/developers">开发者中心</Link>
      </nav>
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8"><section>
        <p className="text-sm font-semibold text-[#c0c1ff]">V0 availability</p><h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">价格与额度</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[#9ca3af]">V0 不接入支付、不承诺商业额度或会员权益。本页仅说明当前可用范围和未来产品方向。</p>
      </section><section className="mt-10 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className="rounded-xl border border-[#262932] bg-[#16181d] p-6">
            <h2 className="text-2xl font-semibold text-[#f9fafb]">{plan.name}</h2>
            <p className="mt-3 text-3xl font-semibold text-[#c0c1ff]">{plan.price}</p>
            <ul className="mt-5 space-y-3 text-[#c7c4d7]">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        ))}
      </section><section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-5 text-sm leading-7 text-[#9ca3af]">Pro 和 API 方向仍需真实数据源、账户、鉴权、审计、配额和计费模型稳定后才会开放；不以 V0 页面构成任何产品承诺。</section></div>
    </main>
  );
}
