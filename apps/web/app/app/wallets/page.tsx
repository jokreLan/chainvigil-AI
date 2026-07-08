const wallets = [
  {
    address: "0x1111111111111111111111111111111111111110",
    label: "主钱包",
    status: "只读体检已完成",
  },
  {
    address: "0x2222222222222222222222222222222222222222",
    label: "交易钱包",
    status: "待体检",
  },
];

export default function WalletsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">我的钱包</h1>
      <p className="mt-4 text-emerald-50/72">V0 仅展示只读钱包管理结构，不要求连接钱包。</p>
      <section className="mt-8 space-y-4">
        {wallets.map((wallet) => (
          <article key={wallet.address} className="border border-emerald-300/14 bg-black/20 p-5">
            <h2 className="text-xl font-semibold text-white">{wallet.label}</h2>
            <p className="mt-3 break-all font-mono text-sm text-emerald-50/60">{wallet.address}</p>
            <p className="mt-3 text-emerald-100/75">{wallet.status}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
