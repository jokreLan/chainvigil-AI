import { describe, expect, it } from "vitest";
import {
  createPendingPointEvent,
  getMockPointLedgerSummary,
  getPointProgram,
  listMockGrowthChannels,
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
    expect(program.disclaimer).toContain("不承诺固定兑换平台币");
    expect(program.rules.REPORT_SHARED.points).toBe(5);
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
