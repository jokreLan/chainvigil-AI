import { getWorkerHealth } from "./jobs.js";
import { assertWorkerProductionRuntime } from "@chainvigil/config";

assertWorkerProductionRuntime();
const heartbeatMs = Number(process.env.WORKER_HEARTBEAT_MS ?? 30_000);

function logHeartbeat() {
  const health = getWorkerHealth();
  const enabledJobs = health.jobs.filter((job) => job.enabled).length;

  console.log(
    JSON.stringify({
      service: health.service,
      ok: health.ok,
      mode: health.mode,
      cache: health.cache.mode,
      jobs: health.jobs.length,
      enabledJobs,
      timestamp: new Date().toISOString(),
    }),
  );
}

logHeartbeat();

const interval = setInterval(logHeartbeat, heartbeatMs);

process.on("SIGTERM", () => {
  clearInterval(interval);
  process.exit(0);
});

process.on("SIGINT", () => {
  clearInterval(interval);
  process.exit(0);
});
