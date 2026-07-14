import Link from "next/link";
import { listMockUserPreferenceSettings } from "@chainvigil/risk-core";
import { MobileNav } from "../../ui/mobile-nav";

const category = { language: "语言", risk_alert: "风险提醒", profile: "资料", privacy: "隐私" } as const;

export default function SettingsPage() {
  const settings = listMockUserPreferenceSettings();
  return <main className="min-h-screen bg-[#0a0b0f] pb-24 text-[#e4e1ed] md:pb-10"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#262932] bg-[#0a0b0f]/95 px-5 backdrop-blur md:px-8"><Link href="/" className="font-semibold text-[#f9fafb]">ChainVigil AI</Link><span className="text-sm text-[#9ca3af]">只读偏好</span></header><div className="mx-auto max-w-4xl px-5 py-9 md:px-8"><section><p className="text-sm font-semibold text-[#c0c1ff]">Preference preview</p><h1 className="mt-3 text-3xl font-semibold text-[#f9fafb] md:text-5xl">设置</h1><p className="mt-4 max-w-2xl leading-7 text-[#9ca3af]">账户体系稳定前，V0 只展示偏好设置 contract。不会把 mock 配置写入浏览器或账户。</p></section><section className="mt-8 space-y-4">{settings.map((item) => <article key={item.id} className="rounded-xl border border-[#262932] bg-[#16181d] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase text-[#c0c1ff]">{category[item.category]}</p><h2 className="mt-2 text-xl font-semibold text-[#f9fafb]">{item.title}</h2></div><span className="rounded-lg border border-[#464554] px-3 py-2 text-xs text-[#9ca3af]">{item.editableInV0 ? "可编辑" : "V0 只读"}</span></div><p className="mt-4 rounded-lg bg-[#1b1b23] px-4 py-3 text-sm text-[#e4e1ed]">{item.valueLabel}</p><p className="mt-4 leading-7 text-[#9ca3af]">{item.description}</p></article>)}</section><section className="mt-8 rounded-xl border border-[#262932] bg-[#1b1b23] p-5 text-sm leading-7 text-[#9ca3af]">后续接入账户、隐私策略和数据存储后，设置项才会开放修改；在此之前，页面不会伪装成已经保存成功的真实偏好。</section></div><MobileNav active="home" /></main>;
}
