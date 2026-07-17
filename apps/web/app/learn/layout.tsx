import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("learn");
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
