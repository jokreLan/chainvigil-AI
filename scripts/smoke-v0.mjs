const webBaseUrl = process.env.SMOKE_WEB_BASE_URL ?? "http://localhost:3000";
const adminBaseUrl = process.env.SMOKE_ADMIN_BASE_URL ?? "http://localhost:3001";
const apiBaseUrl = process.env.SMOKE_API_BASE_URL ?? "http://localhost:4000";
const botBaseUrl = process.env.SMOKE_BOT_BASE_URL ?? "http://localhost:4001";

const tokenAddress = "0x1111111111111111111111111111111111111110";

async function request(name, url, init = {}) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(8_000),
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

async function main() {
  const checks = [];

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
    }),
  );

  checks.push(
    request("web.api", `${webBaseUrl}/api`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (
        !html.includes("/api/v1/points/ledger") ||
        !html.includes("/api/v1/system/readiness") ||
        !html.includes("/api/v1/telegram/groups") ||
        !html.includes("/api/v1/telegram/commands")
      ) {
        throw new Error(`${name} expected current API endpoint list`);
      }
    }),
  );

  checks.push(
    request("web.bot", `${webBaseUrl}/bot`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("/check 0x...") || !html.includes("/settings")) {
        throw new Error(`${name} expected Telegram command list`);
      }
    }),
  );

  checks.push(
    request("web.token", `${webBaseUrl}/token/base/${tokenAddress}`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (
        !html.includes("application/ld+json") ||
        !html.includes('"@type":"Report"') ||
        !html.includes("riskAssessment")
      ) {
        throw new Error(`${name} expected report JSON-LD`);
      }
    }),
  );

  checks.push(
    request("web.points", `${webBaseUrl}/app/points`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("我的哨点摘要") || !html.includes("待确认")) {
        throw new Error(`${name} expected VP ledger summary`);
      }
    }),
  );

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

      if (!html.includes("系统就绪状态") || !html.includes("生产安全预检")) {
        throw new Error(`${name} expected readiness page with production security check`);
      }
    }),
  );

  checks.push(
    request("admin.audit", `${adminBaseUrl}/audit`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("后台审计日志") || !html.includes("[redacted]") || !html.includes("API 只读审计日志")) {
        throw new Error(`${name} expected audit log page with redacted metadata`);
      }
    }),
  );

  checks.push(
    request("admin.risk-review", `${adminBaseUrl}/risk-review`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("高危 CA 审核") || !html.includes("待复核") || !html.includes("honeypotDetected")) {
        throw new Error(`${name} expected mock risk review queue`);
      }
    }),
  );

  checks.push(
    request("admin.risk-labels", `${adminBaseUrl}/risk-labels`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("风险标签管理") || !html.includes("疑似貔貅盘") || !html.includes("honeypotDetected")) {
        throw new Error(`${name} expected mock risk label catalog`);
      }
    }),
  );

  checks.push(
    request("admin.points", `${adminBaseUrl}/points`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("Mock ledger 摘要") || !html.includes("待确认")) {
        throw new Error(`${name} expected VP ledger review summary`);
      }
    }),
  );

  checks.push(
    request("admin.telegram", `${adminBaseUrl}/telegram`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("Base Alpha Group") || !html.includes("自动检测") || !html.includes("/check 0x...")) {
        throw new Error(`${name} expected Telegram group settings and command list`);
      }
    }),
  );

  checks.push(
    request("api.token-check", `${apiBaseUrl}/api/v1/token/check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: tokenAddress, chain: "base" }),
    }).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      await assertHeader(name, response, "x-content-type-options", "nosniff");
      const body = await response.json();

      if (body.report?.label !== "禁买") {
        throw new Error(`${name} expected mock report label 禁买`);
      }
    }),
  );

  checks.push(
    request("api.meta", `${apiBaseUrl}/api/v1/meta`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();

      if (body.brand !== "ChainVigil AI" || body.version !== "v0" || !body.supportedChains?.includes("base")) {
        throw new Error(`${name} expected V0 service metadata`);
      }
    }),
  );

  checks.push(
    request("api.readiness", `${apiBaseUrl}/api/v1/system/readiness`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();
        const warnings = body.readiness?.productionSecurity?.warnings;

        if (!Array.isArray(warnings) || !warnings.some((warning) => warning.name === "ADMIN_SECRET")) {
          throw new Error(`${name} expected non-secret production security warnings`);
        }

        if (JSON.stringify(body).includes("replace-me")) {
          throw new Error(`${name} leaked placeholder secret value`);
        }
      },
    ),
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
    request("api.telegram-groups", `${apiBaseUrl}/api/v1/telegram/groups`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (body.mode !== "mock" || body.groups?.[0]?.title !== "Base Alpha Group") {
          throw new Error(`${name} expected mock Telegram group settings`);
        }
      },
    ),
  );

  checks.push(
    request("api.telegram-commands", `${apiBaseUrl}/api/v1/telegram/commands`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (body.mode !== "mock" || !body.commands?.some((item) => item.command === "/check 0x...")) {
          throw new Error(`${name} expected Telegram command list`);
        }
      },
    ),
  );

  checks.push(
    request("api.admin-audit", `${apiBaseUrl}/api/v1/admin/audit/logs`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (!body.logs?.[0]?.target?.startsWith("token:base:") || !JSON.stringify(body).includes("[redacted]")) {
          throw new Error(`${name} expected redacted mock admin audit logs`);
        }
      },
    ),
  );

  checks.push(
    request("api.admin-risk-review", `${apiBaseUrl}/api/v1/admin/risk-review/queue`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (
          body.mode !== "mock" ||
          body.items?.[0]?.status !== "pending" ||
          !body.items?.[0]?.signals?.includes("honeypotDetected")
        ) {
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

        if (
          body.mode !== "mock" ||
          body.labels?.[0]?.targetType !== "token" ||
          !body.labels?.[0]?.evidenceTags?.includes("honeypotDetected")
        ) {
          throw new Error(`${name} expected mock admin risk label catalog`);
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

  checks.push(
    request("bot.start", `${botBaseUrl}/telegram/webhook`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: { text: "/start", chat: { id: 1 } } }),
    }).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const body = await response.json();

      if (!body.reply?.includes("ChainVigil AI｜链哨 AI") || !body.reply?.includes("买币前，先查 CA。")) {
        throw new Error(`${name} expected brand start reply`);
      }
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

      if (!body.reply?.includes("请输入有效的 EVM 合约地址")) {
        throw new Error(`${name} expected invalid address hint`);
      }
    }),
  );

  await Promise.all(checks);
  console.log("V0 smoke passed");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
