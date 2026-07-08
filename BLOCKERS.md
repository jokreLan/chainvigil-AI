# BLOCKERS

## 当前阻塞

- 继续从 mock 风险报告升级到真实链上风险检测，需要至少一个 EVM RPC、GoPlus/Honeypot 或等价安全数据源凭证。当前 V0 mock 闭环不受影响。
- Docker 镜像构建实测暂时受 Docker Hub / 本机 Docker 网络影响：`node:20-bookworm-slim` 基础镜像元数据拉取超时或 EOF。Dockerfile 与 `docker compose config` 已通过静态校验，但镜像实际构建需等基础镜像可拉取后补验。

## 已处理问题

- `pnpm install` 首次被 pnpm 11 的依赖构建脚本审批拦截；已通过 `pnpm approve-builds --all` 非交互批准当前依赖。
- 第 51 轮无新增阻塞；Admin Telegram 命令清单复用既有 `@chainvigil/telegram` contract，未引入新外部依赖。
- 第 52 轮无新增阻塞；高危 CA 复核队列仍为只读 mock contract，真实审核动作需等待权限、审计写入和真实风险数据源。
- 第 52 轮目标门禁曾遇到 mock 风险复核队列数组字面量类型推宽，导致 `chain/status` 不满足共享类型；已使用 `satisfies AdminRiskReviewItem[]` 修复并通过后续门禁。
- 第 53 轮无新增阻塞；风险标签目录仍为只读 mock contract，真实标签新增/修正/停用需等待权限、审计写入和真实风险数据源。
- 第 54 轮无新增阻塞；Token 报告索引仍为只读 mock contract，真实检索、分页和数据库查询需等待 PostgreSQL 报告落库。
- 第 55 轮无新增阻塞；增长渠道归因仍为只读 mock contract，真实结算、反作弊和渠道归因需等待数据埋点与权限系统接入。
- 第 56 轮无新增阻塞；数据源 adapter readiness 只暴露 required env 名称，不调用真实 provider，也不返回任何密钥值。
- 第 57 轮无新增阻塞；Worker job contract 仍为只读 mock，真实队列消费需等待 Redis-backed queue 和幂等执行策略。
- 第 58 轮无新增阻塞；Web App 报告历史暂只展示 Token 报告索引，钱包体检历史聚合需等待账户与报告落库模型接入。
- 第 59 轮无新增阻塞；钱包 watchlist 仍为只读 mock，真实用户钱包列表需等待账户体系或本地匿名存储策略确认。
- Prisma schema 校验需要 `DATABASE_URL`；已在 db package 校验脚本中提供本地默认连接串，仅用于 schema validate。
- 严格 TypeScript 可选字段导致 VP 事件和 API mock 输入报错；已修复。
- Token 报告 OG 图片在本地边缘运行器中因中文动态字体加载和 `fit-content` 布局限制返回 500；已改为英文 ASCII 分享图文案和显式 flex 布局。
- 新增 API workspace 依赖后，旧 `pnpm dev` 热更新会话无法解析 `@chainvigil/chain`；已重启 dev 会话并通过运行态 smoke check。
- 第 37 轮运行态 smoke 曾遇到 Next dev 生成缓存异常，导致 Web 动态路由 `/token/[chain]/[address]`、`/wallet/[address]/health` 返回 404；清理 `apps/web/.next`、`apps/admin/.next` 后重启 dev，动态路由和 `pnpm smoke:v0` 均恢复通过。
- 第 47 轮运行态 smoke 曾遇到 Next/Turbopack dev cache 缺失 `.sst` 文件，导致 Web `/app/points` 返回 500；清理 `apps/web/.next`、`apps/admin/.next` 后重启 dev，`pnpm smoke:v0` 恢复通过。
- 第 50 轮目标门禁曾遇到 Web 未声明 `@chainvigil/telegram` workspace 依赖，导致 `/bot` 页面无法解析共享命令 contract；补齐依赖并重新 `pnpm install` 后通过目标门禁、全仓门禁和运行态 smoke。
