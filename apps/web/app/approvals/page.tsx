import type { Metadata } from "next";
import { buildMockWalletHealthReport } from "@chainvigil/risk-core";
import { getServerLocale } from "../i18n/server";
import { ApprovalsClient } from "../app/approvals/approvals-client";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title:
      locale === "zh"
        ? "只读授权检查演示｜ChainVigil"
        : "Read-only approvals demo｜ChainVigil",
    robots: { index: false, follow: false },
  };
}

export default async function ConsumerApprovalsPage({
  searchParams,
}: {
  searchParams?: Promise<{ state?: string }>;
}) {
  const locale = await getServerLocale();
  const { state } = (await searchParams) ?? {};
  const baseReport = buildMockWalletHealthReport({
    address: "0x1111111111111111111111111111111111111110",
    locale,
  });
  const report =
    state === "empty" ? { ...baseReport, approvals: [] } : baseReport;

  return <ApprovalsClient report={report} />;
}
