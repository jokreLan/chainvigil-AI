import type {
  AdminAuditLog,
  AdminRiskLabelItem,
  AdminRiskReviewItem,
  AdminTokenReportIndexItem,
  GrowthChannel,
  PointEvent,
  PointLedgerSummary,
  PointEventType,
  ServiceMeta,
  TelegramCommand,
  TelegramGroupSettings,
  TokenCheckRequest,
  TokenCheckResponse,
  WalletHealthRequest,
  WalletHealthResponse,
  WalletWatchlistItem,
  WorkerHealth,
} from "@chainvigil/types";

export interface ChainVigilClientOptions {
  baseUrl?: string;
  fetcher?: typeof fetch;
}

export interface PointsRulesResponse {
  pointsName: string;
  englishName: string;
  shortName: "VP";
  rules: Record<string, { points: number; ledger: string; reason: string }>;
  disclaimer: string;
}

export interface TokenRiskDataSnapshot {
  source: "mock" | "goplus" | "honeypot" | "rpc" | "dex" | "internal";
  chain: string;
  address: string;
  fetchedAt: string;
  freshForSeconds: number;
  data: Record<string, unknown>;
}

export interface TokenRiskDataResponse {
  data: {
    chain: string;
    address: string;
    fetchedAt: string;
    snapshots: TokenRiskDataSnapshot[];
    missingLiveConfig: string[];
  };
}

export interface DataSourceAdapter {
  name: string;
  mode: "mock" | "live";
  ready: boolean;
  requiredEnv?: string;
}

export interface DataSourceAdaptersResponse {
  adapters: DataSourceAdapter[];
  mode: "mock";
}

export interface WorkerJobsResponse {
  worker: WorkerHealth;
  mode: "mock";
}

export interface SystemReadinessResponse {
  service: string;
  readiness: {
    current: {
      mode: "mock" | "production";
      ok: boolean;
      missing: string[];
    };
    mock: {
      mode: "mock";
      ok: boolean;
      missing: string[];
    };
    production: {
      mode: "production";
      ok: boolean;
      missing: string[];
    };
    productionSecurity: {
      ok: boolean;
      warnings: Array<{
        name: string;
        reason: string;
      }>;
    };
  };
  adapters: Array<{
    name: string;
    mode: "mock" | "live";
    ready: boolean;
    requiredEnv?: string;
  }>;
  cache: {
    name: string;
    mode: "mock" | "live" | "disabled";
    ready: boolean;
    requiredEnv?: string;
  };
}

export interface AdminAuditLogsResponse {
  logs: AdminAuditLog[];
  mode: "mock";
}

export interface AdminRiskReviewQueueResponse {
  items: AdminRiskReviewItem[];
  mode: "mock";
}

export interface AdminRiskLabelsResponse {
  labels: AdminRiskLabelItem[];
  mode: "mock";
}

export interface AdminTokenReportsResponse {
  reports: AdminTokenReportIndexItem[];
  mode: "mock";
}

export interface PointLedgerResponse {
  ledger: PointLedgerSummary;
  mode: "mock";
}

export interface GrowthChannelsResponse {
  channels: GrowthChannel[];
  mode: "mock";
}

export interface TelegramGroupsResponse {
  groups: TelegramGroupSettings[];
  mode: "mock";
}

export interface TelegramCommandsResponse {
  commands: TelegramCommand[];
  mode: "mock";
}

export interface WalletWatchlistResponse {
  wallets: WalletWatchlistItem[];
  mode: "mock";
}

export class ChainVigilApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly field?: string,
  ) {
    super(message);
    this.name = "ChainVigilApiError";
  }
}

interface ApiErrorBody {
  error?: {
    code?: unknown;
    message?: unknown;
    field?: unknown;
  };
}

export class ChainVigilClient {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;

  constructor(options: ChainVigilClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? "http://localhost:4000";
    this.fetcher = options.fetcher ?? fetch;
  }

  async checkToken(request: TokenCheckRequest): Promise<TokenCheckResponse> {
    return this.post<TokenCheckResponse>("/api/v1/token/check", request);
  }

  async getTokenReport(chain: string, address: string): Promise<TokenCheckResponse> {
    return this.get<TokenCheckResponse>(`/api/v1/token/${chain}/${address}`);
  }

  async getTokenRiskData(chain: string, address: string): Promise<TokenRiskDataResponse> {
    return this.get<TokenRiskDataResponse>(`/api/v1/token/${chain}/${address}/data`);
  }

  async checkWallet(request: WalletHealthRequest): Promise<WalletHealthResponse> {
    return this.post<WalletHealthResponse>("/api/v1/wallet/health", request);
  }

  async getWalletReport(address: string): Promise<WalletHealthResponse> {
    return this.get<WalletHealthResponse>(`/api/v1/wallet/${address}/health`);
  }

  async getWalletWatchlist(): Promise<WalletWatchlistResponse> {
    return this.get<WalletWatchlistResponse>("/api/v1/wallet/watchlist");
  }

  async getPointsRules(): Promise<PointsRulesResponse> {
    return this.get<PointsRulesResponse>("/api/v1/points/rules");
  }

  async getPointLedger(subjectId?: string): Promise<PointLedgerResponse> {
    const query = subjectId ? `?subjectId=${encodeURIComponent(subjectId)}` : "";

    return this.get<PointLedgerResponse>(`/api/v1/points/ledger${query}`);
  }

  async getGrowthChannels(): Promise<GrowthChannelsResponse> {
    return this.get<GrowthChannelsResponse>("/api/v1/growth/channels");
  }

  async getSystemReadiness(): Promise<SystemReadinessResponse> {
    return this.get<SystemReadinessResponse>("/api/v1/system/readiness");
  }

  async getDataSourceAdapters(): Promise<DataSourceAdaptersResponse> {
    return this.get<DataSourceAdaptersResponse>("/api/v1/data-sources/adapters");
  }

  async getWorkerJobs(): Promise<WorkerJobsResponse> {
    return this.get<WorkerJobsResponse>("/api/v1/worker/jobs");
  }

  async getServiceMeta(): Promise<ServiceMeta> {
    return this.get<ServiceMeta>("/api/v1/meta");
  }

  async getAdminAuditLogs(): Promise<AdminAuditLogsResponse> {
    return this.get<AdminAuditLogsResponse>("/api/v1/admin/audit/logs");
  }

  async getAdminRiskReviewQueue(): Promise<AdminRiskReviewQueueResponse> {
    return this.get<AdminRiskReviewQueueResponse>("/api/v1/admin/risk-review/queue");
  }

  async getAdminRiskLabels(): Promise<AdminRiskLabelsResponse> {
    return this.get<AdminRiskLabelsResponse>("/api/v1/admin/risk-labels");
  }

  async getAdminTokenReports(): Promise<AdminTokenReportsResponse> {
    return this.get<AdminTokenReportsResponse>("/api/v1/admin/token-reports");
  }

  async getTelegramGroups(): Promise<TelegramGroupsResponse> {
    return this.get<TelegramGroupsResponse>("/api/v1/telegram/groups");
  }

  async getTelegramCommands(): Promise<TelegramCommandsResponse> {
    return this.get<TelegramCommandsResponse>("/api/v1/telegram/commands");
  }

  async recordPointEvent(request: {
    type: PointEventType;
    subjectId?: string;
    actorId?: string;
    idempotencyKey: string;
  }): Promise<{ event: PointEvent }> {
    return this.post<{ event: PointEvent }>("/api/v1/points/event", request);
  }

  private async get<T>(path: string): Promise<T> {
    const response = await this.fetcher(`${this.baseUrl}${path}`);
    return this.parse<T>(response);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await this.fetcher(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return this.parse<T>(response);
  }

  private async parse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw await this.parseError(response);
    }

    return (await response.json()) as T;
  }

  private async parseError(response: Response): Promise<ChainVigilApiError> {
    try {
      const body = (await response.json()) as ApiErrorBody;
      const message =
        typeof body.error?.message === "string" && body.error.message.trim().length > 0
          ? body.error.message
          : `ChainVigil API request failed: ${response.status}`;
      const code = typeof body.error?.code === "string" ? body.error.code : undefined;
      const field = typeof body.error?.field === "string" ? body.error.field : undefined;

      return new ChainVigilApiError(message, response.status, code, field);
    } catch {
      return new ChainVigilApiError(`ChainVigil API request failed: ${response.status}`, response.status);
    }
  }
}
