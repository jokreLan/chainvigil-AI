export default function ApprovalCleanerPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">授权清理</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        授权清理属于执行类能力。正式开放前必须展示资产、spender、额度、撤销方式、gas 估算和二次确认。
      </p>
      <section className="mt-8 border border-emerald-300/14 bg-black/20 p-5">
        <h2 className="text-xl font-semibold text-white">执行保护机制</h2>
        <ul className="mt-4 space-y-3 text-emerald-50/72">
          <li>不自动撤销授权。</li>
          <li>不请求授权给 ChainVigil 自有合约。</li>
          <li>每笔撤销都必须用户自己确认。</li>
          <li>高危或无法判断时优先保守提示。</li>
        </ul>
      </section>
    </main>
  );
}
