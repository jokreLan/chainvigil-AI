import Link from "next/link";
import { CheckForm } from "../ui/check-form";

export default function CheckPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-10">
      <Link href="/" className="text-sm text-emerald-200/75">
        ChainVigil AI｜链哨 AI
      </Link>
      <section className="mt-16">
        <h1 className="text-4xl font-semibold text-white">CA 安检</h1>
        <p className="mt-4 max-w-2xl text-emerald-50/70">
          粘贴 Token 合约地址、DexScreener 链接或 GMGN 链接。V0 会生成可分享的 mock 风险报告。
        </p>
        <div className="mt-8">
          <CheckForm compact />
        </div>
      </section>
    </main>
  );
}
