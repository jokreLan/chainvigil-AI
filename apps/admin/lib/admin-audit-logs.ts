import { listMockAdminAuditLogs } from "@chainvigil/audit";

type AdminAuditLog = ReturnType<typeof listMockAdminAuditLogs>[number];

export interface AdminAuditLogsResult {
  logs: AdminAuditLog[];
  source: "api" | "mock-fallback";
}

function isAdminAuditLog(value: unknown): value is AdminAuditLog {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.actorId === "string" &&
    typeof record.action === "string" &&
    typeof record.target === "string" &&
    typeof record.reason === "string" &&
    typeof record.createdAt === "string"
  );
}

export async function getAdminAuditLogs(params: {
  apiBaseUrl?: string;
  fetcher?: typeof fetch;
} = {}): Promise<AdminAuditLogsResult> {
  const apiBaseUrl = params.apiBaseUrl ?? process.env.API_BASE_URL ?? "http://localhost:4000";
  const fetcher = params.fetcher ?? fetch;

  try {
    const response = await fetcher(`${apiBaseUrl}/api/v1/admin/audit/logs`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Audit API returned ${response.status}`);
    }

    const body = (await response.json()) as { logs?: unknown };
    const logs = Array.isArray(body.logs) ? body.logs.filter(isAdminAuditLog) : [];

    if (logs.length === 0) {
      throw new Error("Audit API returned no logs");
    }

    return {
      logs,
      source: "api",
    };
  } catch {
    return {
      logs: listMockAdminAuditLogs(),
      source: "mock-fallback",
    };
  }
}
