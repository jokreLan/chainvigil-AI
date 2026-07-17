import type { Metadata } from "next";
import { getServerLocale } from "../i18n/server";
import { buildDevelopersJsonLd, buildPageMetadata } from "../lib/seo";
import { JsonLd } from "../ui/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("developers");
}

export default async function DevelopersLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();
  return (
    <>
      <JsonLd data={buildDevelopersJsonLd(locale)} />
      {children}
    </>
  );
}
