const sections = [
  "可回收资产：有价格、有流动性、收益大于成本。",
  "建议隐藏资产：无价格、无流动性、spam token 或垃圾 NFT。",
  "禁止处理资产：疑似貔貅、钓鱼空投、交互风险高资产。",
];

export default function AssetBarberPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">资产理发师</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        买后清理中枢，先判断资产类别和风险，再决定是否隐藏、复查或进入后续归集候选。
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <article key={section} className="border border-emerald-300/14 bg-black/20 p-5 leading-7 text-emerald-50/75">
            {section}
          </article>
        ))}
      </section>
    </main>
  );
}
