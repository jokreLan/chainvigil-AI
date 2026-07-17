# 上线检查清单（代码侧 / 无密钥）

> 外部 API、RPC、支付在周末统一接入。本清单保证**代码与运维契约**先可上线验收。

## ⛔ 周末范围（与 TASKS / DECISIONS 一致）

| 做 | 不做（冻结到 S0 收尾之后） |
|----|---------------------------|
| 本节 **A build** + **D 外部依赖** + **E 上线日** | BullMQ/pending、Dust 粉碎动效 |
| 至少一个 live **或** 书面接受纯 mock 上线 | VP 推荐加权、纠错投票、平台垫付 Gas |
| 生产 smoke / readiness | S2 试点群冲刺、S3 真兑换、S4 规模化 |

SSOT：`TASKS.md` 顶部「周末闸门」；`DECISIONS.md`「周末闸门：只做 S0 收尾」。

## A. 构建与质量

- [x] `pnpm typecheck`（本地 2026-07-17 全绿）
- [x] `pnpm test`（本地 2026-07-17 全绿）
- [ ] `pnpm build`（本轮代码完成后与上线镜像各跑一次）
- [x] `pnpm launch:check`（静态契约，不依赖外网）
- [x] `pnpm smoke:v0`（64 checks：GEO learn/honeypot、token noindex、sitemap 无 CA、双语断言）
- [x] `pnpm db:validate`（schema valid）
- [x] 初始 Prisma migration + 容器启动前 `prisma migrate deploy`

## B. 安全契约（已实现于代码）

- [x] production `assertProductionRuntime`（api/bot）
- [x] Admin Basic Auth + API `/admin/*`
- [x] CORS 白名单
- [x] Webhook secret 校验
- [x] 写接口 `INTERNAL_WRITE_SECRET`
- [x] 报告 `mode` / `confidence`
- [x] 限流 + trustProxy 钩子
- [x] Redis 官方客户端；生产连接失败即阻断，不静默回退
- [x] Web/Admin/Bot/Worker 分服务生产启动闸门
- [x] API/Bot 生产结构化日志与递归密钥脱敏

## C. 产品可上线叙事

- [x] 首页定位：买前安检 + SOL/BNB + VP 第二曲线
- [x] 报告页 mode 条（mock/live）
- [x] 钱包体检 mode 条
- [x] 定价页：Free / Pro / 群版 + VP 抵扣说明
- [x] Bot → API 优先、失败降级本地 mock
- [x] 分享文案带 mode 前缀
- [x] Token/钱包报告 **noindex**（CA 不做 SEO；sitemap 仅耐久页）
- [x] `/zh/*`、`/en/*` 独立 URL + hreflang + 双语 sitemap，可继续扩展 locale
- [x] 耐久页 metadata + JSON-LD + GEO 词条进 sitemap；文章有审阅、日期和官方来源
- [x] About / Methodology / Privacy / Terms / Contact 信任页面

## D. 周末再做（外部依赖 · S0 收尾 · 唯一开放工程面）

- [ ] 填 `.env.production`（见 `.env.production.example`）
- [x] 内置 GoPlus / Honeypot.is / BSC RPC / Solana RPC 客户端与逐源降级
- [ ] 用真实 key/RPC 跑测试样本并人工核对误报、漏报与税率单位
- [ ] Telegram 正式 webhook + secret
- [ ] HTTPS 域名 + 反代 TRUST_PROXY
- [ ] Postgres 生产实例：执行 migration，验证报告快照、积分、推荐事件落库
- [ ] Redis 生产实例：验证 PING、TLS/ACL（托管服务适用）和多实例限流
- [ ] `curl` readiness 绿 + `smoke:v0` 对生产域名

## E. 上线当日

1. 只读部署，确认 health  
2. 人为触发 1 次 token check + 1 次 bot check  
3. 确认分享链接可开  
4. 确认 admin 无密码无法进（生产）  
5. 观察 429 / 5xx 15 分钟  
6. 确认报告页 **mode** 与真实数据源一致（mock 不得装 live）
7. 检查 `/zh`、`/en`、hreflang、sitemap/robots 均指向生产域名
8. 查询 `/api/v1/admin/metrics/north-star?days=7`，确认扫描/推荐事件开始累计

## F. 周末之后（不要在 D/E 未完成时开工）

见 `TASKS.md`：S1 Redis/pending → S1.5 Dust → S2 群 → S3 VP → S4。  
解冻条件见 `DECISIONS.md`。
