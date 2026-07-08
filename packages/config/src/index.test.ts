import { describe, expect, it } from "vitest";
import {
  getProductionSecurityReadiness,
  getSystemReadiness,
  resolveRuntimeMode,
  validateEnv,
} from "./index";

describe("validateEnv", () => {
  it("requires only public runtime URLs in mock mode", () => {
    const result = validateEnv(
      {
        APP_BASE_URL: "http://localhost:3000",
        API_BASE_URL: "http://localhost:4000",
        NEXT_PUBLIC_APP_BASE_URL: "http://localhost:3000",
        NEXT_PUBLIC_API_BASE_URL: "http://localhost:4000",
      },
      "mock",
    );

    expect(result).toEqual({ ok: true, missing: [] });
  });

  it("requires external provider credentials in production mode", () => {
    const result = validateEnv(
      {
        APP_BASE_URL: "https://chainvigil.ai",
        API_BASE_URL: "https://api.chainvigil.ai",
        NEXT_PUBLIC_APP_BASE_URL: "https://chainvigil.ai",
        NEXT_PUBLIC_API_BASE_URL: "https://api.chainvigil.ai",
      },
      "production",
    );

    expect(result.ok).toBe(false);
    expect(result.missing).toContain("DATABASE_URL");
    expect(result.missing).toContain("ADMIN_BASIC_AUTH_PASSWORD");
    expect(result.missing).toContain("GOPLUS_API_KEY");
    expect(result.missing).toContain("RPC_BASE_URL");
  });

  it("summarizes current mock and production readiness without exposing values", () => {
    const readiness = getSystemReadiness({
      CHAINVIGIL_RUNTIME_MODE: "production",
      APP_BASE_URL: "https://chainvigil.ai",
      API_BASE_URL: "https://api.chainvigil.ai",
      NEXT_PUBLIC_APP_BASE_URL: "https://chainvigil.ai",
      NEXT_PUBLIC_API_BASE_URL: "https://api.chainvigil.ai",
    });

    expect(resolveRuntimeMode({ CHAINVIGIL_RUNTIME_MODE: "demo" })).toBe("mock");
    expect(readiness.current.mode).toBe("production");
    expect(readiness.current.ok).toBe(false);
    expect(readiness.current.missing).toContain("DATABASE_URL");
    expect(readiness.current.missing).not.toContain("https://chainvigil.ai");
    expect(readiness.productionSecurity.warnings.map((warning) => warning.name)).toContain(
      "ADMIN_BASIC_AUTH_PASSWORD",
    );
  });

  it("flags unsafe production URLs and placeholder secrets without exposing values", () => {
    const result = getProductionSecurityReadiness({
      APP_BASE_URL: "http://localhost:3000",
      API_BASE_URL: "https://api.chainvigil.ai",
      NEXT_PUBLIC_APP_BASE_URL: "https://chainvigil.ai",
      NEXT_PUBLIC_API_BASE_URL: "https://api.chainvigil.ai",
      ADMIN_BASIC_AUTH_PASSWORD: "change-me-before-deploy",
      ADMIN_SECRET: "replace-me",
      JWT_SECRET: "short",
      TELEGRAM_BOT_TOKEN: "mock",
    });

    expect(result.ok).toBe(false);
    expect(result.warnings.map((warning) => warning.name)).toEqual([
      "APP_BASE_URL",
      "ADMIN_BASIC_AUTH_PASSWORD",
      "ADMIN_SECRET",
      "JWT_SECRET",
      "TELEGRAM_BOT_TOKEN",
    ]);
    expect(JSON.stringify(result)).not.toContain("replace-me");
    expect(JSON.stringify(result)).not.toContain("short");
  });

  it("accepts HTTPS production URLs and non-placeholder secrets", () => {
    const result = getProductionSecurityReadiness({
      APP_BASE_URL: "https://chainvigil.ai",
      API_BASE_URL: "https://api.chainvigil.ai",
      NEXT_PUBLIC_APP_BASE_URL: "https://chainvigil.ai",
      NEXT_PUBLIC_API_BASE_URL: "https://api.chainvigil.ai",
      ADMIN_BASIC_AUTH_PASSWORD: "admin-password-32-random",
      ADMIN_SECRET: "admin-secret-32-random",
      JWT_SECRET: "jwt-secret-32-random",
      TELEGRAM_BOT_TOKEN: "telegram-token-32-random",
    });

    expect(result).toEqual({ ok: true, warnings: [] });
  });
});
