import { describe, expect, it } from "vitest";
import {
  collectTokenRiskData,
  getAdapterHealth,
  getRiskEvidenceProviderStatus,
  lookupTokenSecurity,
} from "./index";

describe("data adapters", () => {
  it("exposes provider readiness without live credentials", () => {
    expect(getAdapterHealth({})).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "GoPlus", mode: "mock", ready: false }),
        expect.objectContaining({ name: "Honeypot.is", mode: "mock", ready: false }),
        expect.objectContaining({ name: "InternalRiskDB", mode: "mock", ready: true }),
      ]),
    );
  });

  it("marks configured providers as live-ready without calling them", () => {
    expect(getAdapterHealth({ GOPLUS_API_KEY: "key" })).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "GoPlus", mode: "live", ready: true })]),
    );
  });

  it("normalizes mock token security lookup snapshots", async () => {
    const snapshot = await lookupTokenSecurity({
      chain: "base",
      address: "0x1111111111111111111111111111111111111110",
    });

    expect(snapshot).toMatchObject({
      source: "mock",
      chain: "base",
      address: "0x1111111111111111111111111111111111111110",
      freshForSeconds: 60,
    });
  });

  it("declares SOL and BNB evidence providers with chain-specific configuration", () => {
    const solana = getRiskEvidenceProviderStatus({}, "solana");
    const bsc = getRiskEvidenceProviderStatus({}, "bsc");

    expect(solana).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "solana-rpc", requiredEnv: "RPC_SOLANA_URL", fallback: "mock_snapshot" }),
        expect.objectContaining({ id: "dex-market", source: "dex" }),
      ]),
    );
    expect(solana.map((provider) => provider.id)).not.toContain("honeypot-bsc");
    expect(bsc).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "bsc-rpc", requiredEnv: "RPC_BSC_URL" }),
        expect.objectContaining({ id: "honeypot-bsc", source: "honeypot" }),
      ]),
    );
  });

  it("collects a BNB bundle with an explicit mock confidence downgrade", async () => {
    const bundle = await collectTokenRiskData(
      {
        chain: "bsc",
        address: "0x1111111111111111111111111111111111111110",
      },
      {
        GOPLUS_API_KEY: "key",
      },
    );

    expect(bundle.snapshots.map((snapshot) => snapshot.providerId)).toEqual([
      "bsc-rpc",
      "goplus-bsc",
      "honeypot-bsc",
      "dex-market",
      "internal-risk-db",
    ]);
    expect(bundle.missingLiveConfig).toEqual(["RPC_BSC_URL", "HONEYPOT_API_KEY"]);
    expect(bundle.coverage).toMatchObject({
      chain: "bsc",
      status: "live_configured",
      confidence: "UNASSESSED",
      confidenceScore: 0,
      fallbackActive: true,
    });
    expect(bundle.snapshots.every((snapshot) => snapshot.executionMode === "mock")).toBe(true);
  });

  it("keeps Solana evidence isolated from BNB-only providers", async () => {
    const bundle = await collectTokenRiskData({
      chain: "solana",
      address: "So11111111111111111111111111111111111111112",
    });

    expect(bundle.snapshots.map((snapshot) => snapshot.providerId)).toEqual([
      "solana-rpc",
      "dex-market",
      "internal-risk-db",
    ]);
    expect(bundle.coverage).toMatchObject({
      status: "mock_only",
      missingLiveConfig: ["RPC_SOLANA_URL"],
    });
  });

  it("keeps non-primary EVM chains on the legacy mock compatibility path", async () => {
    const bundle = await collectTokenRiskData({
      chain: "base",
      address: "0x1111111111111111111111111111111111111110",
    });

    expect(bundle.snapshots.map((snapshot) => snapshot.providerId)).toEqual([
      "legacy-goplus",
      "legacy-honeypot",
      "legacy-rpc",
      "legacy-dex",
      "legacy-internal-risk-db",
    ]);
    expect(bundle.coverage).toMatchObject({
      status: "mock_only",
      confidence: "UNASSESSED",
      missingLiveConfig: ["GOPLUS_API_KEY", "HONEYPOT_API_KEY", "RPC_BASE_URL"],
    });
  });
});
