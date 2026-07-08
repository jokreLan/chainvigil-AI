const steps = [
  "分享报告",
  "带来有效访问",
  "带来 CA 检测",
  "带来钱包体检",
  "待确认 VP 结算",
];

export default function GrowthPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">推广中心</h1>
      <p className="mt-4 max-w-3xl text-emerald-50/72">
        推广奖励只记录真实转化，不奖励空动作。所有高价值 VP 默认先进入 pending 状态。
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step} className="border border-emerald-300/14 bg-black/20 p-4">
            <p className="text-sm text-emerald-200/60">Step {index + 1}</p>
            <p className="mt-2 font-semibold text-white">{step}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
