import Link from "next/link";
import { listMockWalletCheckCapabilities } from "@chainvigil/risk-core";
import { WalletCheckForm } from "../ui/wallet-check-form";

const checks = listMockWalletCheckCapabilities();

export default function WalletCheckPage() {
  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#262932] pb-5 text-sm text-[#9ca3af]">
        <Link href="/" className="font-semibold text-[#f9fafb]">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/check">CA 安检</Link>
      </nav>

      <section className="mx-auto mt-12 grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div>
          <p className="text-sm font-semibold text-[#c0c1ff]">Wallet health check</p>
          <h1 className="mt-4 text-4xl font-semibold text-[#f9fafb] sm:text-5xl">钱包体检</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#c7c4d7]">
            输入 BNB Smart Chain 钱包地址，先查看授权、可疑资产与粉尘风险。V0 只读分析，不连接钱包，也不发起任何链上操作。
          </p>
          <div className="mt-8 max-w-3xl rounded-lg border border-[#34343d] bg-[#16181d] p-4 sm:p-5">
            <WalletCheckForm />
          </div>
        </div>

        <aside className="rounded-lg border border-[#262932] bg-[#16181d] p-5">
          <p className="text-xs font-semibold text-[#9ca3af]">V0 检测范围</p>
          <p className="mt-3 text-2xl font-semibold text-[#f9fafb]">BNB Smart Chain</p>
          <p className="mt-3 text-sm leading-6 text-[#c7c4d7]">授权、Token、NFT 与粉尘风险只做识别和解释，任何清理动作都不在 V0 执行。</p>
        </aside>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-4 md:grid-cols-3">
        {checks.map((item) => (
          <div key={item.id} className="rounded-lg border border-[#262932] bg-[#16181d] p-5 text-[#c7c4d7]">
            <p className="text-xs font-semibold text-[#c0c1ff]">
              {item.category} · {item.v0Action}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[#f9fafb]">{item.title}</h2>
            <p className="mt-3 text-sm leading-6">{item.description}</p>
            <p className="mt-4 text-xs text-[#9ca3af]">无需签名：{item.requiresSignature ? "否" : "是"}</p>
            <p className="mt-2 text-xs text-[#9ca3af]">不做：{item.prohibitedActions.join(" / ")}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
