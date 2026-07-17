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
    name: "TELEGRAM_WEBHOOK_SECRET",
    requiredIn: ["production"],
    description: "Telegram webhook secret token，用于校验 X-Telegram-Bot-Api-Secret-Token。",
  },
  {
    name: "ADMIN_BASIC_AUTH_PASSWORD",
    requiredIn: ["production"],
    description: "Admin Basic Auth 密码；本地 mock 可留空，生产必须配置。",
  },
  {
    name: "INTERNAL_WRITE_SECRET",
    requiredIn: ["production"],
    description: "服务端写接口密钥（积分/推荐事件），至少 16 字符，不暴露给浏览器。",
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
    name: "RPC_SOLANA_URL",
    requiredIn: ["production"],
    description: "Solana 主优先链 RPC endpoint。",
  },
  {
    name: "RPC_BSC_URL",
    requiredIn: ["production"],
    description: "BNB Smart Chain 主优先链 RPC endpoint。",
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

export function resolveRuntimeMode(
  env: Record<string, string | undefined> = process.env,
): RuntimeMode {
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

export function isUnsafeSecretValue(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();

  return !normalized || placeholderValues.has(normalized) || normalized.length < 16;
}

function isUnsafeProductionUrl(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();

  return !normalized || !normalized.startsWith("https://") || normalized.includes("localhost");
}

function isInvalidServiceUrl(value: string | undefined): boolean {
  if (!value?.trim() || value.toLowerCase().includes("localhost")) return true;
  try {
    const url = new URL(value);
    return url.protocol !== "http:" && url.protocol !== "https:";
  } catch {
    return true;
  }
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
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_WEBHOOK_SECRET",
    "INTERNAL_WRITE_SECRET",
  ]) {
    if (isUnsafeSecretValue(env[name])) {
      warnings.push({
        name,
        reason: "生产密钥不能留空、不能使用示例值，且长度至少需要 16 个字符。",
      });
    }
  }
  for (const name of ["ADMIN_SECRET", "JWT_SECRET"]) {
    if (env[name]?.trim() && isUnsafeSecretValue(env[name])) {
      warnings.push({
        name,
        reason: "已配置的生产密钥不能使用示例值，且长度至少需要 16 个字符。",
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

/**
 * Fail-closed production gate. Throws if runtime mode is production and
 * required env or security prechecks fail. Never includes secret values.
 */
export function assertProductionRuntime(
  env: Record<string, string | undefined> = process.env,
): void {
  const mode = resolveRuntimeMode(env);

  if (mode !== "production") {
    return;
  }

  const readiness = getSystemReadiness(env);
  const problems: string[] = [];

  if (!readiness.production.ok) {
    problems.push(`missing env: ${readiness.production.missing.join(", ")}`);
  }

  if (!readiness.productionSecurity.ok) {
    problems.push(
      `security warnings: ${readiness.productionSecurity.warnings.map((warning) => warning.name).join(", ")}`,
    );
  }

  if (problems.length > 0) {
    throw new Error(
      `ChainVigil production startup blocked. ${problems.join(" | ")}. See SECURITY.md.`,
    );
  }
}

export function assertWebProductionRuntime(
  env: Record<string, string | undefined> = process.env,
): void {
  if (resolveRuntimeMode(env) !== "production") {
    return;
  }

  const invalid = ["APP_BASE_URL", "NEXT_PUBLIC_APP_BASE_URL", "NEXT_PUBLIC_API_BASE_URL"].filter(
    (name) => isUnsafeProductionUrl(env[name]),
  );

  if (invalid.length > 0) {
    throw new Error(
      `ChainVigil web production startup blocked. Invalid HTTPS URL env: ${invalid.join(", ")}.`,
    );
  }
}

export function assertAdminProductionRuntime(
  env: Record<string, string | undefined> = process.env,
): void {
  if (resolveRuntimeMode(env) !== "production") {
    return;
  }

  const problems: string[] = [];
  if (isUnsafeSecretValue(env.ADMIN_BASIC_AUTH_PASSWORD)) {
    problems.push("ADMIN_BASIC_AUTH_PASSWORD");
  }
  if (isUnsafeProductionUrl(env.ADMIN_BASE_URL)) {
    problems.push("ADMIN_BASE_URL");
  }
  if (isInvalidServiceUrl(env.API_BASE_URL)) {
    problems.push("API_BASE_URL");
  }

  if (problems.length > 0) {
    throw new Error(
      `ChainVigil admin production startup blocked. Invalid or missing env: ${problems.join(", ")}.`,
    );
  }
}

export function assertBotProductionRuntime(
  env: Record<string, string | undefined> = process.env,
): void {
  if (resolveRuntimeMode(env) !== "production") return;
  const problems: string[] = [];
  if (isUnsafeProductionUrl(env.APP_BASE_URL)) problems.push("APP_BASE_URL");
  if (isInvalidServiceUrl(env.API_BASE_URL)) problems.push("API_BASE_URL");
  for (const name of ["TELEGRAM_BOT_TOKEN", "TELEGRAM_WEBHOOK_SECRET"]) {
    if (isUnsafeSecretValue(env[name])) problems.push(name);
  }
  if (!env.REDIS_URL?.trim()) problems.push("REDIS_URL");
  if (problems.length > 0) {
    throw new Error(
      `ChainVigil bot production startup blocked. Invalid or missing env: ${problems.join(", ")}.`,
    );
  }
}

export function assertWorkerProductionRuntime(
  env: Record<string, string | undefined> = process.env,
): void {
  if (resolveRuntimeMode(env) !== "production") return;
  const missing = ["DATABASE_URL", "REDIS_URL"].filter((name) => !env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `ChainVigil worker production startup blocked. Missing env: ${missing.join(", ")}.`,
    );
  }
}

export function constantTimeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let mismatch = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < length; index += 1) {
    mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return mismatch === 0;
}

export interface BasicAuthConfig {
  username?: string | undefined;
  password?: string | undefined;
}

export interface BasicAuthResult {
  enabled: boolean;
  ok: boolean;
}

export function isBasicAuthEnabled(config: BasicAuthConfig): boolean {
  return Boolean(config.password?.trim());
}

export function verifyBasicAuth(
  authorization: string | null | undefined,
  config: BasicAuthConfig,
  decodeBase64: (value: string) => string = (value) => Buffer.from(value, "base64").toString("utf8"),
): BasicAuthResult {
  if (!isBasicAuthEnabled(config)) {
    return { enabled: false, ok: true };
  }

  if (!authorization?.startsWith("Basic ")) {
    return { enabled: true, ok: false };
  }

  try {
    const encoded = authorization.slice("Basic ".length);
    const decoded = decodeBase64(encoded);
    const splitAt = decoded.indexOf(":");

    if (splitAt < 0) {
      return { enabled: true, ok: false };
    }

    const username = decoded.slice(0, splitAt);
    const password = decoded.slice(splitAt + 1);
    const expectedUsername = config.username?.trim() || "admin";
    const expectedPassword = config.password ?? "";

    const ok =
      constantTimeEqual(username, expectedUsername) && constantTimeEqual(password, expectedPassword);

    return {
      enabled: true,
      ok,
    };
  } catch {
    return { enabled: true, ok: false };
  }
}

export function verifyWriteSecret(
  provided: string | null | undefined,
  expected: string | undefined,
): boolean {
  if (!expected?.trim()) {
    return false;
  }

  return constantTimeEqual(provided?.trim() ?? "", expected.trim());
}

/**
 * Whether anonymous service-write endpoints may accept traffic without a write secret.
 * Production never allows this; mock allows only when INTERNAL_WRITE_SECRET is unset (local DX).
 */
export function allowsUnauthenticatedServiceWrites(
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (resolveRuntimeMode(env) === "production") {
    return false;
  }

  return !env.INTERNAL_WRITE_SECRET?.trim();
}

export function getAllowedCorsOrigins(
  env: Record<string, string | undefined> = process.env,
): string[] | true {
  const configured = env.CORS_ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configured && configured.length > 0) {
    return configured;
  }

  const defaults = [
    env.APP_BASE_URL,
    env.NEXT_PUBLIC_APP_BASE_URL,
    env.ADMIN_BASE_URL,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
  ]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin));

  // Deduplicate while preserving order.
  return [...new Set(defaults)];
}

export function resolveTrustProxy(
  env: Record<string, string | undefined> = process.env,
): boolean | number | string {
  const raw = env.TRUST_PROXY?.trim().toLowerCase();

  if (!raw || raw === "false" || raw === "0") {
    return false;
  }

  if (raw === "true" || raw === "1") {
    return true;
  }

  const asNumber = Number(raw);

  if (Number.isFinite(asNumber) && asNumber > 0) {
    return asNumber;
  }

  return raw;
}

export function getSecurityHeaders(options?: {
  enableHsts?: boolean;
  contentSecurityPolicy?: string;
}): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
  };

  if (options?.contentSecurityPolicy) {
    headers["Content-Security-Policy"] = options.contentSecurityPolicy;
  }

  if (options?.enableHsts) {
    headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  }

  return headers;
}

export const defaultWebContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https: http://localhost:* http://127.0.0.1:*",
].join("; ");

export const defaultApiContentSecurityPolicy = "default-src 'none'; frame-ancestors 'none'";
