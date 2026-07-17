import { describe, expect, it } from "vitest";
import {
  createPendingPointEvent,
  getMockPointLedgerSummary,
  getPointProgram,
  listMockGrowthChannels,
  listVpRedemptions,
} from "./index";

describe("createPendingPointEvent", () => {
  it("creates pending VP events by default", () => {
    const event = createPendingPointEvent({
      type: "FIRST_CA_CHECK",
      idempotencyKey: "user-1:first-check",
    });

    expect(event.status).toBe("pending");
    expect(event.points).toBe(20);
    expect(event.ledger).toBe("xp");
  });

  it("keeps VP program metadata and disclaimer centralized", () => {
    const program = getPointProgram();

    expect(program.pointsName).toBe("哨点");
    expect(program.englishName).toBe("Vigil Points");
    expect(program.shortName).toBe("VP");
    expect(program.disclaimer).toContain("不构成代币");
    expect(program.tagline).toContain("防护权益");
    expect(program.cashOffsetCapPercent).toBe(30);
    expect(program.rules.REPORT_SHARED.points).toBe(5);
    expect(program.redemptions.length).toBeGreaterThan(0);
  });

  it("lists VP redemption catalog as second-engine benefits", () => {
    const items = listVpRedemptions();
    items[0]!.title = "mutated";

    expect(listVpRedemptions()[0]?.id).toBe("redeem.extra_checks_10");
    expect(listVpRedemptions().some((item) => item.highlight)).toBe(true);
    expect(listVpRedemptions().every((item) => item.costVp > 0)).toBe(true);
  });

  it("summarizes mock VP ledger without confirming pending rewards", () => {
    const summary = getMockPointLedgerSummary("visitor:test");

    expect(summary.subjectId).toBe("visitor:test");
    expect(summary.shortName).toBe("VP");
    expect(summary.totalConfirmed).toBe(20);
    expect(summary.totalPending).toBe(35);
    expect(summary.totalRejected).toBe(0);
    expect(summary.recentEvents.every((event) => event.subjectId === "visitor:test")).toBe(true);
    expect(summary.balances).toContainEqual({
      ledger: "security_contribution",
      pending: 30,
      confirmed: 0,
      rejected: 0,
    });
  });

  it("lists mock growth channels as defensive copies", () => {
    const channels = listMockGrowthChannels();
    channels[0]!.name = "mutated";

    expect(channels[0]).toMatchObject({
      type: "kol",
      status: "active",
      referralCode: "KOL001",
    });
    expect(listMockGrowthChannels()[0]?.name).toBe("KOL-001");
  });
});
