import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("api");
}

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
