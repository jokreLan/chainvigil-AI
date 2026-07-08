import { describe, expect, it } from "vitest";
import { getWorkerHealth, listWorkerJobs } from "./jobs.js";

describe("worker jobs", () => {
  it("declares V0 background job contracts without enabling live queues", () => {
    expect(listWorkerJobs()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "risk.refresh", enabled: false, mode: "mock" }),
        expect.objectContaining({ name: "points.settle", enabled: false, mode: "mock" }),
        expect.objectContaining({ name: "report.snapshot", enabled: false, mode: "mock" }),
      ]),
    );
  });

  it("returns a non-secret worker health payload", () => {
    const health = getWorkerHealth();

    expect(health).toMatchObject({
      ok: true,
      service: "chainvigil-worker",
      cache: {
        name: "memory",
      },
    });
    expect(JSON.stringify(health)).not.toContain("postgresql://");
  });
});
