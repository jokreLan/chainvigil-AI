import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("walletCheck");
}

export default function WalletCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
