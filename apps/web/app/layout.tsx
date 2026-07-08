import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000"),
  title: "ChainVigil AI｜链哨 AI",
  description: "买币前，先查 CA。免费 CA 安检、Token 风险报告与 Web3 安全解释。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
