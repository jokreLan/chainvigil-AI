import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("fakeDb");
}

export default function FakeDbLayout({ children }: { children: React.ReactNode }) {
  return children;
}
