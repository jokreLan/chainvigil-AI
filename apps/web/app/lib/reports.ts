import { cache } from "react";
import { buildMockTokenRiskReport } from "@chainvigil/risk-core";
import type { ChainId, TokenRiskReport } from "@chainvigil/types";
import type { Locale } from "../i18n/config";

function apiBaseUrl(): string | undefined {
  return (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL)?.replace(/\/$/, "");
}

export const getTokenRiskReport = cache(
  async (chain: ChainId, address: string, locale: Locale): Promise<TokenRiskReport> => {
    const baseline = buildMockTokenRiskReport({
      input: address,
      chain,
      locale,
      appBaseUrl: `${(
        process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000"
      ).replace(/\/$/, "")}/${locale}`,
    });
    const api = apiBaseUrl();
    if (!api) {
      return baseline;
    }

    try {
      const response = await fetch(
        `${api}/api/v1/token/${baseline.chain}/${encodeURIComponent(baseline.tokenAddress)}`,
        {
          cache: "no-store",
          headers: { "accept-language": locale },
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (!response.ok) {
        return baseline;
      }
      const payload: unknown = await response.json();
      if (
        typeof payload === "object" &&
        payload !== null &&
        "report" in payload &&
        typeof payload.report === "object" &&
        payload.report !== null
      ) {
        return payload.report as TokenRiskReport;
      }
    } catch {
      // The report visibly retains mode=mock when the API or live providers are unavailable.
    }
    return baseline;
  },
);
