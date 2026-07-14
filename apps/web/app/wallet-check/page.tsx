import Link from "next/link";
import { listMockWalletCheckCapabilities } from "@chainvigil/risk-core";
import { WalletCheckForm } from "../ui/wallet-check-form";
import { MobileNav } from "../ui/mobile-nav";

const checks = listMockWalletCheckCapabilities();

export default function WalletCheckPage() {
  return (
    <main className="min-h-screen bg-[#0a0b0f] px-4 py-6 pb-28 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/check">CA 安检</Link>
      </nav>

      <section className="mx-auto mt-12 max-w-3xl text-center">
        <p className="text-sm font-semibold text-[#c0c1ff]">Wallet health check</p>
        <h1 className="mt-3 text-4xl font-semibold text-[#f9fafb] sm:text-5xl">钱包体检</h1>
        <p className="mt-4 leading-8 text-[#c7c4d7]">输入钱包地址，先做一次只读体检。无需连接钱包。</p>
      </section>
      <section className="mx-auto mt-10 max-w-3xl">
        <div className="rounded-xl border border-[#34343d] bg-[#16181d] p-5 sm:p-8">
          <p className="mb-5 text-center text-sm text-[#9ca3af]">当前检测网络：<span className="font-semibold text-[#c0c1ff]">BNB Smart Chain</span></p>
          <WalletCheckForm />
          <p className="mt-5 text-center text-xs text-[#9ca3af]">ChainVigil 不会保存私钥，体检过程只读且公开透明。</p>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl">
        <div className="mb-8 flex items-center gap-4"><div className="h-px flex-1 bg-[#262932]" /><h2 className="text-xl font-semibold text-[#f9fafb]">为什么需要体检？</h2><div className="h-px flex-1 bg-[#262932]" /></div>
        <div className="grid gap-4 md:grid-cols-3">
          {checks.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#262932] border-l-4 border-l-[#f97316] bg-[#16181d] p-5 text-left text-[#c7c4d7]">
              <p className="text-xs font-semibold text-[#c0c1ff]">{item.category} · {item.v0Action}</p><h2 className="mt-3 text-lg font-semibold text-[#f9fafb]">{item.title}</h2><p className="mt-3 text-sm leading-6">{item.description}</p><p className="mt-4 text-xs text-[#9ca3af]">不做：{item.prohibitedActions.join(" / ")}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-10 flex max-w-xl items-center justify-between rounded-full border border-[#262932] bg-[#292932] px-5 py-4 text-sm"><span className="text-[#f9fafb]">贡献安全报告可获得 Vigil Points</span><Link href="/app/points" className="font-semibold text-[#eab308]">查看 VP</Link></section>
      <MobileNav active="wallet" />
    </main>
  );
}
