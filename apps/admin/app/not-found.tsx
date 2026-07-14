import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-10 md:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center rounded-lg border border-[#262932] bg-[#16181d] p-6 md:p-10">
      <p className="text-sm font-semibold text-[#c0c1ff]">404 · ADMIN ROUTE</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">后台页面不存在</h1>
      <p className="mt-3 max-w-2xl text-[#c7c4d7]">
        这个后台入口还没有开放，或路径已经调整。请回到 Admin 首页继续操作。
      </p>
      <Link href="/" className="mt-8 w-fit rounded-md border border-[#464554] px-5 py-3 font-semibold text-[#f9fafb] hover:border-[#8083ff]">
        回 Admin 首页
      </Link></div>
    </main>
  );
}
