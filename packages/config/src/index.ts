export function readEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const defaultPorts = {
  web: 3000,
  admin: 3001,
  api: 4000,
  bot: 4001,
} as const;

export type RuntimeMode = "mock" | "production";

export interface EnvVarSpec {
  name: string;
  requiredIn: RuntimeMode[];
  description: string;
}

export const envVarSpecs: EnvVarSpec[] = [
  {
    name: "APP_BASE_URL",
    requiredIn: ["mock", "production"],
    description: "Web DApp 对外访问地址，用于报告链接和 Bot 回复。",
  },
  {
    name: "NEXT_PUBLIC_APP_BASE_URL",
    requiredIn: ["mock", "production"],
    description: "Web 侧 robots/sitemap 使用的公开站点地址。",
  },
  {
    name: "NEXT_PUBLIC_API_BASE_URL",
    requiredIn: ["mock", "production"],
    description: "浏览器访问 API 的公开地址。",
  },
  {
    name: "API_BASE_URL",
    requiredIn: ["mock", "production"],
    description: "服务端访问 API 的内部地址。",
  },
  {
    name: "DATABASE_URL",
    requiredIn: ["production"],
    description: "PostgreSQL 连接串。",
  },
  {
    name: "REDIS_URL",
    requiredIn: ["production"],
    description: "Redis 连接串。",
  },
  {
    name: "TELEGRAM_BOT_TOKEN",
    requiredIn: ["production"],
    description: "Telegram Bot token；V0 本地 mock 可留空。",
  },
  {
    name: "ADMIN_BASIC_AUTH_PASSWORD",
    requiredIn: ["production"],
    description: "Admin Basic Auth 密码；本地 mock 可留空，生产必须配置。",
  },
  {
    name: "GOPLUS_API_KEY",
    requiredIn: ["production"],
    description: "GoPlus 或等价风险数据源凭证。",
  },
  {
    name: "HONEYPOT_API_KEY",
    requiredIn: ["production"],
    description: "Honeypot 或等价仿真数据源凭证。",
  },
  {
    name: "RPC_BASE_URL",
    requiredIn: ["production"],
    description: "Base 链 RPC endpoint。",
  },
];

export function validateEnv(
  env: Record<string, string | undefined>,
  mode: RuntimeMode = "mock",
): { ok: true; missing: [] } | { ok: false; missing: string[] } {
  const missing = envVarSpecs
    .filter((spec) => spec.requiredIn.includes(mode))
    .map((spec) => spec.name)
    .filter((name) => !env[name]?.trim());

  return missing.length === 0 ? { ok: true, missing: [] } : { ok: false, missing };
}

export interface RuntimeReadiness {
  mode: RuntimeMode;
  ok: boolean;
  missing: string[];
}

export interface ProductionSecurityWarning {
  name: string;
  reason: string;
}

export interface ProductionSecurityReadiness {
  ok: boolean;
  warnings: ProductionSecurityWarning[];
}

export interface SystemReadiness {
  current: RuntimeReadiness;
  mock: RuntimeReadiness;
  production: RuntimeReadiness;
  productionSecurity: ProductionSecurityReadiness;
}

export function resolveRuntimeMode(env: Record<string, string | undefined>): RuntimeMode {
  return env.CHAINVIGIL_RUNTIME_MODE === "production" ? "production" : "mock";
}

const placeholderValues = new Set([
  "admin",
  "change-me-before-deploy",
  "changeme",
  "mock",
  "password",
  "replace-me",
  "secret",
  "test",
]);

function isUnsafeSecretValue(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();

  return !normalized || placeholderValues.has(normalized) || normalized.length < 16;
}

function isUnsafeProductionUrl(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();

  return !normalized || !normalized.startsWith("https://") || normalized.includes("localhost");
}

export function getProductionSecurityReadiness(
  env: Record<string, string | undefined> = process.env,
): ProductionSecurityReadiness {
  const warnings: ProductionSecurityWarning[] = [];

  for (const name of [
    "APP_BASE_URL",
    "API_BASE_URL",
    "NEXT_PUBLIC_APP_BASE_URL",
    "NEXT_PUBLIC_API_BASE_URL",
  ]) {
    if (isUnsafeProductionUrl(env[name])) {
      warnings.push({
        name,
        reason: "生产公开地址必须使用 HTTPS，且不能指向 localhost。",
      });
    }
  }

  for (const name of [
    "ADMIN_BASIC_AUTH_PASSWORD",
    "ADMIN_SECRET",
    "JWT_SECRET",
    "TELEGRAM_BOT_TOKEN",
  ]) {
    if (isUnsafeSecretValue(env[name])) {
      warnings.push({
        name,
        reason: "生产密钥不能留空、不能使用示例值，且长度至少需要 16 个字符。",
      });
    }
  }

  return {
    ok: warnings.length === 0,
    warnings,
  };
}

export function getSystemReadiness(
  env: Record<string, string | undefined> = process.env,
): SystemReadiness {
  const mock = validateEnv(env, "mock");
  const production = validateEnv(env, "production");
  const currentMode = resolveRuntimeMode(env);
  const current = currentMode === "production" ? production : mock;

  return {
    current: {
      mode: currentMode,
      ok: current.ok,
      missing: current.missing,
    },
    mock: {
      mode: "mock",
      ok: mock.ok,
      missing: mock.missing,
    },
    production: {
      mode: "production",
      ok: production.ok,
      missing: production.missing,
    },
    productionSecurity: getProductionSecurityReadiness(env),
  };
}
