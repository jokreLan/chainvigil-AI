"use client";

import Link from "next/link";

export default function AdminErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="admin-page min-h-screen">
      <div className="admin-panel flex min-h-[65vh] flex-col justify-center p-6 md:p-10">
        <p className="admin-kicker text-[#f3d36b]">ADMIN UNAVAILABLE</p>
        <h1 className="admin-title">后台页面暂时无法加载</h1>
        <p className="admin-lead">
          请先重试。如果问题仍然存在，可以回到 Admin 首页查看系统就绪状态。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="min-h-11 bg-[#00d9f2] px-5 font-mono text-xs font-semibold uppercase text-[#002b31]"
          >
            重试
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center border border-[#334649] px-5 font-mono text-xs font-semibold uppercase text-[#dce4e5]"
          >
            回 Admin 首页
          </Link>
        </div>
      </div>
    </main>
  );
}
