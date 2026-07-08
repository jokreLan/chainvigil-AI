# Token 哨兵 / 资产理发师｜Monorepo 项目结构与工程架构设计

> 版本：v0.1  
> 日期：2026-07-08  
> 状态：工程架构定稿草案，用于 V0/V1 仓库初始化与研发协作。

## 1. 结论

项目建议采用 **轻量 Monorepo** 架构。

推荐方案：

```text
pnpm workspace + Turborepo + TypeScript
```

暂不建议一开始使用 Nx，也暂不建议拆成多个独立仓库。当前阶段最重要的是快速验证产品闭环，同时保证 Web DApp、API、Telegram Bot、后台、风险引擎、积分系统之间可以共享类型、规则和数据结构。

一句话原则：

> 用 Monorepo，但保持克制。V0 只为共享类型、风险规则、报告文案、积分规则和多端复用服务，不为了架构而架构。

## 2. 为什么适合 Monorepo

本项目不是单一前端，也不是单一后端，而是一套 Web3 安全产品系统。它会同时包含：

- Web DApp：CA 安检、Token 报告页、钱包体检、积分中心、推广中心。
- API 服务：风险检测、报告生成、钱包体检、积分事件、推广归因。
- Telegram Bot：群内 `/check`、高危提醒、群主面板、推广入口。
- Admin 后台：高危 CA 审核、误报修正、积分审核、渠道管理。
- Worker：异步扫描、报告刷新、OG 图生成、积分结算、反作弊任务。
- 共享模块：风险规则、第三方数据适配器、链配置、报告模板、积分规则、数据库 schema。

如果拆成多个仓库，早期会出现这些问题：

- 前后端 DTO 不一致。
- Bot 和 Web 的风险文案不一致。
- 积分事件定义分散。
- 风险规则重复实现。
- 多端发版困难。
- API 变更同步成本高。

Monorepo 可以让我们统一：

- TypeScript 类型。
- 风险评分规则。
- 报告解释模板。
- 积分和推广规则。
- 数据库 schema。
- lint / test / build / CI 流程。

## 3. 技术选型建议

### 3.1 包管理与任务编排

```text
包管理：pnpm workspace
任务编排：Turborepo
主语言：TypeScript
```

选择理由：

- pnpm workspace 足够轻，适合多 app、多 package 管理。
- Turborepo 适合 JavaScript / TypeScript monorepo 的构建缓存、并行任务和 CI 优化。
- TypeScript 可以让 Web、API、Bot、Worker 共享类型和业务规则。

暂不使用 Nx 的原因：

- V0 阶段团队和服务复杂度还没有到大型 monorepo 级别。
- Nx 的插件体系和规则更重，早期可能拖慢迭代。
- 等 apps 超过 8-10 个、CI 明显变慢、团队协作复杂后，再评估是否迁移。

### 3.2 前端

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui 或自研组件
SSR / ISR
动态 OG 图
中英文 i18n
```

Web DApp 不应该做成纯客户端应用，因为我们需要 SEO/GEO 页面、Token 报告页和可分享内容页。

### 3.3 后端

```text
Node.js / TypeScript
Fastify 或 NestJS
PostgreSQL
Redis
Queue：BullMQ 或 Temporal，V0 优先 BullMQ
ORM：Prisma 或 Drizzle，V0 优先 Prisma
```

建议 V0 采用模块化单体，不要过早微服务化。API、Bot、Worker 可以先独立 app，但业务模块通过 packages 共享。

### 3.4 链上与外部数据

V0 以第三方数据源 + 自建风险库为主：

```text
GoPlus
Honeypot.is
RPC Provider
区块浏览器 API
DEX / Pair 数据源
自建 risk_factors / token_reports / scam registry
```

长期护城河来自自建数据：

- 高危 CA 数据库。
- 假币数据库。
- 高危部署者画像。
- 恶意 spender 数据库。
- 群内热传 CA 数据。
- 用户举报与误报申诉数据。
- 风险检测历史快照。

## 4. 推荐仓库结构

完整目标结构如下：

```text
token-sentinel/
├── apps/
│   ├── web/                 # Web DApp：CA 安检、报告页、钱包体检、积分/推广中心
│   ├── admin/               # 后台管理：风险审核、积分审核、渠道管理
│   ├── api/                 # 后端 API：Risk / Report / Wallet / Points / Growth
│   ├── bot/                 # Telegram Bot：/check、群检测、高危提醒
│   └── worker/              # 异步任务：深度扫描、缓存刷新、积分结算、反作弊
│
├── packages/
│   ├── types/               # 全局类型、DTO、枚举
│   ├── config/              # eslint、tsconfig、prettier、env schema
│   ├── db/                  # Prisma/Drizzle schema、数据库 client
│   ├── ui/                  # 共享 UI 组件
│   ├── risk-core/           # 风险评分核心逻辑
│   ├── risk-rules/          # 风险规则定义
│   ├── data-adapters/       # GoPlus、Honeypot、RPC、DEX 数据适配
│   ├── chain/               # EVM 工具、地址解析、链配置
│   ├── report/              # 报告生成、文案模板、分享卡片文案
│   ├── points/              # 积分事件、赛季规则、推广归因
│   └── logger/              # 日志、错误封装
│
├── docs/
│   ├── product/
│   ├── api/
│   └── tech/
│
├── scripts/
│   ├── seed.ts
│   ├── migrate.ts
│   └── generate-og.ts
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

## 5. V0 最小仓库结构

V0 不需要一开始把所有目录建满。建议先落这个最小结构：

```text
token-sentinel/
├── apps/
│   ├── web/
│   ├── api/
│   ├── bot/
│   └── admin/
│
├── packages/
│   ├── types/
│   ├── config/
│   ├── db/
│   ├── risk-core/
│   ├── data-adapters/
│   ├── report/
│   └── points/
│
├── docs/
│   ├── product/
│   ├── tech/
│   └── api/
│
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

`apps/worker` 可以 V0.5 或 V1 再拆。如果 V0 异步任务还少，可以先放在 `apps/api` 内部的 worker 模块中。

## 6. apps 职责定义

### 6.1 apps/web

主产品入口。

职责：

- 首页。
- CA 安检页。
- Token 风险报告页。
- 钱包地址只读体检页。
- 积分中心。
- 推广中心。
- SEO/GEO 风险百科页。
- 高危 CA 榜单页。
- 分享卡片展示和落地页。

边界：

- 不直接实现风险评分核心逻辑。
- 不直接调用多个第三方安全 API。
- 通过 `apps/api` 或共享 package 获取标准化风险结果。

### 6.2 apps/api

核心 API 服务。

职责：

- `/api/v1/token/check`：CA 安检。
- `/api/v1/token/:chain/:address`：Token 报告读取。
- `/api/v1/wallet/health`：钱包体检。
- `/api/v1/wallet/:address/approvals`：授权列表。
- `/api/v1/points/event`：积分事件。
- `/api/v1/referral/*`：推广归因。
- Admin API。
- Telegram Bot webhook 所需 API。

边界：

- API 做编排，不把所有业务规则写死在 controller 里。
- 风险评分调用 `packages/risk-core`。
- 第三方数据读取调用 `packages/data-adapters`。
- 积分规则调用 `packages/points`。

### 6.3 apps/bot

Telegram Bot。

职责：

- `/check 0x...`。
- 群内 CA 检测。
- 高危风险提醒。
- 群主设置。
- 检测结果返回报告链接。
- 记录推广来源和积分事件。

边界：

- Bot 不自己实现风险引擎。
- Bot 不直接操作用户资产。
- Bot 只做查询、提醒、传播和归因。

### 6.4 apps/admin

后台管理系统。

职责：

- Token 报告查询。
- 高危 CA 审核。
- 假币举报审核。
- 风险标签人工修正。
- Spender 风险标记。
- Deployer 风险标记。
- 积分事件审核。
- 推广作弊处理。
- Telegram 群组管理。
- KOL 渠道管理。
- API 调用监控。

边界：

- Admin 是运营和风控后台，不面向普通用户。
- 风险修正必须可追踪，保留操作人和操作理由。

### 6.5 apps/worker

异步任务服务，V0 可暂缓独立。

职责：

- Token 深度扫描。
- 报告缓存刷新。
- 热门 token 定时复查。
- OG 图生成。
- 积分延迟结算。
- 反作弊分析。
- 部署者画像刷新。
- Telegram 群数据统计。

边界：

- Worker 不处理用户实时请求。
- Worker 任务必须幂等，避免重复给分、重复生成报告、重复写入风险标签。

## 7. packages 职责定义

### 7.1 packages/types

全局类型中心。

包含：

- ChainId。
- RiskLevel。
- TokenRiskReport。
- RiskReason。
- PointEventType。
- ReferralSource。
- WalletHealthReport。
- ApprovalRiskItem。

示例：

```ts
export type ChainId = 'ethereum' | 'bsc' | 'base' | 'arbitrum' | 'polygon' | 'optimism'

export type RiskLevel = 'BLOCK' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN'

export interface RiskReason {
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  explanation: string
  evidence?: Record<string, unknown>
}

export interface TokenRiskReport {
  chain: ChainId
  tokenAddress: string
  score: number
  riskLevel: RiskLevel
  summary: string
  reasons: RiskReason[]
  checkedAt: string
}
```

### 7.2 packages/risk-core

风险评分大脑。

职责：

- 合并多源风险数据。
- 执行一票否决规则。
- 计算风险分数。
- 输出风险等级。
- 排序风险原因。
- 输出推荐动作。

边界：

- 不依赖数据库。
- 不依赖 Web、API、Bot。
- 不直接访问第三方 API。
- 输入标准化数据，输出标准化报告。

### 7.3 packages/risk-rules

风险规则库。

示例规则：

- 卖出失败 = 禁买。
- Honeypot 命中 = 禁买。
- 100% 或极高卖出税 = 禁买。
- 可改税 + 高税 = 高危。
- 黑名单权限存在 = 高危。
- LP 未锁 + 低流动性 = 高危。
- 前 10 持仓过高 = 谨慎/高危。
- Owner 未放弃 + 可暂停交易 = 高危。

说明：

- V0 可以先把规则放在 `risk-core` 里。
- 当规则数量和版本管理变复杂后，再拆成独立 `risk-rules`。

### 7.4 packages/data-adapters

第三方和链上数据适配层。

包含：

- GoPlus adapter。
- Honeypot adapter。
- RPC adapter。
- Explorer adapter。
- DEX / Pair adapter。
- Internal risk DB adapter。

职责：

- 隐藏第三方 API 字段差异。
- 做失败重试和超时处理。
- 标准化响应。
- 标记数据新鲜度和可信度。

### 7.5 packages/report

报告生成与文案模板。

职责：

- 生成中文/英文风险解释。
- 生成 Telegram Bot 回复文案。
- 生成 SEO title / description。
- 生成分享卡片文案。
- 生成报告摘要。

目标：

> Web、Bot、分享页、后台看到同一套风险解释，避免多端文案不一致。

### 7.6 packages/points

积分、推广和赛季规则。

职责：

- XP 成长积分规则。
- 安全贡献分规则。
- 推广奖励分规则。
- 赛季规则。
- 每日上限。
- 待确认积分。
- 反女巫系数。
- 推广归因结算。

重要边界：

- 所有积分必须以事件方式记录。
- 不允许在业务代码里直接改用户总分。
- 高价值积分必须支持 pending / confirmed / rejected 状态。

### 7.7 packages/db

数据库 schema 和 client。

包含：

- Prisma schema 或 Drizzle schema。
- 数据库 client。
- 基础查询封装。
- migration 管理。

注意：

- 不要把业务规则写进 db package。
- db package 只负责数据模型和数据访问。

### 7.8 packages/chain

链配置和地址工具。

包含：

- chain registry。
- RPC 配置。
- explorer URL。
- native token 信息。
- 地址校验。
- checksum 处理。
- CA / pair / router 解析工具。

### 7.9 packages/ui

共享 UI 组件。

包含：

- Button。
- Card。
- Badge。
- RiskLevelBadge。
- TokenAddress。
- CopyButton。
- ScoreMeter。

边界：

- UI package 尽量不依赖 risk-core/db。
- 可以依赖 types。
- 避免把业务请求逻辑写进 UI 组件。

## 8. 依赖边界

必须定死依赖方向，避免 Monorepo 变成循环依赖迷宫。

推荐依赖方向：

```text
apps/* 可以依赖 packages/*
packages/* 不能依赖 apps/*

risk-core -> types
risk-core 不依赖 db/api/web/bot

data-adapters -> types + chain + logger
report -> types
points -> types
ui -> types
api -> risk-core + data-adapters + db + points + report
web -> ui + types + report client
bot -> types + report + api client
admin -> ui + types + api client
```

禁止：

```text
packages/risk-core 依赖 apps/api
packages/report 依赖 apps/web
packages/ui 依赖 packages/db
packages/data-adapters 直接写积分事件
apps/bot 自己实现一套风险规则
apps/web 直接散落调用第三方安全 API
```

核心原则：

> risk-core 是纯业务核心；data-adapters 负责拿数据；api 负责编排；web/bot 负责展示和传播。

## 9. pnpm workspace 配置

`pnpm-workspace.yaml`：

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "docs/*"
```

根目录 `package.json` 建议：

```json
{
  "name": "token-sentinel-monorepo",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "typecheck": "turbo typecheck",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "latest",
    "prettier": "latest"
  }
}
```

## 10. Turborepo 配置

`turbo.json`：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

## 11. 命名规范

### 11.1 package 命名

建议统一使用 scope：

```text
@token-sentinel/types
@token-sentinel/risk-core
@token-sentinel/data-adapters
@token-sentinel/report
@token-sentinel/points
@token-sentinel/db
@token-sentinel/ui
@token-sentinel/chain
```

### 11.2 环境变量命名

```text
DATABASE_URL
REDIS_URL
GOPLUS_API_KEY
HONEYPOT_API_KEY
RPC_ETHEREUM_URL
RPC_BSC_URL
RPC_BASE_URL
TELEGRAM_BOT_TOKEN
APP_BASE_URL
ADMIN_SECRET
JWT_SECRET
```

使用 `packages/config` 维护 env schema，避免环境变量散落。

## 12. 部署建议

虽然代码在一个仓库，但服务应该独立部署。

```text
apps/web    -> Vercel / Cloudflare Pages / 自建 Node
apps/api    -> Render / Fly.io / Railway / AWS / GCP / Kubernetes
apps/bot    -> 独立 Node 服务或 serverless webhook
apps/admin  -> Vercel / 内网部署 / 权限保护
apps/worker -> 独立 worker process
```

部署原则：

- Monorepo 是代码管理方式，不代表所有服务一起发布。
- Web、API、Bot、Worker 要可以独立扩容和回滚。
- API 与 Worker 共用 packages，但 runtime 要独立。
- Admin 必须做访问控制和操作审计。

## 13. CI/CD 建议

V0 最小 CI：

```text
1. install
2. lint
3. typecheck
4. test
5. build
```

建议流程：

```text
Pull Request:
- pnpm install
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build

Main Branch:
- build web
- build api
- build bot
- run db migration check
- deploy selected apps
```

后续增加：

- affected build。
- 单元测试覆盖率门槛。
- 风险规则快照测试。
- API contract test。
- E2E 测试。
- Docker image build。

## 14. 测试策略

### 14.1 risk-core 测试

必须优先测试，因为这是产品可信度核心。

测试内容：

- 卖出失败是否直接禁买。
- Honeypot 命中是否直接禁买。
- 可改税 + 高税是否高危。
- LP 未锁是否正确加权。
- 数据不足是否输出 UNKNOWN。
- 多源数据冲突时如何处理。

### 14.2 data-adapters 测试

测试内容：

- 第三方 API 超时。
- 第三方 API 字段缺失。
- 第三方返回异常格式。
- 缓存命中。
- 标准化输出。

### 14.3 points 测试

测试内容：

- 每日上限。
- 待确认积分。
- 重复行为不重复给分。
- 同一 CA 重复检测不刷分。
- 邀请用户无有效行为不结算。
- 女巫系数打折。

### 14.4 API 测试

测试内容：

- CA 检测接口。
- 报告读取接口。
- 重新检测限流。
- 积分事件写入。
- Telegram webhook。

## 15. 未来扩展

### 15.1 contracts app

短期不需要合约项目。

未来如有以下需求，再增加：

```text
apps/contracts/
```

可能场景：

- SBT Badge。
- 积分凭证。
- 平台币 claim。
- Paymaster。
- Batch revoke helper。
- 链上贡献证明。

第一阶段不应为了未来发币提前写合约。先 off-chain 积分，后面再考虑 snapshot / claim。

### 15.2 Python / ML 服务

V0 不建议引入 Python 服务。

未来如果需要：

- 反女巫聚类。
- 地址关联图谱。
- 高危部署者预测。
- 大规模异常交易检测。

可以增加：

```text
services/risk-ml/
```

但 V0 先用 TypeScript 规则引擎，把产品闭环跑通。

### 15.3 API SDK

未来开放 API 时，可以新增：

```text
packages/sdk/
```

用于：

- 第三方钱包接入。
- 交易工具接入。
- Bot 开发者接入。
- 企业版风控接入。

## 16. Monorepo 风险与约束

### 16.1 避免万能 shared 包

不要创建：

```text
packages/shared
```

然后什么都往里面塞。

正确做法是职责拆清楚：

```text
types 是类型
risk-core 是评分
data-adapters 是数据
report 是文案
points 是积分
chain 是链配置
```

### 16.2 避免循环依赖

错误示例：

```text
risk-core -> report -> risk-core
points -> api -> points
ui -> db -> ui
```

必须用依赖方向和 lint 规则约束。

### 16.3 避免过度拆包

V0 不要拆太细。比如没必要一开始拆成：

```text
risk-score
risk-label
risk-explain
risk-normalizer
risk-merge
```

先放在 `packages/risk-core`。等规则和团队复杂后再拆。

### 16.4 避免所有服务一起发版

Monorepo 不等于 monolith deployment。

必须保持：

- Web 可单独部署。
- API 可单独部署。
- Bot 可单独部署。
- Worker 可单独部署。
- Admin 可单独部署。

## 17. 第一批仓库初始化任务

### 17.1 基础工程

- 初始化 pnpm workspace。
- 初始化 Turborepo。
- 建立 apps/web、apps/api、apps/bot、apps/admin。
- 建立 packages/types、config、db、risk-core、data-adapters、report、points。
- 配置统一 tsconfig。
- 配置 eslint / prettier。
- 配置 CI 基础流程。

### 17.2 V0 业务骨架

- 定义 ChainId、RiskLevel、TokenRiskReport、RiskReason。
- 实现 token 输入解析。
- 实现 GoPlus adapter 雏形。
- 实现 Honeypot adapter 雏形。
- 实现 risk-core v0.1。
- 实现 report 文案模板。
- 实现 `/api/v1/token/check`。
- 实现 `/token/[chain]/[address]` 报告页。
- 实现 Telegram `/check` 基础命令。

### 17.3 数据库

- 初始化 PostgreSQL。
- 建立 users。
- 建立 token_reports。
- 建立 token_risk_snapshots。
- 建立 risk_factors。
- 建立 point_events。
- 建立 referral_events。
- 建立 telegram_groups。

### 17.4 增长与积分

- 生成 referral code。
- 支持 UTM 归因。
- 支持分享报告链接。
- 支持基础积分事件写入。
- 支持 pending / confirmed / rejected 状态。
- 支持重复行为去重。

## 18. 最终决策

项目采用轻量 Monorepo。

最终定稿：

```text
包管理：pnpm workspace
任务编排：Turborepo
主语言：TypeScript
前端：Next.js
后端：Node.js + Fastify/NestJS，V0 偏 Fastify
数据库：PostgreSQL
缓存：Redis
ORM：Prisma 优先
队列：BullMQ 优先
V0 不使用 Nx
V0 不引入 Python 服务
V0 不引入 contracts app
```

核心目标：

> 让 Web DApp、API、Telegram Bot、Admin、风险引擎、积分推广系统共享同一套类型、规则和数据结构，同时保持服务独立部署、模块职责清晰、架构不过度复杂。
