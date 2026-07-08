import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="flex min-h-screen flex-col justify-center px-6 py-10">
      <p className="text-sm font-semibold uppercase text-amber-200">404</p>
      <h1 className="mt-4 text-3xl font-semibold">后台页面不存在</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        这个后台入口还没有开放，或路径已经调整。请回到 Admin 首页继续操作。
      </p>
      <Link href="/" className="mt-8 w-fit border border-emerald-400/40 px-5 py-3 text-emerald-200">
        回 Admin 首页
      </Link>
    </main>
  );
}
