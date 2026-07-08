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
- `ADMIN_BASIC_AUTH_PASSWORD`：Admin 访问密码，不能使用示例值。
- `ADMIN_SECRET`、`JWT_SECRET`：至少 16 字符，不能使用 `replace-me`、`mock`、`test` 等占位值。
- `GOPLUS_API_KEY`、`HONEYPOT_API_KEY` 或等价数据源凭证。
- 至少一个生产 EVM RPC，V0 当前优先要求 `RPC_BASE_URL`。
- 对外地址必须使用 HTTPS，不能指向 `localhost`。

## 生产安全预检

系统就绪接口会返回非密钥级别的预检信息：

```bash
curl http://localhost:4000/api/v1/system/readiness
```

Admin `/system-readiness` 也会展示“生产安全预检”。这些检查只返回变量名和原因，不返回密钥值、连接串或 Bot token。

当前预检覆盖：

- 生产公开 URL 是否为 HTTPS。
- 生产公开 URL 是否仍指向 localhost。
- Admin、JWT、Telegram 等密钥是否为空、过短或使用示例值。

## Admin 安全边界

- 本地开发时，如果 `ADMIN_BASIC_AUTH_PASSWORD` 为空，Admin 默认直接可访问。
- 生产部署必须设置 `ADMIN_BASIC_AUTH_PASSWORD`。
- 当前 Admin 仍是 skeleton，不应暴露高风险写操作。
- `/audit` 只读展示 mock 审计日志和脱敏规则，不代表真实审计已经落库。

## API 安全边界

- API 已有基础安全响应头。
- 写入口已有内存限流 skeleton；生产建议切换到 Redis-backed 限流。
- 错误响应应返回人话解释和字段名，不返回内部堆栈、密钥或连接串。
- readiness/meta 只允许返回服务状态、缺失变量名和公开元信息。

## VP 安全边界

- VP 事件默认 `pending`，避免把推广、贡献或安全行为直接确认为可用余额。
- V0 不承诺 VP 兑换、空投、平台币 claim 或任何金融权益。
- 高价值 VP 必须等真实风控、反作弊和人工复核机制接入后再确认。

## 真实风险检测上线条件

真实检测前至少需要：

- 明确每条链的 RPC 来源、速率限制和失败降级策略。
- GoPlus、Honeypot 或等价数据源接入测试。
- 数据新鲜度字段和 evidence 可追溯。
- 报告页面明确区分 live 数据和 mock/未知数据。
- 后台人工复核和审计落库闭环。
