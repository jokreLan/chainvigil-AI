export default function DustPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">粉尘扫描</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        V0/V1 不做粉尘归集和自动 swap。当前页面只建立扫描、估算和风险分类的信息结构。
      </p>
      <section className="mt-8 border border-emerald-300/14 bg-black/20 p-5">
        <h2 className="text-xl font-semibold text-white">归集前必须满足</h2>
        <p className="mt-3 text-emerald-50/72">回收价值 &gt; gas + 路由费 + 滑点 + bridge fee + 风险成本。</p>
      </section>
    </main>
  );
}
