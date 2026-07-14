"use client";

import Link from "next/link";

export default function AdminErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-10 md:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center rounded-lg border border-[#262932] bg-[#16181d] p-6 md:p-10">
      <p className="text-sm font-semibold text-[#f59e0b]">ADMIN UNAVAILABLE</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">后台页面暂时无法加载</h1>
      <p className="mt-3 max-w-2xl text-[#c7c4d7]">
        请先重试。如果问题仍然存在，可以回到 Admin 首页查看系统就绪状态。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={reset} className="rounded-md bg-[#8083ff] px-5 py-3 font-semibold text-[#0d0096] transition hover:bg-[#c0c1ff]">
          重试
        </button>
        <Link href="/" className="rounded-md border border-[#464554] px-5 py-3 font-semibold text-[#f9fafb] hover:border-[#8083ff]">
          回 Admin 首页
        </Link>
      </div></div>
    </main>
  );
}
