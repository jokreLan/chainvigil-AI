import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">没有找到这个页面</h1>
      <p className="mt-4 max-w-2xl text-emerald-50/70">
        这个链接可能已经失效。你可以回到 CA 安检入口，重新粘贴合约地址生成风险报告。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/check" className="bg-emerald-300 px-5 py-3 font-semibold text-slate-950">
          去 CA 安检
        </Link>
        <Link href="/" className="border border-emerald-300/30 px-5 py-3 text-emerald-100">
          回首页
        </Link>
      </div>
    </main>
  );
}
