import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("developers");
}

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
