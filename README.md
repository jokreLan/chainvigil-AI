# ChainVigil AI｜链哨 AI

买币前，先查 CA。

ChainVigil AI 是一个 Web3 交易安全工具。V0 聚焦免费 CA 安检、Token 风险报告页、报告分享、Telegram Bot 骨架、Admin 骨架和哨点 VP 积分事件模型。

第一版主优先链：Solana（SOL）和 BNB Smart Chain（BNB/BSC）。其它 EVM 链保留 mock contract 兼容，不作为第一版主交付重心。

## V0 范围

已纳入：

- Web DApp 首页与 `/check`
- `/token/[chain]/[address]` mock 风险报告页
- 钱包体检入口 `/wallet-check` 与 `/wallet/[address]/health` mock 报告页
- Fastify API：Token、Wallet/check capabilities/watchlist、user settings、risk database/high-risk tokens/fake token examples/risk education lessons/monitor rules、asset cleanup policies、VP rules/ledger、growth channels、Telegram groups、Referral、readiness、meta、只读 Admin audit/risk review/risk labels/token reports mock 与 OpenAPI skeleton
- Telegram Bot skeleton：`/telegram/webhook` 可 mock 调用
- Admin skeleton
- Prisma schema、VP 积分事件模型与 Admin 审计事件 contract
- 基础 SEO/GEO 页面结构

明确不做：

- 浏览器插件、全自动交易拦截、钱包签名拦截
- 自动 swap、粉尘归集、跨链 bridge
- 平台币 claim
- 承诺“哨点 VP = 未来 token”
- 要求用户首页连接钱包

## 快速开始

```bash
pnpm install
pnpm dev
```

默认服务：

- Web：`http://localhost:3000`
- Admin：`http://localhost:3001`（默认本地免登录；设置 `ADMIN_BASIC_AUTH_PASSWORD` 后启用 Basic Auth，API `/api/v1/admin/*` 同步生效）
- API：`http://localhost:4000`（CORS 白名单、写接口可配 `INTERNAL_WRITE_SECRET`、报告带 `mode`/`confidence`）
- Bot skeleton：`http://localhost:4001`（可配 `TELEGRAM_WEBHOOK_SECRET` 校验 webhook）
- Worker skeleton：后台长驻进程，V0 只打印健康心跳和 job contract

健康检查：

```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:4000/health
curl http://localhost:4001/health
curl http://localhost:4000/api/v1/meta
curl http://localhost:4000/api/v1/data-sources/adapters
curl http://localhost:4000/api/v1/risk/evidence-providers
curl http://localhost:4000/api/v1/worker/jobs
curl http://localhost:4000/api/v1/risk/database
curl http://localhost:4000/api/v1/risk/high-risk-tokens
curl http://localhost:4000/api/v1/risk/fake-token-examples
curl http://localhost:4000/api/v1/risk/education-lessons
curl http://localhost:4000/api/v1/risk/monitor-rules
curl http://localhost:4000/api/v1/asset-cleanup/policies
curl http://localhost:4000/api/v1/wallet/check-capabilities
curl http://localhost:4000/api/v1/wallet/watchlist
curl http://localhost:4000/api/v1/user/settings
curl http://localhost:4000/api/v1/points/ledger
curl http://localhost:4000/api/v1/growth/channels
curl http://localhost:4000/api/v1/telegram/groups
curl http://localhost:4000/api/v1/telegram/commands
curl http://localhost:4000/api/v1/admin/audit/logs
curl http://localhost:4000/api/v1/admin/risk-review/queue
curl http://localhost:4000/api/v1/admin/risk-labels
curl http://localhost:4000/api/v1/admin/token-reports
curl http://localhost:3000/token/bsc/0x1111111111111111111111111111111111111110
```

## 常用命令

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:validate
```

`pnpm dev` 启动后，可以运行 V0 smoke 验收：

```bash
pnpm smoke:v0
```

当前 smoke 约 64 项，覆盖：Web/Admin health 与安全头；对外页双语文案；**robots / sitemap**（耐久页在、CA/wallet 不进 sitemap）；**`/learn` GEO**（honeypot FAQ JSON-LD）；Token 报告 **noindex + freshness**；JSON-LD / mode / confidence；Admin 中文运营面；API token check（zh+en locale）、meta、数据源、证据 Provider、worker、风险库/榜单、监控/清理策略、钱包/设置/VP/growth/Telegram/审计；Bot `/start` 与坏 `/check`。另见 `pnpm launch:check`（无进程静态契约）。

上线前安全边界和生产预检见 `SECURITY.md`、`docs/ops/launch_checklist.md`。

## 战略与推进（OPC）

一人公司总控与下阶段任务：

- 总控：`docs/strategy/MASTER_CONTROL.md`
- 90 天 GTM：`docs/go-to-market/gtm_90_days.md`
- VP 第二曲线：`docs/product/vp_second_engine_v1.md`
- 运维手册：`docs/ops/runbook_v1.md`
- 任务板：`TASKS.md`

**定位一句话：** 买币前，在群里用中文把 CA 查清楚。

## V0 mock 流程

1. 打开 `http://localhost:3000`
2. 输入 SOL 或 BNB Token 地址，例如 `So11111111111111111111111111111111111111112` 或 `0x1111111111111111111111111111111111111111`
3. 提交后进入 `/token/solana/...` 或 `/token/bsc/0x...`
4. API 会返回 mock 风险报告，页面展示风险等级、人话解释、分享链接和免责声明

钱包体检 mock：

1. 打开 `http://localhost:3000/wallet-check`
2. 输入任意 EVM 钱包地址
3. 进入 `/wallet/0x.../health`
4. 页面展示只读健康分、授权风险、粉尘/Spam NFT 摘要和免责声明

## Telegram Bot mock

```bash
curl -X POST http://localhost:4001/telegram/webhook \
  -H "content-type: application/json" \
  -d '{"message":{"text":"/start","chat":{"id":1}}}'
```

```bash
curl -X POST http://localhost:4001/telegram/webhook \
  -H "content-type: application/json" \
  -d '{"message":{"text":"/check 0x1111111111111111111111111111111111111111","chat":{"id":1}}}'
```

## SDK

V0 已包含内部 TypeScript SDK skeleton：

```ts
import { ChainVigilClient } from "@chainvigil/sdk";

const client = new ChainVigilClient({ baseUrl: "http://localhost:4000" });
const result = await client.checkToken({
  input: "So11111111111111111111111111111111111111112",
  chain: "solana",
});
const meta = await client.getServiceMeta();
const dataSources = await client.getDataSourceAdapters();
const evidenceProviders = await client.getRiskEvidenceProviders();
const workerJobs = await client.getWorkerJobs();
const ledger = await client.getPointLedger();
const growthChannels = await client.getGrowthChannels();
const telegramGroups = await client.getTelegramGroups();
const telegramCommands = await client.getTelegramCommands();
const auditLogs = await client.getAdminAuditLogs();
const riskReviewQueue = await client.getAdminRiskReviewQueue();
const riskLabels = await client.getAdminRiskLabels();
const tokenReports = await client.getAdminTokenReports();
```

SDK 在 API 返回结构化错误时会抛出 `ChainVigilApiError`，其中包含 `status`、`code`、`field` 和人话 `message`。

## 数据库

Prisma schema 位于 `packages/db/prisma/schema.prisma`。V0 已包含：

- `TokenReport`
- `TokenRiskSnapshot`
- `RiskFactor`
- `PointEvent`
- `ReferralEvent`
- `TelegramGroup`
- `AdminAuditLog`

当前第一阶段不要求本地 PostgreSQL 必须启动；schema 先作为数据模型契约存在。

如需启动本地 PostgreSQL 和 Redis：

```bash
docker compose up -d postgres redis
pnpm db:validate
pnpm db:generate
pnpm db:migrate
pnpm --filter @chainvigil/db prisma:seed
```

默认连接串与 `.env.example` 一致：

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chainvigil_ai
REDIS_URL=redis://localhost:6379
```

## 环境变量契约

V0 mock 模式最少需要：

```text
CHAINVIGIL_RUNTIME_MODE=mock
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

进入生产或真实风险检测时，需要补齐 `.env.example` 中的 PostgreSQL、Redis、Telegram、`RPC_SOLANA_URL`、`RPC_BSC_URL`、GoPlus/Honeypot 或等价数据源配置。当前契约由 `@chainvigil/config` 的 `validateEnv` 测试固定。

`/api/v1/risk/evidence-providers` 会列出 SOL/BNB 所需的证据 Provider、环境变量和降级策略。即使环境变量已配置，V0 仍明确返回 `UNASSESSED` 置信度并使用 mock 快照，直到真实 provider client 与证据校验完成。

API 提供只读 readiness 端点：

```bash
curl http://localhost:4000/api/v1/system/readiness
curl http://localhost:4000/api/v1/meta
```

readiness 只返回缺失配置名称、依赖状态和生产安全预检警告，不返回任何密钥值；meta 只返回品牌、V0 版本、运行模式、支持链和可选 commit sha。

Admin 后台 V0 使用可配置 Basic Auth skeleton：

```text
ADMIN_BASIC_AUTH_USERNAME=admin
ADMIN_BASIC_AUTH_PASSWORD=change-me-before-deploy
INTERNAL_WRITE_SECRET=local-dev-write-secret-32
TELEGRAM_WEBHOOK_SECRET=local-dev-telegram-webhook
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
TRUST_PROXY=0
```

本地不设置 `ADMIN_BASIC_AUTH_PASSWORD` 时，Admin UI 与 API admin 路由保持直接可访问，方便第一阶段开发。  
生产模式（`CHAINVIGIL_RUNTIME_MODE=production`）启动时会 **fail-closed**：缺密钥/弱密钥/非 HTTPS 公开 URL 直接拒绝启动。详见 `SECURITY.md`。

## Admin 审计

V0 已提供 `@chainvigil/audit` contract，用于生成后台审计事件、格式化 token/Telegram target，并对 `apiKey`、`secret`、`token`、`password` 等 metadata 字段脱敏。当前不强制写入数据库；后续接入 Prisma `AdminAuditLog` 时复用同一事件结构。

Admin skeleton 提供 `/audit` 页面查看 mock 审计日志；API 提供只读 mock contract：

```bash
curl http://localhost:4000/api/v1/admin/audit/logs
```

V0 不提供无权限写审计日志接口，避免在真实权限系统接入前暴露误导性的管理写入口。

## Docker

仅启动基础设施：

```bash
docker compose up -d postgres redis
```

构建并启动 V0 全套服务：

```bash
docker compose --profile app up --build
```

应用服务使用以下 Dockerfile：

- `apps/web/Dockerfile`
- `apps/admin/Dockerfile`
- `apps/api/Dockerfile`
- `apps/bot/Dockerfile`
- `apps/worker/Dockerfile`

V0 Docker 镜像优先保证可读、可构建、可运行，暂未做生产级镜像裁剪。
