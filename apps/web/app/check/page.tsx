import Link from "next/link";
import { CheckForm } from "../ui/check-form";

export default function CheckPage() {
  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-6 md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-[#c0c1ff]">
          ChainVigil AI｜链哨 AI
        </Link>
        <section className="mt-20 rounded-lg border border-[#262932] bg-[#16181d] p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#c0c1ff]">Token security scan</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#f9fafb]">CA 安检</h1>
          <p className="mt-4 max-w-2xl text-[#c7c4d7]">
            优先支持 SOL 和 BNB Token 合约地址，也可以粘贴 DexScreener 或 GMGN 链接。V0 会生成可分享的 mock 风险报告。
          </p>
          <div className="mt-8">
            <CheckForm compact />
          </div>
        </section>
      </div>
    </main>
  );
}
