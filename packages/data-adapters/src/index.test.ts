import { describe, expect, it } from "vitest";
import { collectTokenRiskData, getAdapterHealth, lookupTokenSecurity } from "./index";

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

  it("collects a normalized multi-provider risk data bundle", async () => {
    const bundle = await collectTokenRiskData(
      {
        chain: "base",
        address: "0x1111111111111111111111111111111111111110",
      },
      {
        GOPLUS_API_KEY: "key",
      },
    );

    expect(bundle.snapshots.map((snapshot) => snapshot.source)).toEqual([
      "goplus",
      "honeypot",
      "rpc",
      "dex",
      "internal",
    ]);
    expect(bundle.missingLiveConfig).toEqual(["HONEYPOT_API_KEY", "RPC_BASE_URL"]);
  });
});
