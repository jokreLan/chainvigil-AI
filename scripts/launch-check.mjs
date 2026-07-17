#!/usr/bin/env node
/**
 * Launch readiness checks that do NOT require external API keys or running services.
 * Weekend keys / live providers are out of scope here.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

function mustExist(rel) {
  if (!existsSync(resolve(root, rel))) {
    errors.push(`missing file: ${rel}`);
  }
}

function fileIncludes(rel, needle, label = needle) {
  const path = resolve(root, rel);
  if (!existsSync(path)) {
    errors.push(`missing file for check: ${rel}`);
    return;
  }
  const text = readFileSync(path, "utf8");
  if (!text.includes(needle)) {
    errors.push(`${rel} should include ${label}`);
  }
}

// Core launch docs & contracts
[
  "SECURITY.md",
  "docs/strategy/MASTER_CONTROL.md",
  "docs/ops/runbook_v1.md",
  "docs/ops/launch_checklist.md",
  "docs/product/vp_second_engine_v1.md",
  ".env.example",
  ".env.production.example",
  "apps/api/src/server.ts",
  "apps/bot/src/server.ts",
  "apps/bot/src/resolve-report.ts",
  "apps/web/app/ui/report-mode-banner.tsx",
].forEach(mustExist);

// Fail-closed production gates present
fileIncludes("apps/api/src/server.ts", "assertProductionRuntime");
fileIncludes("apps/bot/src/server.ts", "assertProductionRuntime");
fileIncludes("packages/config/src/index.ts", "INTERNAL_WRITE_SECRET");
fileIncludes("packages/config/src/index.ts", "TELEGRAM_WEBHOOK_SECRET");

// Report honesty contract
fileIncludes("packages/types/src/index.ts", "confidenceScore");
fileIncludes("packages/report/src/index.ts", "describeReportMode");
fileIncludes("packages/points/src/index.ts", "listVpRedemptions");
fileIncludes("packages/data-adapters/src/index.ts", "registerLiveProviderClient");

// UI launch surfaces (bilingual: prefer stable keys / contracts over zh-only literals)
fileIncludes("apps/web/app/page.tsx", "home.vpTitle");
fileIncludes("apps/web/app/pricing/page.tsx", "cashOffsetCapPercent");
fileIncludes("apps/web/app/app/points/page.tsx", "points.redeem");
fileIncludes("apps/web/app/i18n/messages.ts", "哨点 VP");
fileIncludes("apps/web/app/i18n/messages.ts", "可兑换防护权益");
fileIncludes("apps/web/app/layout.tsx", "LocaleProvider");
fileIncludes("apps/web/app/layout.tsx", "buildWebsiteJsonLd");
fileIncludes("apps/web/app/lib/geo-articles.ts", "honeypot");
fileIncludes("apps/web/app/token/[chain]/[address]/page.tsx", "index: false");
fileIncludes("apps/admin/app/system-readiness/page.tsx", "上线清单");
fileIncludes("apps/bot/src/resolve-report.ts", "local-mock");
fileIncludes("scripts/smoke-v0.mjs", "learn/honeypot");
fileIncludes("scripts/smoke-v0.mjs", "noindex");

// Security headers / CORS not wide open
fileIncludes("apps/api/src/app.ts", "getAllowedCorsOrigins");
fileIncludes("apps/api/src/app.ts", "requireAdmin");
fileIncludes("apps/bot/src/app.ts", "x-telegram-bot-api-secret-token");

// Production env template completeness
const prodEnv = readFileSync(resolve(root, ".env.production.example"), "utf8");
for (const key of [
  "CHAINVIGIL_RUNTIME_MODE=production",
  "ADMIN_BASIC_AUTH_PASSWORD",
  "INTERNAL_WRITE_SECRET",
  "TELEGRAM_WEBHOOK_SECRET",
  "CORS_ALLOWED_ORIGINS",
  "TRUST_PROXY",
  "RPC_SOLANA_URL",
  "RPC_BSC_URL",
]) {
  if (!prodEnv.includes(key.split("=")[0]) && !prodEnv.includes(key)) {
    // allow either full assignment or key presence
    if (!prodEnv.includes(key.replace(/=.*/, ""))) {
      warnings.push(`.env.production.example may miss ${key}`);
    }
  }
}

console.log("ChainVigil launch-check (no external APIs)\n");

if (warnings.length) {
  console.log("Warnings:");
  for (const warning of warnings) console.log(`  - ${warning}`);
  console.log("");
}

if (errors.length) {
  console.error("Failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log("OK: static launch contracts present.");
console.log("Next (weekend): wire live provider keys, then re-run readiness + smoke.");
