"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { DappIcon, type DappIconName } from "../ui/dapp-icon";
import { ProviderCoverage } from "../ui/provider-coverage";
import { WorkspaceHeader } from "../ui/workspace-header";
import { WorkspaceMobileNav } from "../ui/workspace-mobile-nav";

export default function AppDashboardPage() {
  const { locale, t } = useLocale();
  const zh = locale === "zh";
  const actions: Array<{ title: string; desc: string; href: string; tone: string; icon: DappIconName }> = [
    { title: zh ? "检查公开钱包" : "Check a public wallet", desc: zh ? "BNB 地址只读体检，无连接和签名。" : "Read-only BNB address health. No connection or signature.", href: "/wallet-check", tone: "#00e5ff", icon: "wallet" },
    { title: zh ? "查看样例报告" : "Review sample reports", desc: zh ? "区分 Mock、降级与已配置证据。" : "Separate mock, degraded, and configured evidence.", href: "/app/reports", tone: "#fda4af", icon: "document" },
    { title: zh ? "核对监控规则" : "Review monitor rules", desc: zh ? "规则库只读，不声称实时告警。" : "Read-only rule library with no live-alert claim.", href: "/app/monitor", tone: "#f9c56a", icon: "radar" },
  ];
  const modules: Array<{ title: string; href: string; desc: string; icon: DappIconName; state: string }> = [
    { title: t("ws.modWallets"), href: "/app/wallets", desc: t("ws.modWalletsDesc"), icon: "wallet", state: "MOCK WATCHLIST" },
    { title: t("ws.modApprovals"), href: "/app/approvals", desc: t("ws.modApprovalsDesc"), icon: "shield", state: "READ-ONLY" },
    { title: t("ws.modBarber"), href: "/app/asset-barber", desc: t("ws.modBarberDesc"), icon: "scan", state: "DEMO" },
    { title: t("ws.modMonitor"), href: "/app/monitor", desc: t("ws.modMonitorDesc"), icon: "radar", state: "RULE LIBRARY" },
    { title: t("ws.modReports"), href: "/app/reports", desc: t("ws.modReportsDesc"), icon: "document", state: "SAMPLE INDEX" },
    { title: t("ws.modPoints"), href: "/app/points", desc: t("ws.modPointsDesc"), icon: "chart", state: "NON-FINANCIAL" },
  ];

  return (
    <main className="cv-workspace-page min-h-screen pb-24 text-[#dce4e5] md:pb-10">
      <WorkspaceHeader desktopActive="overview" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#00e5ff]">Workspace · Mock/Readiness</p>
            <h1 className="mt-3 cv-font-display text-4xl font-semibold tracking-[-0.03em] text-[#dce4e5] md:text-6xl">{t("ws.title")}</h1>
            <p className="mt-4 max-w-3xl leading-7 text-[#bac9cc]">{t("ws.subtitle")}</p>
          </div>
          <span className="inline-flex min-h-10 items-center self-start border border-[#3b494c] bg-[#151d1e] px-3 cv-font-mono text-[10px] uppercase text-[#849396] md:self-auto">No wallet · No signature · Read-only</span>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="cv-font-display text-2xl font-semibold text-[#c3f5ff]">{zh ? "优先操作" : "Priority Actions"}</h2>
            <span className="cv-font-mono text-[10px] uppercase text-[#849396]">{zh ? "不展示虚构队列" : "No fabricated queue"}</span>
          </div>
          <div className="mt-4 grid border-l border-t border-[#3b494c] md:grid-cols-3">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="min-h-40 border-b border-r border-[#3b494c] bg-[#0d1516]/82 p-5 transition hover:bg-[#151d1e]">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center border border-[#3b494c]" style={{ color: action.tone }}><DappIcon name={action.icon} className="size-5" /></span>
                  <span className="cv-font-mono text-[10px] uppercase" style={{ color: action.tone }}>Open →</span>
                </div>
                <h3 className="mt-5 cv-font-display text-lg font-semibold text-[#dce4e5]">{action.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#849396]">{action.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <article className="border border-[#3b494c] bg-[#0d1516]/82 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#3b494c]/55 pb-4">
              <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">{zh ? "快速检查入口" : "Quick Audit"}</h2>
              <span className="cv-font-mono text-[10px] uppercase text-[#9de32e]">SOL / BNB</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link href="/check" className="flex min-h-14 items-center gap-3 border border-[#3b494c] bg-[#081012] px-4 cv-font-mono text-xs uppercase text-[#c3f5ff] hover:border-[#c3f5ff]"><DappIcon name="scan" className="size-5" />{zh ? "检查 Token CA" : "Check token CA"}</Link>
              <Link href="/wallet-check" className="flex min-h-14 items-center gap-3 border border-[#3b494c] bg-[#081012] px-4 cv-font-mono text-xs uppercase text-[#c3f5ff] hover:border-[#c3f5ff]"><DappIcon name="wallet" className="size-5" />{zh ? "检查公开地址" : "Check public address"}</Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#849396]">{zh ? "输入与扫描在 Consumer DApp 中完成；Workspace 只负责组织只读结果、样例和配置状态。" : "Inputs and scans run in the Consumer DApp. Workspace organizes read-only results, samples, and configuration state."}</p>
          </article>
          <article className="border border-[#3b494c] bg-[#0d1516]/82 p-5 sm:p-6">
            <ProviderCoverage mode="mock" chain="bnb" variant="strip" />
            <p className="mt-4 border-t border-[#3b494c]/55 pt-4 text-xs leading-5 text-[#849396]">{zh ? "Readiness 仅表示代码路径或样例契约存在，不代表节点在线、已同步或实时扫描成功。" : "Readiness means a code path or sample contract exists—not that nodes are online, synced, or returning live scans."}</p>
          </article>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4"><div><p className="cv-font-mono text-xs uppercase text-[#00e5ff]">{t("ws.modules")}</p><h2 className="mt-2 cv-font-display text-2xl font-semibold text-[#dce4e5]">{t("ws.modulesHint")}</h2></div><span className="cv-font-mono text-[10px] uppercase text-[#849396]">V0 read-only</span></div>
          <div className="mt-5 grid border-l border-t border-[#3b494c] sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <Link key={module.href} href={module.href} className="min-h-52 border-b border-r border-[#3b494c] bg-[#0d1516]/78 p-5 transition hover:bg-[#151d1e]">
                <div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center border border-[#3b494c] text-[#c3f5ff]"><DappIcon name={module.icon} className="size-5" /></span><span className="cv-font-mono text-[9px] uppercase text-[#9de32e]">{module.state}</span></div>
                <h3 className="mt-5 cv-font-display text-xl font-semibold text-[#dce4e5]">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#849396]">{module.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 border border-[#3b494c] bg-[#151d1e] p-5 sm:p-6">
          <h2 className="cv-font-display text-xl font-semibold text-[#dce4e5]">{t("ws.boundaryTitle")}</h2>
          <p className="mt-3 max-w-4xl leading-7 text-[#bac9cc]">{t("ws.boundaryBody")}</p>
        </section>
      </div>
      <WorkspaceMobileNav active="overview" />
    </main>
  );
}
