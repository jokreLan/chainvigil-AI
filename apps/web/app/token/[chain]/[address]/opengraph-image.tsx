import { ImageResponse } from "next/og";
import { buildMockTokenRiskReport } from "@chainvigil/risk-core";
import type { ChainId } from "@chainvigil/types";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface OpenGraphImageProps {
  params: Promise<{
    chain: ChainId;
    address: string;
  }>;
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { chain, address } = await params;
  const report = buildMockTokenRiskReport({ input: address, chain });
  const chips = ["Contract risk", "Liquidity signal", "Holder pattern"];
  const shortAddress = `${report.tokenAddress.slice(0, 10)}...${report.tokenAddress.slice(-6)}`;
  const riskCopy = {
    UNKNOWN: "More data is needed before this CA can be trusted.",
    LOW: "Looks clean in the current mock scan.",
    MEDIUM: "Review contract and liquidity signals before buying.",
    HIGH: "High-risk signals found. Treat this CA with caution.",
    BLOCK: "Critical risk signals found. Do not rush into this CA.",
  };
  const riskLabel = {
    UNKNOWN: "UNKNOWN RISK",
    LOW: "LOW RISK",
    MEDIUM: "MEDIUM RISK",
    HIGH: "HIGH RISK",
    BLOCK: "DO NOT BUY",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #07100d 0%, #121827 55%, #111314 100%)",
          color: "#f8fafc",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>ChainVigil AI</div>
          <div style={{ display: "flex", color: "#a7f3d0", fontSize: 24 }}>Check the CA before you buy.</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              width: "auto",
              padding: "14px 24px",
              border: "2px solid #fca5a5",
              color: "#fecaca",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            {riskLabel[report.riskLevel]}
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>
            {riskCopy[report.riskLevel]}
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {chips.map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(167,243,208,0.28)",
                  color: "#d1fae5",
                  fontSize: 24,
                }}
              >
                {chip}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "#d1fae5", fontSize: 24 }}>
          <div style={{ display: "flex" }}>{`${report.chain} / ${report.tokenSymbol} / ${shortAddress}`}</div>
          <div>Checked by ChainVigil AI</div>
        </div>
      </div>
    ),
    size,
  );
}
