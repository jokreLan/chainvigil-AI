import type { Metadata } from "next";
import { buildPageMetadata } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("board");
}

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
