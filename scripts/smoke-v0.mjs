/**
 * Process-level smoke for V0 launch topology.
 * Requires web:3000, admin:3001, api:4000, bot:4001 (or SMOKE_*_BASE_URL).
 * Assertions prefer stable contracts (ids, routes, schema) and accept zh|en UI copy.
 */
const webBaseUrl = process.env.SMOKE_WEB_BASE_URL ?? "http://localhost:3000";
const adminBaseUrl = process.env.SMOKE_ADMIN_BASE_URL ?? "http://localhost:3001";
const apiBaseUrl = process.env.SMOKE_API_BASE_URL ?? "http://localhost:4000";
const botBaseUrl = process.env.SMOKE_BOT_BASE_URL ?? "http://localhost:4001";

const tokenAddress = "0x1111111111111111111111111111111111111110";
const solanaTokenAddress = "So11111111111111111111111111111111111111112";

async function request(name, url, init = {}) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(12_000),
  });
  return { name, response };
}

async function assertStatus(name, response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`${name} expected ${expectedStatus}, got ${response.status}`);
  }
}

async function assertHeader(name, response, header, expectedValue) {
  const value = response.headers.get(header);
  if (value !== expectedValue) {
    throw new Error(`${name} expected ${header}=${expectedValue}, got ${value}`);
  }
}

/** True if html includes every required stable token. */
function assertIncludesAll(name, html, needles) {
  for (const needle of needles) {
    if (!html.includes(needle)) {
      throw new Error(`${name} missing required: ${needle}`);
    }
  }
}

/** True if at least one option in each group is present. */
function assertIncludesAnyGroups(name, html, groups) {
  for (const group of groups) {
    if (!group.some((option) => html.includes(option))) {
      throw new Error(`${name} expected one of: ${group.join(" | ")}`);
    }
  }
}

async function main() {
  const checks = [];

  // --- Web health & public tools ---
  checks.push(
    request("web.health", `${webBaseUrl}/health`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      await assertHeader(name, response, "x-content-type-options", "nosniff");
      const body = await response.json();
      if (body.service !== "chainvigil-web" || body.ok !== true) {
        throw new Error(`${name} expected healthy web response`);
      }
    }),
  );

  checks.push(
    request("web.check", `${webBaseUrl}/check`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      await assertHeader(name, response, "x-content-type-options", "nosniff");
      const html = await response.text();
      assertIncludesAnyGroups(name, html, [
        ["CA 安检", "CA Check", "Token security scan"],
        ["/check", "check"],
      ]);
    }),
  );

  checks.push(
    request("web.wallet-check", `${webBaseUrl}/wallet-check`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["read_only_check"]);
      assertIncludesAnyGroups(name, html, [
        ["钱包体检", "Wallet health"],
        ["高危授权", "High-risk approvals", "Approval risk"],
      ]);
    }),
  );

  checks.push(
    request("web.api", `${webBaseUrl}/api`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, [
        "/api/v1/points/ledger",
        "/api/v1/system/readiness",
        "/api/v1/data-sources/adapters",
        "/api/v1/risk/evidence-providers",
        "/api/v1/worker/jobs",
        "/api/v1/risk/database",
        "/api/v1/risk/high-risk-tokens",
        "/api/v1/token/check",
      ]);
    }),
  );

  checks.push(
    request("web.bot", `${webBaseUrl}/bot`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAnyGroups(name, html, [
        ["/check &lt;CA&gt;", "/check <CA>"],
        ["/settings"],
      ]);
    }),
  );

  // --- SEO/GEO contracts ---
  checks.push(
    request("web.robots", `${webBaseUrl}/robots.txt`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const text = await response.text();
      assertIncludesAll(name, text, ["Sitemap:", "/check", "/app/"]);
      if (!text.includes("Disallow: /app/") && !text.includes("Disallow: /app")) {
        // Next may format disallow differently
        if (!text.toLowerCase().includes("disallow") || !text.includes("/app")) {
          throw new Error(`${name} expected disallow for /app workspace`);
        }
      }
    }),
  );

  checks.push(
    request("web.sitemap", `${webBaseUrl}/sitemap.xml`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const xml = await response.text();
      assertIncludesAll(name, xml, [
        "/solana",
        "/bnb",
        "/check",
        "/learn",
        "/learn/honeypot",
        "/learn/how-to-check-ca",
        "/learn/how-to-reclaim-solana-rent",
        "/learn/is-it-safe-to-revoke-approvals",
        "/learn/pump-fun-dev-dump-check",
        "/learn/close-empty-token-accounts-solana",
        "/learn/free-solana-rug-check",
        "/learn/bsc-honeypot-sell-fail",
        "/intel",
      ]);
      if (xml.includes("/token/bsc/") || xml.includes("/wallet/0x")) {
        throw new Error(`${name} must not list per-CA or per-wallet SEO URLs`);
      }
    }),
  );

  checks.push(
    request("web.learn-geo", `${webBaseUrl}/learn/honeypot`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, [
        "application/ld+json",
        '"@type":"FAQPage"',
        "honeypotDetected",
        "/check",
        "canSell",
      ]);
      assertIncludesAnyGroups(name, html, [
        ["貔貅", "Honeypot", "honeypot"],
        ["Article", "FAQPage", "HowTo"],
        ["风险信号", "Risk signal", "signalTable", "禁买", "Block"],
      ]);
    }),
  );

  checks.push(
    request("web.learn-index", `${webBaseUrl}/learn`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAnyGroups(name, html, [
        ["风险百科", "Risk encyclopedia", "Risk Encyclopedia"],
        ["/learn/honeypot"],
      ]);
    }),
  );

  checks.push(
    request("web.home-jsonld", `${webBaseUrl}/`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["application/ld+json", "Organization", "WebSite"]);
    }),
  );

  // --- Token report: JSON-LD + mode + noindex (share tool, not SEO) ---
  checks.push(
    request("web.token", `${webBaseUrl}/token/bsc/${tokenAddress}`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, [
        "application/ld+json",
        '"@type":"Report"',
        "riskAssessment",
        "confidence=",
      ]);
      assertIncludesAnyGroups(name, html, [["MOCK", "演示", "Demo"]]);
      // Next may emit robots as meta name="robots" content="noindex..."
      const noindex =
        html.includes("noindex") ||
        html.includes("robots") && html.toLowerCase().includes("noindex");
      if (!noindex) {
        throw new Error(`${name} expected noindex on token report (CA pages are not SEO assets)`);
      }
      assertIncludesAnyGroups(name, html, [
        ["结论会过期", "Conclusions go stale", "freshness"],
        ["重新", "recheck", "Scan CA", "CA 安检", "/check"],
      ]);
    }),
  );

  checks.push(
    request("web.risk-database", `${webBaseUrl}/risk-database`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["canSell=false"]);
      assertIncludesAnyGroups(name, html, [
        ["风险数据库", "Risk database"],
        ["貔貅", "Honeypot", "honeypot"],
      ]);
    }),
  );

  checks.push(
    request("web.solana-topic", `${webBaseUrl}/solana`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ['"@type":"FAQPage"', "Mint / Freeze Authority"]);
      assertIncludesAnyGroups(name, html, [["Solana Token", "Solana token"]]);
    }),
  );

  checks.push(
    request("web.bnb-topic", `${webBaseUrl}/bnb`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ['"@type":"FAQPage"']);
      assertIncludesAnyGroups(name, html, [
        ["BNB Smart Chain", "BNB"],
        ["买卖与高税", "Buy/sell", "high tax", "税"],
      ]);
    }),
  );

  checks.push(
    request("web.high-risk-tokens", `${webBaseUrl}/leaderboard/high-risk-tokens`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const html = await response.text();
        assertIncludesAll(name, html, ["solanaAuthorityRisk", "Mock Solana Vigil Token"]);
        assertIncludesAnyGroups(name, html, [["高危 CA", "High-risk CA", "High-Risk"]]);
      },
    ),
  );

  checks.push(
    request("web.fake-token-database", `${webBaseUrl}/fake-token-database`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["symbolImpersonation"]);
      assertIncludesAnyGroups(name, html, [
        ["假币", "Fake token", "Fake Token"],
        ["USDT", "假 USDT", "Fake USDT"],
      ]);
    }),
  );

  checks.push(
    request("web.points", `${webBaseUrl}/app/points`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAnyGroups(name, html, [
        ["哨点", "Vigil Points", "VP"],
        ["可兑换", "Redeem", "redemption", "防护权益", "protection"],
        ["不构成代币", "不是代币", "not a token", "Not a token"],
      ]);
    }),
  );

  checks.push(
    request("web.reports", `${webBaseUrl}/app/reports`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["Mock BNB Vigil Token"]);
      assertIncludesAnyGroups(name, html, [
        ["报告历史", "Report history"],
        ["貔貅", "honeypot", "Honeypot", "疑似"],
      ]);
    }),
  );

  checks.push(
    request("web.wallets", `${webBaseUrl}/app/wallets`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["Read-only watchlist"]);
      assertIncludesAnyGroups(name, html, [
        ["我的钱包", "My wallets"],
        ["主钱包", "Main wallet"],
      ]);
    }),
  );

  checks.push(
    request("web.settings", `${webBaseUrl}/app/settings`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAnyGroups(name, html, [
        ["设置", "Settings"],
        ["语言", "Language"],
        ["V0 只读", "V0 read-only", "read-only"],
      ]);
    }),
  );

  checks.push(
    request("web.growth", `${webBaseUrl}/app/growth`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["KOL001"]);
      assertIncludesAnyGroups(name, html, [
        ["推广中心", "Growth center", "Growth Center"],
        ["有效 CA", "Valid CA"],
      ]);
    }),
  );

  checks.push(
    request("web.monitor", `${webBaseUrl}/app/monitor`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAnyGroups(name, html, [
        ["风险监控", "Risk monitors", "Risk awareness"],
        ["高危 token", "High-risk token", "monitor-high-risk"],
        ["不自动阻断", "never auto-block", "auto-block"],
      ]);
    }),
  );

  checks.push(
    request("web.approval-cleaner", `${webBaseUrl}/app/approval-cleaner`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAnyGroups(name, html, [
        ["授权扫描", "Approval scan", "授权"],
        ["人工确认", "user confirmation", "Human confirm", "mustConfirm"],
        ["自动撤销", "auto-revoke", "自动撤销授权"],
      ]);
    }),
  );

  checks.push(
    request("web.asset-barber", `${webBaseUrl}/app/asset-barber`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAnyGroups(name, html, [
        ["资产理发师", "Asset barber", "Asset Barber"],
        ["可回收", "Recoverable"],
        ["禁止处理", "Do not touch", "Do Not Touch"],
      ]);
    }),
  );

  checks.push(
    request("web.dust", `${webBaseUrl}/app/dust`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAnyGroups(name, html, [
        ["粉尘扫描", "Dust scan"],
        ["粉尘归集", "Dust sweep", "dust"],
        ["自动 swap", "auto swap"],
      ]);
    }),
  );

  // --- Admin (Chinese-only by design) ---
  checks.push(
    request("admin.health", `${adminBaseUrl}/health`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      await assertHeader(name, response, "x-frame-options", "DENY");
      const body = await response.json();
      if (body.service !== "chainvigil-admin" || body.ok !== true) {
        throw new Error(`${name} expected healthy admin response`);
      }
    }),
  );

  checks.push(
    request("admin.readiness", `${adminBaseUrl}/system-readiness`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      await assertHeader(name, response, "x-frame-options", "DENY");
      const html = await response.text();
      assertIncludesAll(name, html, ["系统就绪状态", "生产安全预检", "risk.refresh", "上线清单"]);
    }),
  );

  checks.push(
    request("admin.data-sources", `${adminBaseUrl}/data-sources`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["数据源状态", "GoPlus", "InternalRiskDB", "Solana RPC"]);
    }),
  );

  checks.push(
    request("admin.audit", `${adminBaseUrl}/audit`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["后台审计日志", "[redacted]"]);
    }),
  );

  checks.push(
    request("admin.risk-review", `${adminBaseUrl}/risk-review`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["高危 CA 审核", "solanaAuthorityRisk"]);
    }),
  );

  checks.push(
    request("admin.risk-labels", `${adminBaseUrl}/risk-labels`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["风险标签管理", "honeypotDetected"]);
    }),
  );

  checks.push(
    request("admin.reports", `${adminBaseUrl}/reports`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["Token 报告查询", "Mock Vigil Token"]);
    }),
  );

  checks.push(
    request("admin.channels", `${adminBaseUrl}/channels`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["KOL 渠道管理", "KOL001"]);
    }),
  );

  checks.push(
    request("admin.points", `${adminBaseUrl}/points`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["Mock ledger 摘要", "待确认"]);
    }),
  );

  checks.push(
    request("admin.telegram", `${adminBaseUrl}/telegram`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();
      assertIncludesAll(name, html, ["SOL / BNB Alpha Group"]);
      assertIncludesAnyGroups(name, html, [["/check &lt;CA&gt;", "/check <CA>"]]);
    }),
  );

  // --- API (default zh mock content) ---
  checks.push(
    request("api.token-check", `${apiBaseUrl}/api/v1/token/check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: tokenAddress, chain: "bsc", locale: "zh" }),
    }).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      await assertHeader(name, response, "x-content-type-options", "nosniff");
      const body = await response.json();
      if (
        body.report?.chain !== "bsc" ||
        !body.report?.label ||
        body.report?.mode !== "mock" ||
        body.report?.confidence !== "UNASSESSED" ||
        body.mode !== "mock"
      ) {
        throw new Error(`${name} expected mock BNB report with mode/confidence`);
      }
    }),
  );

  checks.push(
    request("api.token-check-en", `${apiBaseUrl}/api/v1/token/check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: tokenAddress, chain: "bsc", locale: "en" }),
    }).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (body.report?.mode !== "mock" || !body.report?.label) {
        throw new Error(`${name} expected EN locale mock report`);
      }
      // EN labels for critical mock seed addresses should not be pure Chinese-only 禁买 when locale=en
      if (body.locale === "en" && body.report.label === "禁买") {
        throw new Error(`${name} expected English label when locale=en`);
      }
    }),
  );

  checks.push(
    request("api.solana-token-check", `${apiBaseUrl}/api/v1/token/check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: solanaTokenAddress, chain: "solana" }),
    }).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (
        body.report?.chain !== "solana" ||
        body.report?.tokenAddress !== solanaTokenAddress ||
        body.report?.mode !== "mock"
      ) {
        throw new Error(`${name} expected mock Solana report`);
      }
    }),
  );

  checks.push(
    request("api.meta", `${apiBaseUrl}/api/v1/meta`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (
        body.brand !== "ChainVigil AI" ||
        body.version !== "v0" ||
        !body.supportedChains?.includes("solana") ||
        !body.supportedChains?.includes("bsc")
      ) {
        throw new Error(`${name} expected V0 service metadata`);
      }
    }),
  );

  checks.push(
    request("api.readiness", `${apiBaseUrl}/api/v1/system/readiness`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      const warnings = body.readiness?.productionSecurity?.warnings;
      if (!Array.isArray(warnings) || !warnings.some((w) => w.name === "ADMIN_SECRET")) {
        throw new Error(`${name} expected non-secret production security warnings`);
      }
      if (JSON.stringify(body).includes("replace-me")) {
        throw new Error(`${name} leaked placeholder secret value`);
      }
    }),
  );

  checks.push(
    request("api.data-source-adapters", `${apiBaseUrl}/api/v1/data-sources/adapters`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (
          body.mode !== "mock" ||
          !body.adapters?.some((a) => a.name === "GoPlus" && a.requiredEnv === "GOPLUS_API_KEY") ||
          !body.adapters?.some((a) => a.name === "InternalRiskDB" && a.ready === true)
        ) {
          throw new Error(`${name} expected data source adapter readiness`);
        }
      },
    ),
  );

  checks.push(
    request("api.risk-evidence-providers", `${apiBaseUrl}/api/v1/risk/evidence-providers`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (
          body.mode !== "mock" ||
          body.primaryChains?.join(",") !== "solana,bsc" ||
          !body.providers?.some((p) => p.id === "solana-rpc")
        ) {
          throw new Error(`${name} expected SOL/BNB evidence provider contracts`);
        }
      },
    ),
  );

  checks.push(
    request("api.worker-jobs", `${apiBaseUrl}/api/v1/worker/jobs`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (body.mode !== "mock" || body.worker?.service !== "chainvigil-worker") {
        throw new Error(`${name} expected worker job contract`);
      }
    }),
  );

  checks.push(
    request("api.points-ledger", `${apiBaseUrl}/api/v1/points/ledger?subjectId=visitor%3Asmoke`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (
          body.mode !== "mock" ||
          body.ledger?.subjectId !== "visitor:smoke" ||
          body.ledger?.totalPending !== 35 ||
          body.ledger?.totalConfirmed !== 20
        ) {
          throw new Error(`${name} expected mock VP ledger summary`);
        }
      },
    ),
  );

  checks.push(
    request("api.wallet-watchlist", `${apiBaseUrl}/api/v1/wallet/watchlist`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (body.mode !== "mock" || body.wallets?.[0]?.status !== "checked") {
        throw new Error(`${name} expected mock wallet watchlist`);
      }
      if (JSON.stringify(body).includes("privateKey")) {
        throw new Error(`${name} leaked private key field`);
      }
    }),
  );

  checks.push(
    request("api.wallet-check-capabilities", `${apiBaseUrl}/api/v1/wallet/check-capabilities`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (
          body.mode !== "mock" ||
          body.capabilities?.[0]?.id !== "wallet-check-high-risk-approvals" ||
          body.capabilities?.[0]?.requiresSignature !== false
        ) {
          throw new Error(`${name} expected mock wallet check capabilities`);
        }
      },
    ),
  );

  checks.push(
    request("api.user-settings", `${apiBaseUrl}/api/v1/user/settings`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (body.mode !== "mock" || body.settings?.[0]?.id !== "setting-language") {
        throw new Error(`${name} expected mock user preference settings`);
      }
    }),
  );

  checks.push(
    request("api.risk-database", `${apiBaseUrl}/api/v1/risk/database`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (body.mode !== "mock" || body.entries?.[0]?.id !== "risk-honeypot") {
        throw new Error(`${name} expected mock risk database glossary`);
      }
    }),
  );

  checks.push(
    request("api.high-risk-tokens", `${apiBaseUrl}/api/v1/risk/high-risk-tokens`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (
          body.mode !== "mock" ||
          !body.tokens?.[0]?.evidenceTags?.includes("solanaAuthorityRisk")
        ) {
          throw new Error(`${name} expected mock high-risk token list`);
        }
      },
    ),
  );

  checks.push(
    request("api.fake-token-examples", `${apiBaseUrl}/api/v1/risk/fake-token-examples`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (body.mode !== "mock" || body.examples?.[0]?.id !== "fake-usdt") {
          throw new Error(`${name} expected mock fake token examples`);
        }
      },
    ),
  );

  checks.push(
    request("api.risk-education-lessons", `${apiBaseUrl}/api/v1/risk/education-lessons`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (body.mode !== "mock" || body.lessons?.[0]?.id !== "lesson-honeypot-basics") {
          throw new Error(`${name} expected mock risk education lessons`);
        }
      },
    ),
  );

  checks.push(
    request("api.risk-monitor-rules", `${apiBaseUrl}/api/v1/risk/monitor-rules`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (body.mode !== "mock" || body.rules?.[0]?.id !== "monitor-high-risk-token") {
          throw new Error(`${name} expected mock risk monitor rules`);
        }
      },
    ),
  );

  checks.push(
    request("api.asset-cleanup-policies", `${apiBaseUrl}/api/v1/asset-cleanup/policies`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (body.mode !== "mock" || body.policies?.[0]?.flow !== "approval_cleaner") {
          throw new Error(`${name} expected mock asset cleanup policies`);
        }
      },
    ),
  );

  checks.push(
    request("api.growth-channels", `${apiBaseUrl}/api/v1/growth/channels`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (body.mode !== "mock" || body.channels?.[0]?.referralCode !== "KOL001") {
        throw new Error(`${name} expected mock growth channels`);
      }
    }),
  );

  checks.push(
    request("api.telegram-groups", `${apiBaseUrl}/api/v1/telegram/groups`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (body.mode !== "mock" || body.groups?.[0]?.title !== "SOL / BNB Alpha Group") {
        throw new Error(`${name} expected mock Telegram group settings`);
      }
    }),
  );

  checks.push(
    request("api.telegram-commands", `${apiBaseUrl}/api/v1/telegram/commands`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (body.mode !== "mock" || !body.commands?.some((item) => item.command === "/check <CA>")) {
          throw new Error(`${name} expected Telegram command list`);
        }
      },
    ),
  );

  checks.push(
    request("api.admin-audit", `${apiBaseUrl}/api/v1/admin/audit/logs`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (!body.logs?.[0] || !JSON.stringify(body).includes("[redacted]")) {
        throw new Error(`${name} expected redacted mock admin audit logs`);
      }
    }),
  );

  checks.push(
    request("api.admin-risk-review", `${apiBaseUrl}/api/v1/admin/risk-review/queue`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (body.mode !== "mock" || body.items?.[0]?.status !== "pending") {
          throw new Error(`${name} expected mock admin risk review queue`);
        }
      },
    ),
  );

  checks.push(
    request("api.admin-risk-labels", `${apiBaseUrl}/api/v1/admin/risk-labels`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (body.mode !== "mock" || body.labels?.[0]?.targetType !== "token") {
          throw new Error(`${name} expected mock admin risk label catalog`);
        }
      },
    ),
  );

  checks.push(
    request("api.admin-token-reports", `${apiBaseUrl}/api/v1/admin/token-reports`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        if (body.mode !== "mock" || body.reports?.[0]?.tokenSymbol !== "BNB-MVP") {
          throw new Error(`${name} expected mock admin token report index`);
        }
      },
    ),
  );

  checks.push(
    request("api.invalid-wallet", `${apiBaseUrl}/api/v1/wallet/not-a-wallet/health`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 400);
        const body = await response.json();
        if (body.error?.field !== "address") {
          throw new Error(`${name} expected field=address`);
        }
      },
    ),
  );

  // --- Bot ---
  checks.push(
    request("bot.start", `${botBaseUrl}/telegram/webhook`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: { text: "/start", chat: { id: 1 } } }),
    }).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      assertIncludesAnyGroups(name, body.reply ?? "", [
        ["ChainVigil AI"],
        ["买币前，先查 CA", "Before you buy, check the CA"],
        ["SOL", "BNB"],
      ]);
    }),
  );

  checks.push(
    request("bot.check", `${botBaseUrl}/telegram/webhook`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: { text: `/check ${tokenAddress}`, chat: { id: 1 } },
      }),
    }).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();
      if (body.mode !== "mock" || body.confidence !== "UNASSESSED") {
        throw new Error(`${name} expected check reply with mode/confidence`);
      }
      assertIncludesAnyGroups(name, body.reply ?? "", [
        ["模式：", "Mode:"],
        ["完整报告", "Full report"],
      ]);
    }),
  );

  checks.push(
    request("bot.invalid-check", `${botBaseUrl}/telegram/webhook`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: { text: "/check not-a-ca", chat: { id: 1 } } }),
    }).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      await assertHeader(name, response, "x-frame-options", "DENY");
      const body = await response.json();
      assertIncludesAnyGroups(name, body.reply ?? "", [
        ["请输入有效的 SOL 或 BNB", "Enter a valid SOL or BNB"],
      ]);
    }),
  );

  const results = await Promise.allSettled(checks);
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    for (const f of failures) {
      console.error(f.reason instanceof Error ? f.reason.message : f.reason);
    }
    throw new Error(`V0 smoke failed: ${failures.length}/${results.length} checks`);
  }

  console.log(`V0 smoke passed (${results.length} checks)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
