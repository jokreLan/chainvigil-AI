# BLOCKERS

## 当前阻塞

- 继续从 mock 风险报告升级到真实链上风险检测，需要至少一个 EVM RPC、GoPlus/Honeypot 或等价安全数据源凭证。当前 V0 mock 闭环不受影响。
- Docker 镜像构建实测暂时受 Docker Hub / 本机 Docker 网络影响：`node:20-bookworm-slim` 基础镜像元数据拉取超时或 EOF。Dockerfile 与 `docker compose config` 已通过静态校验，但镜像实际构建需等基础镜像可拉取后补验。

## 已处理问题

- `pnpm install` 首次被 pnpm 11 的依赖构建脚本审批拦截；已通过 `pnpm approve-builds --all` 非交互批准当前依赖。
- Prisma schema 校验需要 `DATABASE_URL`；已在 db package 校验脚本中提供本地默认连接串，仅用于 schema validate。
- 严格 TypeScript 可选字段导致 VP 事件和 API mock 输入报错；已修复。
- Token 报告 OG 图片在本地边缘运行器中因中文动态字体加载和 `fit-content` 布局限制返回 500；已改为英文 ASCII 分享图文案和显式 flex 布局。
- 新增 API workspace 依赖后，旧 `pnpm dev` 热更新会话无法解析 `@chainvigil/chain`；已重启 dev 会话并通过运行态 smoke check。
- 第 37 轮运行态 smoke 曾遇到 Next dev 生成缓存异常，导致 Web 动态路由 `/token/[chain]/[address]`、`/wallet/[address]/health` 返回 404；清理 `apps/web/.next`、`apps/admin/.next` 后重启 dev，动态路由和 `pnpm smoke:v0` 均恢复通过。
- 第 47 轮运行态 smoke 曾遇到 Next/Turbopack dev cache 缺失 `.sst` 文件，导致 Web `/app/points` 返回 500；清理 `apps/web/.next`、`apps/admin/.next` 后重启 dev，`pnpm smoke:v0` 恢复通过。
