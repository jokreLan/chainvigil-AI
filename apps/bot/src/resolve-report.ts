import { buildMockTokenRiskReport } from "@chainvigil/risk-core";
import type { TokenRiskReport } from "@chainvigil/types";

export interface ResolveReportOptions {
  input: string;
  appBaseUrl: string;
  apiBaseUrl?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  locale?: "zh" | "en";
}

/**
 * Prefer internal API when available (launch topology: bot → api).
 * Falls back to local mock builder so Bot stays usable offline.
 */
export async function resolveTokenRiskReport(
  options: ResolveReportOptions,
): Promise<{ report: TokenRiskReport; source: "api" | "local-mock" }> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiBaseUrl = options.apiBaseUrl?.trim().replace(/\/$/, "");

  if (apiBaseUrl) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 4_000);

    try {
      const response = await fetchImpl(`${apiBaseUrl}/api/v1/token/check`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input: options.input, source: "telegram" }),
        signal: controller.signal,
      });

      if (response.ok) {
        const payload = (await response.json()) as { report?: TokenRiskReport };
        if (payload.report?.tokenAddress && payload.report.mode) {
          return { report: payload.report, source: "api" };
        }
      }
    } catch {
      // degrade to local mock
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    report: buildMockTokenRiskReport({
      input: options.input,
      appBaseUrl: `${options.appBaseUrl.replace(/\/$/, "")}/${options.locale ?? "zh"}`,
      locale: options.locale,
    }),
    source: "local-mock",
  };
}
