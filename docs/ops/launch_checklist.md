# 上线检查清单（代码侧 / 无密钥）

> 外部 API、RPC、支付在周末统一接入。本清单保证**代码与运维契约**先可上线验收。

## ⛔ 周末范围（与 TASKS / DECISIONS 一致）

| 做 | 不做（冻结到 S0 收尾之后） |
|----|---------------------------|
| 本节 **A 可选 build** + **D 外部依赖** + **E 上线日** | Redis 分层缓存落地、BullMQ/pending、Dust 粉碎动效 |
| 至少一个 live **或** 书面接受纯 mock 上线 | VP 推荐加权、纠错投票、平台垫付 Gas |
| 生产 smoke / readiness | S2 试点群冲刺、S3 真兑换、S4 规模化 |

SSOT：`TASKS.md` 顶部「周末闸门」；`DECISIONS.md`「周末闸门：只做 S0 收尾」。

## A. 构建与质量

- [x] `pnpm typecheck`（本地 2026-07-17 全绿）
- [x] `pnpm test`（本地 2026-07-17 全绿）
- [ ] `pnpm build`（上线前再跑一次生产构建）
- [x] `pnpm launch:check`（静态契约，不依赖外网）
- [x] `pnpm smoke:v0`（64 checks：GEO learn/honeypot、token noindex、sitemap 无 CA、双语断言）
- [x] `pnpm db:validate`（schema valid；无需真库）

## B. 安全契约（已实现于代码）

- [x] production `assertProductionRuntime`（api/bot）
- [x] Admin Basic Auth + API `/admin/*`
- [x] CORS 白名单
- [x] Webhook secret 校验
- [x] 写接口 `INTERNAL_WRITE_SECRET`
- [x] 报告 `mode` / `confidence`
- [x] 限流 + trustProxy 钩子

## C. 产品可上线叙事

- [x] 首页定位：买前安检 + SOL/BNB + VP 第二曲线
- [x] 报告页 mode 条（mock/live）
- [x] 钱包体检 mode 条
- [x] 定价页：Free / Pro / 群版 + VP 抵扣说明
- [x] Bot → API 优先、失败降级本地 mock
- [x] 分享文案带 mode 前缀
- [x] Token/钱包报告 **noindex**（CA 不做 SEO；sitemap 仅耐久页）
- [x] 耐久页 metadata + 全站 JSON-LD + `/learn/*` GEO 词条（8）进 sitemap

## D. 周末再做（外部依赖 · S0 收尾 · 唯一开放工程面）

- [ ] 填 `.env.production`（见 `.env.production.example`）
- [ ] `registerLiveProviderClient` 接 GoPlus / Honeypot / RPC（**或** 文档确认纯 mock 上线）
- [ ] Telegram 正式 webhook + secret
- [ ] HTTPS 域名 + 反代 TRUST_PROXY
- [ ] Postgres 生产实例（若启用持久化）；**Redis 可先不接热路径**（S1 冻结，compose 有 skeleton 即可）
- [ ] `curl` readiness 绿 + `smoke:v0` 对生产域名

## E. 上线当日

1. 只读部署，确认 health  
2. 人为触发 1 次 token check + 1 次 bot check  
3. 确认分享链接可开  
4. 确认 admin 无密码无法进（生产）  
5. 观察 429 / 5xx 15 分钟  
6. 确认报告页 **mode** 与真实数据源一致（mock 不得装 live）

## F. 周末之后（不要在 D/E 未完成时开工）

见 `TASKS.md`：S1 Redis/pending → S1.5 Dust → S2 群 → S3 VP → S4。  
解冻条件见 `DECISIONS.md`。
