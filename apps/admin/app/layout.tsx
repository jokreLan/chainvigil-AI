import type { Metadata } from "next";
import "./globals.css";
import { AdminShell } from "./admin-shell";

export const metadata: Metadata = {
  title: {
    default: "ChainVigil Admin",
    template: "%s｜ChainVigil Admin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
