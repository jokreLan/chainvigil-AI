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
- 第 60 轮无新增阻塞；风险数据库仍是人话解释 contract，真实高危 CA/部署者/spender 数据源需要等待数据库写入和人工审核流程。
- 第 61 轮无新增阻塞；Web 推广中心仍复用增长渠道 mock，真实结算需等待反作弊、账户和渠道归因埋点。
- 第 62 轮无新增阻塞；风险监控规则仍为只读 mock，真实提醒需等待 RPC/索引器、通知通道和用户订阅模型。
- 第 63 轮无新增阻塞；买后清理策略仍为只读 mock，真实执行能力需等待钱包连接、交易模拟、gas 估算和二次确认流程。
- 第 64 轮无新增阻塞；公开高危 CA 榜单和假币样例仍为 mock，真实榜单需等待数据源证据、误报处理和人工复核机制。
- 第 65 轮无新增阻塞；风险教育课程仍为 beginner mock contract，真实课程运营、作者审核和多语言内容管理需等待内容工作流确认。
- 第 66 轮无新增阻塞；钱包体检能力清单仍为只读 mock contract，真实授权扫描、资产识别和撤销执行需等待 RPC/索引器、钱包连接和二次确认流程。
- 第 67 轮无新增阻塞；Solana 已进入 V0 地址解析、metadata 和 mock 报告 contract，但真实 Solana 风险检测仍需 Solana RPC、DEX/LP 数据、Token 权限解析和独立误报复核流程。
- 第 68 轮无新增阻塞；Telegram Bot 已改为 SOL/BNB 优先 mock 文案，真实群内自动识别和频控仍需 Telegram token、群权限模型和生产 webhook 配置。
- 第 69 轮无新增阻塞；公开风险情报与 Admin 复核队列已切到 SOL/BNB mock 示例，真实榜单仍需数据源证据、误报处理和人工复核机制。
- 第 70 轮无新增阻塞；SOL/BNB 风险证据 Provider contract、mock 降级和 `UNASSESSED` 置信度已固定，但真实扫描仍需对应 RPC、GoPlus/Honeypot 或等价数据源凭证、provider client 实现与人工误报治理。
- 第 70 轮 `git push origin main` 已恢复并成功推送至 GitHub；第 64 至 69 轮的 SSH 连接关闭记录不再是当前阻塞。
- 第 71 轮无新增阻塞；生产 readiness 已显式列出 SOL/BNB 两条主优先链 RPC，但真实可用性仍需对应 RPC 端点、provider client 和健康探测接入后验证。
- 第 72 轮无新增阻塞；Stitch 设计系统已落地到 V0 核心 Web 路径，视觉实现不依赖额外外部运行时服务。
- 第 73 轮无新增阻塞；钱包体检与 VP 的界面升级复用既有只读 mock contract，未引入钱包连接或新的外部依赖。
- 第 74 轮无新增阻塞；公开风险情报页只复用既有 mock contract 和报告链接，真实实时榜单仍受数据源证据与人工复核前置条件约束。
- 第 75 轮无新增阻塞；公开 Telegram Bot 链接仍需后续提供正式 Bot 用户名和生产 webhook 配置，当前 Web 入口准确保留为 mock 状态。
- 第 76 轮无新增阻塞；浏览器截图自动化运行时初始化遇到宿主 `process` 属性冲突，首页以原稿 HTML 的区块与开发态 HTTP smoke 完成验证，后续将修复浏览器运行时后补像素截图对照。
- 第 77 轮无新增阻塞；扫描状态复用现有 Token check 请求，不依赖外部动画或链上服务。
- 第 78 轮无新增阻塞；风险报告 UI 复用现有 mock evidence，真实链上证据仍需后续 provider client 与可复查来源接入。
- 第 79 轮无新增阻塞；移动导航仅复用既有可用路径，不新增钱包连接或账户状态。
- 第 80 轮无新增阻塞；钱包体检 UI 复用现有 BNB 只读 mock contract，真实多链钱包分析仍需 RPC/索引器与地址资产解析接入。
- 第 81 轮无新增阻塞；VP 中心的展示仅限已存在的只读 ledger 与规则，真实活动历史和账户体系需后续落库。
- 第 82 轮无新增阻塞；假币数据库 UI 复用已有仿盘 mock contract，按名称或 Symbol 的真实数据库搜索需等待风险情报索引和人工审核流程。
- 第 83 轮无新增阻塞；风险百科仍为只读 beginner mock 课程，按术语全文搜索和独立文章详情页需等待内容索引及审核工作流。
- 第 84 轮无新增阻塞；资产理发师已具备只读策略展示，真实资产分类需等待钱包地址输入、RPC/索引器资产解析和用户明确确认模型。
- 第 85 轮无新增阻塞；真实授权扫描和撤销能力需等待地址资产解析、spender 风险数据、交易模拟、gas 估算、钱包连接与二次确认流程。
- 第 86 轮无新增阻塞；生产 SDK/API 发布、鉴权、配额、Webhook 与可用性承诺需等待真实 provider、账户/密钥管理和运营策略。
- 第 87 轮无新增阻塞；实时高危榜单、部署者库和筛选索引需等待链上数据源、误报处理、证据存储与人工复核流程。
- 第 88 轮无新增阻塞；真实推广链接、反作弊、渠道结算、排行榜与 VP 账户归属需等待账户体系、埋点和运营规则。
- Prisma schema 校验需要 `DATABASE_URL`；已在 db package 校验脚本中提供本地默认连接串，仅用于 schema validate。
- 严格 TypeScript 可选字段导致 VP 事件和 API mock 输入报错；已修复。
- Token 报告 OG 图片在本地边缘运行器中因中文动态字体加载和 `fit-content` 布局限制返回 500；已改为英文 ASCII 分享图文案和显式 flex 布局。
- 新增 API workspace 依赖后，旧 `pnpm dev` 热更新会话无法解析 `@chainvigil/chain`；已重启 dev 会话并通过运行态 smoke check。
- 第 37 轮运行态 smoke 曾遇到 Next dev 生成缓存异常，导致 Web 动态路由 `/token/[chain]/[address]`、`/wallet/[address]/health` 返回 404；清理 `apps/web/.next`、`apps/admin/.next` 后重启 dev，动态路由和 `pnpm smoke:v0` 均恢复通过。
- 第 47 轮运行态 smoke 曾遇到 Next/Turbopack dev cache 缺失 `.sst` 文件，导致 Web `/app/points` 返回 500；清理 `apps/web/.next`、`apps/admin/.next` 后重启 dev，`pnpm smoke:v0` 恢复通过。
- 第 50 轮目标门禁曾遇到 Web 未声明 `@chainvigil/telegram` workspace 依赖，导致 `/bot` 页面无法解析共享命令 contract；补齐依赖并重新 `pnpm install` 后通过目标门禁、全仓门禁和运行态 smoke。
