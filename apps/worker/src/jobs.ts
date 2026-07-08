import { getCacheHealth } from "@chainvigil/cache";
import { getSystemReadiness } from "@chainvigil/config";

export type WorkerJobName = "risk.refresh" | "points.settle" | "report.snapshot";

export interface WorkerJobDefinition {
  name: WorkerJobName;
  cadenceSeconds: number;
  enabled: boolean;
  mode: "mock";
  description: string;
}

export function listWorkerJobs(): WorkerJobDefinition[] {
  return [
    {
      name: "risk.refresh",
      cadenceSeconds: 300,
      enabled: false,
      mode: "mock",
      description: "Refresh token risk snapshots when live adapters are connected.",
    },
    {
      name: "points.settle",
      cadenceSeconds: 60,
      enabled: false,
      mode: "mock",
      description: "Settle pending Vigil Points events after anti-abuse checks.",
    },
    {
      name: "report.snapshot",
      cadenceSeconds: 600,
      enabled: false,
      mode: "mock",
      description: "Persist shareable report snapshots for SEO and audit history.",
    },
  ];
}

export function getWorkerHealth() {
  const readiness = getSystemReadiness();
  const cache = getCacheHealth();

  return {
    ok: true,
    service: "chainvigil-worker",
    mode: readiness.current.mode,
    cache,
    jobs: listWorkerJobs(),
  };
}
