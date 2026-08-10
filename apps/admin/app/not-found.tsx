import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="admin-page min-h-screen">
      <div className="admin-panel flex min-h-[65vh] flex-col justify-center p-6 md:p-10">
        <p className="admin-kicker">404 · ADMIN ROUTE</p>
        <h1 className="admin-title">后台页面不存在</h1>
        <p className="admin-lead">
          这个后台入口还没有开放，或路径已经调整。请回到 Admin 首页继续操作。
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 w-fit items-center border border-[#334649] px-5 font-mono text-xs font-semibold uppercase text-[#dce4e5]"
        >
          回 Admin 首页
        </Link>
      </div>
    </main>
  );
}
