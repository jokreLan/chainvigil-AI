import { getCacheHealth } from "@chainvigil/cache";
import { getSystemReadiness } from "@chainvigil/config";
import type { WorkerHealth, WorkerJobDefinition } from "@chainvigil/types";

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

export function getWorkerHealth(): WorkerHealth {
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
