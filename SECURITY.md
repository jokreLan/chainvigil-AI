# ChainVigil AI｜链哨 AI 安全边界

本文档用于 V0 开发和上线前复核。核心原则：买币前，先查 CA；但 V0 mock 报告不能被包装成真实链上安全结论。

## V0 可对外验证的能力

- Web DApp 可提交 EVM CA，并展示 mock 风险报告。
- API 可返回 mock Token 风险报告、钱包体检报告、VP 规则、系统就绪状态和只读 Admin 审计日志。
- Admin 可查看系统就绪状态、数据源状态、后台审计日志和基础管理页面骨架。
- Telegram Bot skeleton 可接收 `/check 0x...` mock webhook 调用。
- `pnpm smoke:v0` 可验证 Web、Admin、API、Bot 的关键运行路径。

## V0 不承诺的安全能力

- 不拦截钱包签名，不拦截交易，不自动 swap。
- 不做浏览器插件，不做自动粉尘归集，不做跨链 bridge。
- 不把哨点 VP / Vigil Points / VP 承诺为未来 token。
- 不把 mock 风险报告描述为真实链上检测结果。
- 不在无权限系统前提供 Admin 审计写接口。

## 生产前必须补齐

- `DATABASE_URL`：PostgreSQL 生产数据库。
- `REDIS_URL`：限流、队列或缓存的生产 Redis。
- `TELEGRAM_BOT_TOKEN`：真实 Telegram Bot token。
- `TELEGRAM_WEBHOOK_SECRET`：Telegram webhook secret token（`X-Telegram-Bot-Api-Secret-Token`）。
- `ADMIN_BASIC_AUTH_PASSWORD`：Admin 访问密码，不能使用示例值。
- `INTERNAL_WRITE_SECRET`：服务端写接口密钥（积分/推荐事件），至少 16 字符，**不要**配置为 `NEXT_PUBLIC_*`。
- `ADMIN_SECRET`、`JWT_SECRET`：至少 16 字符，不能使用 `replace-me`、`mock`、`test` 等占位值。
- `GOPLUS_API_KEY`、`HONEYPOT_API_KEY` 或等价数据源凭证。
- 生产主链 RPC：`RPC_SOLANA_URL`、`RPC_BSC_URL`。
- 对外地址必须使用 HTTPS，不能指向 `localhost`。
- `CORS_ALLOWED_ORIGINS`：生产浏览器允许来源白名单。
- `TRUST_PROXY=1`（或 hops 数）：API/Bot 位于反代之后时必须设置，限流才会使用真实客户端 IP。

## 生产 fail-closed

API / Bot 启动时会调用 `assertProductionRuntime()`：

- `CHAINVIGIL_RUNTIME_MODE=production` 时，若缺少必需环境变量或存在不安全密钥/URL，**直接拒绝启动**。
- 错误信息只包含变量名，不包含密钥值。
- mock 模式不阻断本地开发。

## 生产安全预检

系统就绪接口会返回非密钥级别的预检信息：

```bash
curl http://localhost:4000/api/v1/system/readiness
```

Admin `/system-readiness` 也会展示“生产安全预检”。这些检查只返回变量名和原因，不返回密钥值、连接串或 Bot token。

当前预检覆盖：

- 生产公开 URL 是否为 HTTPS。
- 生产公开 URL 是否仍指向 localhost。
- Admin、JWT、Telegram、Internal write 等密钥是否为空、过短或使用示例值。

## Admin 安全边界

- 本地开发时，如果 `ADMIN_BASIC_AUTH_PASSWORD` 为空，Admin UI 与 API `/api/v1/admin/*` 默认直接可访问。
- 一旦设置密码，Admin UI（`proxy.ts`）与 API admin 路由均要求 Basic Auth。
- 生产部署必须设置 `ADMIN_BASIC_AUTH_PASSWORD`；`docker compose --profile app` 启动 admin 时强制要求该变量。
- 密码比较使用 `crypto.timingSafeEqual`。
- 当前 Admin 仍是 skeleton，不应暴露高风险写操作。
- `/audit` 只读展示 mock 审计日志和脱敏规则，不代表真实审计已经落库。

## API 安全边界

- API 已有安全响应头：`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`、`Content-Security-Policy`、`Cross-Origin-*`；生产启用 HSTS。
- CORS 使用来源白名单（`CORS_ALLOWED_ORIGINS` 或 APP/Admin 默认本地地址），不再反射任意 Origin。
- 读/写公开入口均有限流；有 `REDIS_URL` 时优先使用 Redis 原子计数，失败回退内存。
- `POST /api/v1/points/event` 与 `POST /api/v1/referral/event`：
  - production 必须携带 `x-chainvigil-write-secret`（或 Admin Basic Auth）。
  - mock 下若配置了 `INTERNAL_WRITE_SECRET`，同样强制校验。
  - mock 且未配置写密钥时，允许本地开发直连（仅限本地）。
- Web 分享埋点走同源 BFF：`POST /api/referral`，由服务端注入写密钥。
- 错误响应应返回人话解释和字段名，不返回内部堆栈、密钥或连接串。
- readiness/meta 只允许返回服务状态、缺失变量名和公开元信息。
- Token / Wallet 报告 JSON 强制带 `mode` 与 `confidence`（V0 为 `mock` + `UNASSESSED`）。

## Telegram 安全边界

- 配置 `TELEGRAM_WEBHOOK_SECRET` 后，webhook 必须携带匹配的 `X-Telegram-Bot-Api-Secret-Token`。
- production 启动要求该 secret；mock 未配置时保持本地可测。
- Webhook 有独立限流。

## VP 安全边界

- VP 事件默认 `pending`，避免把推广、贡献或安全行为直接确认为可用余额。
- V0 不承诺 VP 兑换、空投、平台币 claim 或任何金融权益。
- 高价值 VP 必须等真实风控、反作弊和人工复核机制接入后再确认。
- 客户端不得直接持有 `INTERNAL_WRITE_SECRET`。

## Docker / 基础设施

- 应用镜像使用多阶段构建并以非 root 用户运行。
- Compose 中 Postgres / Redis 仅绑定 `127.0.0.1`，避免默认暴露到公网接口。
- Admin 服务启动要求 `ADMIN_BASIC_AUTH_PASSWORD`。
- 默认 `postgres/postgres` 仅用于本地；生产必须替换。

## 真实风险检测上线条件

真实检测前至少需要：

- 明确每条链的 RPC 来源、速率限制和失败降级策略。
- GoPlus、Honeypot 或等价数据源接入测试。
- 数据新鲜度字段和 evidence 可追溯。
- 报告页面明确区分 live 数据和 mock/未知数据。
- 后台人工复核和审计落库闭环。
