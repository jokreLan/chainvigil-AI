import Link from "next/link";
import { WalletCheckForm } from "../ui/wallet-check-form";

const checks = ["高危授权", "无限授权", "疑似垃圾 Token", "Spam NFT", "粉尘资产估算", "钱包健康分"];

export default function WalletCheckPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/check">CA 安检</Link>
      </nav>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Wallet health check
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">钱包体检</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/72">
          输入钱包地址即可做只读体检，先看历史授权和资产隐患，再决定是否连接钱包执行清理。
        </p>
        <div className="mt-8 max-w-3xl">
          <WalletCheckForm />
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {checks.map((item) => (
          <div key={item} className="border border-emerald-300/14 bg-black/20 p-5 text-emerald-50/80">
            {item}
          </div>
        ))}
      </section>
    </main>
  );
}
