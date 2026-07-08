import Link from "next/link";
import { listMockWalletWatchlist } from "@chainvigil/risk-core";

export default function WalletsPage() {
  const wallets = listMockWalletWatchlist("");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">我的钱包</h1>
      <p className="mt-4 text-emerald-50/72">
        V0 复用只读钱包 watchlist，不要求连接钱包，不请求签名。
      </p>
      <section className="mt-8 space-y-4">
        {wallets.map((wallet) => (
          <article key={wallet.address} className="border border-emerald-300/14 bg-black/20 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{wallet.label}</h2>
              <span className="text-sm text-emerald-200">{wallet.summaryLabel}</span>
            </div>
            <p className="mt-3 break-all font-mono text-sm text-emerald-50/60">{wallet.address}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-emerald-100/70">
              <span>{wallet.chain}</span>
              <span>{wallet.status}</span>
              <span>高危授权 {wallet.highRiskApprovals ?? "待查"}</span>
            </div>
            <p className="mt-3 leading-7 text-emerald-50/68">{wallet.note}</p>
            <Link
              href={wallet.reportUrl}
              className="mt-4 inline-block border border-emerald-300/30 px-4 py-2 text-sm font-semibold text-emerald-100"
            >
              查看只读体检
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
