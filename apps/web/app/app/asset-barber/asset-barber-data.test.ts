import { describe, expect, it } from "vitest";
import {
  demoAddresses,
  isLikelyWalletAddress,
  reportFor,
  scanSteps,
  scanStepsFor,
} from "./asset-barber-data";

describe("asset barber mock scan data", () => {
  it("covers risk, clean, and empty wallet reports for both chains", () => {
    for (const profile of ["risk", "clean", "empty"] as const) {
      const report = reportFor(profile);
      expect(report.sol).toBeDefined();
      expect(report.bnb).toBeDefined();
      expect(report.metrics).toHaveLength(5);
    }
  });

  it("keeps the four required scan stages and accepts the demo addresses", () => {
    expect(scanSteps).toHaveLength(4);
    expect(scanStepsFor("en")).toHaveLength(4);
    expect(scanStepsFor("en")[0]).toMatch(/wallet/i);
    expect(isLikelyWalletAddress(demoAddresses.risk)).toBe(true);
    expect(isLikelyWalletAddress(demoAddresses.clean)).toBe(true);
    expect(isLikelyWalletAddress(demoAddresses.empty)).toBe(true);
  });

  it("returns English report copy when locale is en", () => {
    const report = reportFor("risk", "en");
    expect(report.title).toMatch(/demo wallet/i);
    expect(report.metrics[0]?.label).toMatch(/risk/i);
  });
});
