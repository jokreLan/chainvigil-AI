"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Error</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">页面暂时无法加载</h1>
      <p className="mt-4 max-w-2xl text-emerald-50/70">
        可能是本地 API 或页面数据暂时不可用。你可以重试，或回到 CA 安检入口重新开始。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={reset} className="bg-emerald-300 px-5 py-3 font-semibold text-slate-950">
          重试
        </button>
        <Link href="/check" className="border border-emerald-300/30 px-5 py-3 text-emerald-100">
          去 CA 安检
        </Link>
      </div>
    </main>
  );
}
