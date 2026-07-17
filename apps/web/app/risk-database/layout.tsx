import type { Metadata } from "next";
import { getServerLocale } from "../i18n/server";
import { buildPageMetadata, buildRiskDatasetJsonLd } from "../lib/seo";
import { JsonLd } from "../ui/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("riskDb");
}

export default async function RiskDbLayout({ children }: { children: React.ReactNode }) {
  const locale = await getServerLocale();
  return (
    <>
      <JsonLd data={buildRiskDatasetJsonLd(locale)} />
      {children}
    </>
  );
}
