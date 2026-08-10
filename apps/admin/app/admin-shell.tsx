"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    label: "上线控制",
    links: [
      ["总览", "/"],
      ["系统就绪", "/system-readiness"],
      ["数据源", "/data-sources"],
    ],
  },
  {
    label: "风险运营",
    links: [
      ["人工复核", "/risk-review"],
      ["报告索引", "/reports"],
      ["风险标签", "/risk-labels"],
      ["审计日志", "/audit"],
    ],
  },
  {
    label: "增长渠道",
    links: [
      ["Vigil Points", "/points"],
      ["渠道归因", "/channels"],
      ["Telegram", "/telegram"],
    ],
  },
] as const;

function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin 主导航" className="admin-sidebar-nav">
      {navGroups.map((group) => (
        <section key={group.label} className="admin-nav-group">
          <h2>{group.label}</h2>
          <div>
            {group.links.map(([label, href]) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                >
                  <span aria-hidden>{active ? "■" : "□"}</span>
                  {label}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-shell">
      <a className="admin-skip-link" href="#main-content">
        跳到主要内容
      </a>
      <header className="admin-header">
        <Link href="/" className="admin-brand">
          <span className="admin-brand-mark" aria-hidden>
            CV
          </span>
          <span>
            <strong>ChainVigil</strong>
            <small>ADMIN CONTROL ROOM</small>
          </span>
        </Link>
        <div className="admin-header-state">
          <span>READ-ONLY</span>
          <span>MOCK / READINESS</span>
          <details key={pathname} className="admin-mobile-menu">
            <summary>模块</summary>
            <div className="admin-mobile-menu-panel">
              <AdminNav />
            </div>
          </details>
        </div>
      </header>

      <div className="admin-shell-body">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-status">
            <span>OPERATOR VIEW</span>
            <strong>WRITE DISABLED</strong>
            <p>仅展示配置名称、样例数据和脱敏审计结构。</p>
          </div>
          <AdminNav />
          <p className="admin-sidebar-foot">V0 · SOL / BNB · INTERNAL</p>
        </aside>
        <div id="main-content" className="admin-content" tabIndex={-1}>
          {children}
        </div>
      </div>
    </div>
  );
}
