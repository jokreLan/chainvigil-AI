import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("check");
}

export default function CheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
