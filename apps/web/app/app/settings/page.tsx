export default function SettingsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-12">
      <h1 className="text-4xl font-semibold text-white">设置</h1>
      <section className="mt-8 space-y-4">
        {["语言：中文 / English", "风险提醒阈值", "公开榜单昵称", "报告分享隐私"].map((item) => (
          <div key={item} className="border border-emerald-300/14 bg-black/20 p-5 text-emerald-50/75">
            {item}
          </div>
        ))}
      </section>
    </main>
  );
}
