"use client";

import Link from "next/link";

export default function AdminErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col justify-center px-6 py-10">
      <p className="text-sm font-semibold uppercase text-amber-200">Error</p>
      <h1 className="mt-4 text-3xl font-semibold">后台页面暂时无法加载</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        请先重试。如果问题仍然存在，可以回到 Admin 首页查看系统就绪状态。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={reset} className="bg-emerald-300 px-5 py-3 font-semibold text-slate-950">
          重试
        </button>
        <Link href="/" className="border border-emerald-400/40 px-5 py-3 text-emerald-200">
          回 Admin 首页
        </Link>
      </div>
    </main>
  );
}
