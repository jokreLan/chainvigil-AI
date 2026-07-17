import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("pricing");
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
