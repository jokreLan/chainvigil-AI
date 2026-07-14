import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChainVigil Admin",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="admin-header">
          <Link href="/" className="admin-brand">ChainVigil Admin</Link>
          <nav className="admin-nav">
            <Link href="/risk-review">复核</Link>
            <Link href="/reports">报告</Link>
            <Link href="/data-sources">数据源</Link>
            <Link href="/audit">审计</Link>
            <Link href="/telegram">Telegram</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
