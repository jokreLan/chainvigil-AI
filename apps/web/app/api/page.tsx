"use client";

import Link from "next/link";
import { useLocale } from "../i18n/locale-context";
import { DeveloperSubnav } from "../ui/developer-subnav";
import { WebsiteFooter } from "../ui/website-footer";
import { WebsiteHeader } from "../ui/website-header";

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/token/check",
    zh: "提交 CA、DEX 链接或原始文本，返回标准 Token 风险报告。",
    en: "Submit a CA, DEX link, or raw text and receive a standard token risk report.",
  },
  {
    method: "GET",
    path: "/api/v1/token/:chain/:address",
    zh: "读取指定链和合约地址的 Token 风险报告。",
    en: "Read a token risk report for a chain and contract address.",
  },
  {
    method: "POST",
    path: "/telegram/webhook",
    zh: "Telegram Bot skeleton webhook，支持 mock /check 调用。",
    en: "Telegram bot skeleton webhook with mock /check support.",
  },
  {
    method: "GET",
    path: "/api/v1/telegram/groups",
    zh: "读取 Telegram 群组 mock 设置、检测额度和高危提醒状态。",
    en: "Read mock Telegram group settings, quotas, and high-risk alert status.",
  },
  {
    method: "GET",
    path: "/api/v1/telegram/commands",
    zh: "读取 Telegram Bot 命令清单和人话说明。",
    en: "List Telegram bot commands with plain-language descriptions.",
  },
  {
    method: "GET",
    path: "/openapi.json",
    zh: "机器可读 API contract，用于 SDK、测试和未来开发者集成。",
    en: "Machine-readable OpenAPI contract for SDK, tests, and future developer integrations.",
  },
  {
    method: "GET",
    path: "/api/v1/meta",
    zh: "读取品牌、V0 版本、运行模式和支持链，不返回密钥或连接串。",
    en: "Brand, V0 version, runtime mode, and supported chains — never secrets or connection strings.",
  },
  {
    method: "GET",
    path: "/api/v1/system/readiness",
    zh: "读取系统就绪状态、缺失变量名和生产安全预检警告。",
    en: "System readiness, missing env names, and production security preflight warnings.",
  },
  {
    method: "GET",
    path: "/api/v1/data-sources/adapters",
    zh: "读取数据源 adapter mock/live 状态和缺失配置变量名，不返回密钥值。",
    en: "Data-source adapter mock/live status and missing config names — never secret values.",
  },
  {
    method: "GET",
    path: "/api/v1/risk/evidence-providers",
    zh: "读取 SOL/BNB 风险证据 Provider、链级证据范围和 V0 mock 降级策略。",
    en: "SOL/BNB evidence providers, chain scope, and V0 mock degradation policy.",
  },
  {
    method: "GET",
    path: "/api/v1/worker/jobs",
    zh: "读取 Worker 健康状态和 V0 后台任务 contract。",
    en: "Worker health and V0 background job contracts.",
  },
  {
    method: "GET",
    path: "/api/v1/risk/database",
    zh: "读取风险数据库人话解释、信号和建议动作。",
    en: "Risk database plain-language explanations, signals, and recommended actions.",
  },
  {
    method: "GET",
    path: "/api/v1/risk/high-risk-tokens",
    zh: "读取公开高危 CA 榜单 mock contract。",
    en: "Public high-risk CA board mock contract.",
  },
  {
    method: "GET",
    path: "/api/v1/risk/fake-token-examples",
    zh: "读取假币识别样例和风险信号。",
    en: "Fake-token samples and risk signals.",
  },
  {
    method: "GET",
    path: "/api/v1/risk/education-lessons",
    zh: "读取风险百科课程、关联信号和建议动作。",
    en: "Risk education lessons, related signals, and recommended actions.",
  },
  {
    method: "GET",
    path: "/api/v1/risk/monitor-rules",
    zh: "读取只读风险监控规则，不执行自动交易拦截或钱包操作。",
    en: "Read-only risk monitor rules — no auto trade blocks or wallet actions.",
  },
  {
    method: "GET",
    path: "/api/v1/asset-cleanup/policies",
    zh: "读取授权清理、资产理发师和粉尘扫描的只读安全策略。",
    en: "Read-only policies for approvals cleaner, asset barber, and dust scan.",
  },
  {
    method: "POST",
    path: "/api/v1/wallet/health",
    zh: "提交钱包地址，返回只读钱包健康报告。",
    en: "Submit a wallet address and receive a read-only wallet health report.",
  },
  {
    method: "GET",
    path: "/api/v1/wallet/watchlist",
    zh: "读取只读钱包 watchlist mock，不请求签名或私钥。",
    en: "Read-only wallet watchlist mock — no signatures or private keys.",
  },
  {
    method: "GET",
    path: "/api/v1/wallet/check-capabilities",
    zh: "读取钱包体检能力清单和 V0 禁止执行边界。",
    en: "Wallet check capability list and V0 non-execution boundaries.",
  },
  {
    method: "GET",
    path: "/api/v1/user/settings",
    zh: "读取 V0 只读用户偏好设置，不写入账户状态。",
    en: "V0 read-only user preference preview — does not write account state.",
  },
  {
    method: "GET",
    path: "/api/v1/points/rules",
    zh: "读取哨点 VP 事件规则和积分边界说明。",
    en: "Vigil Points event rules and ledger boundaries.",
  },
  {
    method: "GET",
    path: "/api/v1/points/ledger",
    zh: "读取哨点 VP mock ledger 摘要，区分 pending、confirmed、rejected。",
    en: "VP mock ledger summary with pending / confirmed / rejected states.",
  },
  {
    method: "GET",
    path: "/api/v1/growth/channels",
    zh: "读取 KOL、Telegram、X 渠道 mock 归因和 VP 结算摘要。",
    en: "KOL / Telegram / X channel mock attribution and VP settlement summary.",
  },
  {
    method: "GET",
    path: "/api/v1/admin/audit/logs",
    zh: "读取只读 Admin 审计日志 mock contract，metadata 已脱敏。",
    en: "Read-only admin audit log mock contract with redacted metadata.",
  },
  {
    method: "GET",
    path: "/api/v1/admin/risk-review/queue",
    zh: "读取高危 CA 人工复核 mock 队列，供 Admin skeleton 展示。",
    en: "High-risk CA human review mock queue for the admin skeleton.",
  },
  {
    method: "GET",
    path: "/api/v1/admin/risk-labels",
    zh: "读取 Token、部署者、授权对象的风险标签 mock 目录。",
    en: "Mock risk label catalog for tokens, deployers, and spenders.",
  },
  {
    method: "GET",
    path: "/api/v1/admin/token-reports",
    zh: "读取后台 Token 报告 mock 索引，供 Admin skeleton 查询展示。",
    en: "Admin mock index of token reports for skeleton browse/query.",
  },
] as const;

export default function ApiPage() {
  const { locale, t } = useLocale();
  const isZh = locale === "zh";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(
    /\/$/,
    "",
  );

  return (
    <main className="cv-website-page min-h-screen text-[#dce4e5]">
      <WebsiteHeader active="developers" />
      <DeveloperSubnav active="api" />

      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section>
          <p className="cv-font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#00d9f2]">
            Developer API · Contract reference · Not a public SLA
          </p>
          <h1 className="mt-3 cv-font-display text-4xl font-semibold tracking-[-0.04em] text-[#dce4e5] sm:text-5xl lg:text-6xl">
            {isZh ? "API 文档入口" : t("apiDocs.title")}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#9dacad] sm:text-lg">
            {isZh
              ? "V0 API 先服务 Web、Bot 和 Admin 内部调用。公开商业 API 会在风险准确率、限流、审计和计费模型稳定后开放。"
              : "V0 APIs serve Web, Bot, and Admin first. Public commercial APIs open after accuracy, rate limits, audit, and billing stabilize."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {apiBaseUrl ? (
              <a
                href={`${apiBaseUrl}/openapi.json`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center bg-[#00d9f2] px-4 cv-font-mono text-xs font-semibold uppercase text-[#002b31]"
              >
                {isZh ? "打开 OpenAPI JSON" : "Open OpenAPI JSON"}
              </a>
            ) : (
              <span className="inline-flex min-h-11 items-center border border-[#e7b900]/35 bg-[#e7b900]/6 px-4 cv-font-mono text-[11px] uppercase text-[#f3d36b]">
                {isZh ? "OpenAPI 地址未配置" : "OpenAPI origin not configured"}
              </span>
            )}
            <Link
              href="/risk-database"
              className="inline-flex min-h-11 items-center border border-[#3b494c] px-4 cv-font-mono text-xs font-semibold uppercase text-[#c3f5ff]"
            >
              {t("riskDb.title")}
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          {endpoints.map((endpoint) => (
            <article
              key={`${endpoint.method}-${endpoint.path}`}
              className="cv-website-panel border border-[#3b494c]/70 bg-[#0d1516]/88 p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#00d9f2] px-3 py-1 cv-font-mono text-xs font-semibold text-[#002b31]">
                  {endpoint.method}
                </span>
                <code className="break-all cv-font-mono text-sm text-[#dce4e5]">
                  {endpoint.path}
                </code>
              </div>
              <p className="mt-3 leading-7 text-[#9dacad]">
                {isZh ? endpoint.zh : endpoint.en}
              </p>
            </article>
          ))}
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
