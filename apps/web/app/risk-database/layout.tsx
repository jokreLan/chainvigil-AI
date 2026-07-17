import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("riskDb");
}

export default function RiskDbLayout({ children }: { children: React.ReactNode }) {
  return children;
}
