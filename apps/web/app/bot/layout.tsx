import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("bot");
}

export default function BotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
