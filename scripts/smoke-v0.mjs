const webBaseUrl = process.env.SMOKE_WEB_BASE_URL ?? "http://localhost:3000";
const adminBaseUrl = process.env.SMOKE_ADMIN_BASE_URL ?? "http://localhost:3001";
const apiBaseUrl = process.env.SMOKE_API_BASE_URL ?? "http://localhost:4000";
const botBaseUrl = process.env.SMOKE_BOT_BASE_URL ?? "http://localhost:4001";

const tokenAddress = "0x1111111111111111111111111111111111111110";
const solanaTokenAddress = "So11111111111111111111111111111111111111112";

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
    request("web.wallet-check", `${webBaseUrl}/wallet-check`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("钱包体检") || !html.includes("高危授权") || !html.includes("read_only_check")) {
        throw new Error(`${name} expected wallet check capabilities`);
      }
    }),
  );

  checks.push(
    request("web.api", `${webBaseUrl}/api`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (
        !html.includes("/api/v1/points/ledger") ||
        !html.includes("/api/v1/system/readiness") ||
        !html.includes("/api/v1/data-sources/adapters") ||
        !html.includes("/api/v1/risk/evidence-providers") ||
        !html.includes("/api/v1/worker/jobs") ||
        !html.includes("/api/v1/risk/database") ||
        !html.includes("/api/v1/risk/high-risk-tokens") ||
        !html.includes("/api/v1/risk/fake-token-examples") ||
        !html.includes("/api/v1/risk/education-lessons") ||
        !html.includes("/api/v1/risk/monitor-rules") ||
        !html.includes("/api/v1/asset-cleanup/policies") ||
        !html.includes("/api/v1/wallet/watchlist") ||
        !html.includes("/api/v1/wallet/check-capabilities") ||
        !html.includes("/api/v1/user/settings") ||
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

      if (!html.includes("/check &lt;CA&gt;") || !html.includes("/settings")) {
        throw new Error(`${name} expected Telegram command list`);
      }
    }),
  );

  checks.push(
    request("web.token", `${webBaseUrl}/token/bsc/${tokenAddress}`).then(async ({ name, response }) => {
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
    request("web.risk-database", `${webBaseUrl}/risk-database`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("风险数据库") || !html.includes("貔貅盘 / Honeypot") || !html.includes("canSell=false")) {
        throw new Error(`${name} expected risk database glossary`);
      }
    }),
  );

  checks.push(
    request("web.solana-topic", `${webBaseUrl}/solana`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("Solana Token 安全检查") || !html.includes('"@type":"FAQPage"') || !html.includes("Mint / Freeze Authority")) {
        throw new Error(`${name} expected Solana topic structured data`);
      }
    }),
  );

  checks.push(
    request("web.bnb-topic", `${webBaseUrl}/bnb`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("BNB Smart Chain Token 安全检查") || !html.includes('"@type":"FAQPage"') || !html.includes("买卖与高税风险")) {
        throw new Error(`${name} expected BNB topic structured data`);
      }
    }),
  );

  checks.push(
    request("web.sitemap", `${webBaseUrl}/sitemap.xml`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const xml = await response.text();

      if (!xml.includes("/solana") || !xml.includes("/bnb")) {
        throw new Error(`${name} expected SOL and BNB topic routes`);
      }
    }),
  );

  checks.push(
    request("web.learn", `${webBaseUrl}/learn`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("风险百科") || !html.includes("什么是貔貅盘？") || !html.includes("sellTaxPercent&gt;=90")) {
        throw new Error(`${name} expected risk education lessons`);
      }
    }),
  );

  checks.push(
    request("web.high-risk-tokens", `${webBaseUrl}/leaderboard/high-risk-tokens`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const html = await response.text();

        if (!html.includes("高危 CA 榜单") || !html.includes("solanaAuthorityRisk") || !html.includes("Mock Solana Vigil Token")) {
          throw new Error(`${name} expected high-risk token list`);
        }
      },
    ),
  );

  checks.push(
    request("web.fake-token-database", `${webBaseUrl}/fake-token-database`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("假币数据库") || !html.includes("假 USDT") || !html.includes("symbolImpersonation")) {
        throw new Error(`${name} expected fake token examples`);
      }
    }),
  );

  checks.push(
    request("web.points", `${webBaseUrl}/app/points`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("哨点 VP") || !html.includes("待确认") || !html.includes("VP 不等于未来 token")) {
        throw new Error(`${name} expected VP ledger summary`);
      }
    }),
  );

  checks.push(
    request("web.reports", `${webBaseUrl}/app/reports`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("报告历史") || !html.includes("Mock BNB Vigil Token") || !html.includes("疑似貔貅盘")) {
        throw new Error(`${name} expected user token report index`);
      }
    }),
  );

  checks.push(
    request("web.wallets", `${webBaseUrl}/app/wallets`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("我的钱包") || !html.includes("主钱包") || !html.includes("Read-only watchlist")) {
        throw new Error(`${name} expected wallet watchlist`);
      }
    }),
  );

  checks.push(
    request("web.settings", `${webBaseUrl}/app/settings`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("设置") || !html.includes("语言") || !html.includes("V0 只读")) {
        throw new Error(`${name} expected user preference settings`);
      }
    }),
  );

  checks.push(
    request("web.growth", `${webBaseUrl}/app/growth`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("推广中心") || !html.includes("KOL001") || !html.includes("有效 CA")) {
        throw new Error(`${name} expected growth channel summary`);
      }
    }),
  );

  checks.push(
    request("web.monitor", `${webBaseUrl}/app/monitor`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("风险监控") || !html.includes("高危 token 复查") || !html.includes("不自动阻断交易")) {
        throw new Error(`${name} expected risk monitor rule summary`);
      }
    }),
  );

  checks.push(
    request("web.approval-cleaner", `${webBaseUrl}/app/approval-cleaner`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("授权清理") || !html.includes("授权撤销必须用户确认") || !html.includes("自动撤销授权")) {
        throw new Error(`${name} expected approval cleanup policy`);
      }
    }),
  );

  checks.push(
    request("web.asset-barber", `${webBaseUrl}/app/asset-barber`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("资产理发师") || !html.includes("可回收资产") || !html.includes("禁止处理资产")) {
        throw new Error(`${name} expected asset cleanup policy`);
      }
    }),
  );

  checks.push(
    request("web.dust", `${webBaseUrl}/app/dust`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("粉尘扫描") || !html.includes("粉尘归集阈值") || !html.includes("自动 swap")) {
        throw new Error(`${name} expected dust cleanup policy`);
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

      if (!html.includes("系统就绪状态") || !html.includes("生产安全预检") || !html.includes("risk.refresh")) {
        throw new Error(`${name} expected readiness page with production security check`);
      }
    }),
  );

  checks.push(
    request("admin.data-sources", `${adminBaseUrl}/data-sources`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (
        !html.includes("数据源状态") ||
        !html.includes("GoPlus") ||
        !html.includes("InternalRiskDB") ||
        !html.includes("SOL / BNB 风险证据 Provider") ||
        !html.includes("Solana RPC") ||
        !html.includes("BNB Smart Chain RPC")
      ) {
        throw new Error(`${name} expected data source adapter readiness`);
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

      if (!html.includes("高危 CA 审核") || !html.includes("待复核") || !html.includes("solanaAuthorityRisk")) {
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
    request("admin.reports", `${adminBaseUrl}/reports`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("Token 报告查询") || !html.includes("Mock Vigil Token") || !html.includes("疑似貔貅盘")) {
        throw new Error(`${name} expected mock token report index`);
      }
    }),
  );

  checks.push(
    request("admin.channels", `${adminBaseUrl}/channels`).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      const html = await response.text();

      if (!html.includes("KOL 渠道管理") || !html.includes("KOL001") || !html.includes("有效 CA")) {
        throw new Error(`${name} expected mock growth channel summary`);
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

      if (!html.includes("SOL / BNB Alpha Group") || !html.includes("自动检测") || !html.includes("/check &lt;CA&gt;")) {
        throw new Error(`${name} expected Telegram group settings and command list`);
      }
    }),
  );

  checks.push(
    request("api.token-check", `${apiBaseUrl}/api/v1/token/check`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: tokenAddress, chain: "bsc" }),
    }).then(async ({ name, response }) => {
      await assertStatus(name, response, 200);
      await assertHeader(name, response, "x-content-type-options", "nosniff");
      const body = await response.json();

      if (body.report?.chain !== "bsc" || !body.report?.label) {
        throw new Error(`${name} expected mock BNB report`);
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

      if (body.report?.chain !== "solana" || body.report?.tokenAddress !== solanaTokenAddress) {
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
    request("api.data-source-adapters", `${apiBaseUrl}/api/v1/data-sources/adapters`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (
          body.mode !== "mock" ||
          !body.adapters?.some((adapter) => adapter.name === "GoPlus" && adapter.requiredEnv === "GOPLUS_API_KEY") ||
          !body.adapters?.some((adapter) => adapter.name === "InternalRiskDB" && adapter.ready === true)
        ) {
          throw new Error(`${name} expected data source adapter readiness`);
        }

        if (JSON.stringify(body).includes("postgresql://")) {
          throw new Error(`${name} leaked connection string`);
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
          !body.providers?.some((provider) => provider.id === "solana-rpc" && provider.requiredEnv === "RPC_SOLANA_URL") ||
          !body.providers?.some((provider) => provider.id === "honeypot-bsc" && provider.fallback === "mock_snapshot")
        ) {
          throw new Error(`${name} expected SOL and BNB evidence provider contracts`);
        }

        if (JSON.stringify(body).includes("postgresql://")) {
          throw new Error(`${name} leaked connection string`);
        }
      },
    ),
  );

  checks.push(
    request("api.worker-jobs", `${apiBaseUrl}/api/v1/worker/jobs`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (
          body.mode !== "mock" ||
          body.worker?.service !== "chainvigil-worker" ||
          !body.worker?.jobs?.some((job) => job.name === "risk.refresh" && job.enabled === false)
        ) {
          throw new Error(`${name} expected worker job contract`);
        }

        if (JSON.stringify(body).includes("postgresql://")) {
          throw new Error(`${name} leaked connection string`);
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
    request("api.wallet-watchlist", `${apiBaseUrl}/api/v1/wallet/watchlist`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (body.mode !== "mock" || body.wallets?.[0]?.label !== "主钱包" || body.wallets?.[0]?.status !== "checked") {
          throw new Error(`${name} expected mock wallet watchlist`);
        }

        if (JSON.stringify(body).includes("privateKey")) {
          throw new Error(`${name} leaked private key field`);
        }
      },
    ),
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

      if (body.mode !== "mock" || body.settings?.[0]?.id !== "setting-language" || body.settings?.[0]?.editableInV0 !== false) {
        throw new Error(`${name} expected mock user preference settings`);
      }
    }),
  );

  checks.push(
    request("api.risk-database", `${apiBaseUrl}/api/v1/risk/database`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (
          body.mode !== "mock" ||
          body.entries?.[0]?.id !== "risk-honeypot" ||
          !body.entries?.[0]?.plainLanguage?.includes("买得进但卖不出")
        ) {
          throw new Error(`${name} expected mock risk database glossary`);
        }
      },
    ),
  );

  checks.push(
    request("api.high-risk-tokens", `${apiBaseUrl}/api/v1/risk/high-risk-tokens`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (
          body.mode !== "mock" ||
          body.tokens?.[0]?.label !== "禁买" ||
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

        if (
          body.mode !== "mock" ||
          body.examples?.[0]?.id !== "fake-usdt" ||
          !body.examples?.[0]?.signals?.includes("symbolImpersonation")
        ) {
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

        if (
          body.mode !== "mock" ||
          body.lessons?.[0]?.id !== "lesson-honeypot-basics" ||
          !body.lessons?.[0]?.relatedSignals?.includes("honeypotDetected")
        ) {
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

        if (
          body.mode !== "mock" ||
          body.rules?.[0]?.id !== "monitor-high-risk-token" ||
          !body.rules?.[0]?.explanation?.includes("不自动阻断交易")
        ) {
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

        if (
          body.mode !== "mock" ||
          body.policies?.[0]?.flow !== "approval_cleaner" ||
          body.policies?.[0]?.decision !== "manual_confirm"
        ) {
          throw new Error(`${name} expected mock asset cleanup policies`);
        }

        if (JSON.stringify(body).includes("privateKey")) {
          throw new Error(`${name} leaked private key field`);
        }
      },
    ),
  );

  checks.push(
    request("api.growth-channels", `${apiBaseUrl}/api/v1/growth/channels`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (body.mode !== "mock" || body.channels?.[0]?.referralCode !== "KOL001" || body.channels?.[0]?.effectiveCaChecks !== 96) {
          throw new Error(`${name} expected mock growth channels`);
        }
      },
    ),
  );

  checks.push(
    request("api.telegram-groups", `${apiBaseUrl}/api/v1/telegram/groups`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (body.mode !== "mock" || body.groups?.[0]?.title !== "SOL / BNB Alpha Group") {
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

        if (body.mode !== "mock" || !body.commands?.some((item) => item.command === "/check <CA>")) {
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
    request("api.admin-token-reports", `${apiBaseUrl}/api/v1/admin/token-reports`).then(
      async ({ name, response }) => {
        await assertStatus(name, response, 200);
        const body = await response.json();

        if (body.mode !== "mock" || body.reports?.[0]?.label !== "禁买" || body.reports?.[0]?.tokenSymbol !== "BNB-MVP") {
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

      if (!body.reply?.includes("请输入有效的 SOL 或 BNB Token 合约地址")) {
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
