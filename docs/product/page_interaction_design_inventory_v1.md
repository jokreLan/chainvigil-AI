# ChainVigil 页面、交互与设计覆盖台账 v1

> 负责人视角：产品经理 / UI·UX / 开发 / 测试共同使用
> 基线日期：2026-08-06
> 产品语言：中文、英文；未来语言必须沿用同一信息架构
> 目的：先统计完整产品，再逐页设计、开发和验收，避免只设计“好看的主页面”而遗漏真实流程与异常状态。

## 1. 产品界面分层

| 层级      | 定义                                  |                       是否连接钱包 | 主要任务                                    |
| --------- | ------------------------------------- | ---------------------------------: | ------------------------------------------- |
| Website   | 品牌、SEO/GEO、内容、信任、商业化页面 |                                 否 | 获客、教育、建立信任                        |
| Web DApp  | 普通用户完成一次安全任务的聚焦流程    |                             默认否 | 查 CA、查钱包、看结果、看证据、分享只读报告 |
| Workspace | 高级用户持续管理安全任务的工作台      | 只读能力默认否；执行能力按功能确认 | 钱包观察、授权审查、监控、报告、资产整理    |
| Admin     | 内部运营、风控、审核和系统管理        |                           内部认证 | 内容审核、风险标签、积分、渠道、系统配置    |

设计原则：Website、Web DApp、Workspace 共享品牌和组件语义，但不能使用同一种页面结构。Web DApp 不使用 Workspace 的固定侧栏；Workspace 不使用 Website 的营销 Hero。

## 2. 全局交互与状态基线

每个相关页面必须覆盖以下状态，不能只设计默认成功态。

### 2.1 全局状态

- 中文 / 英文切换；英文文案长度增加 30%–40% 时不破版。
- Desktop、Tablet、Mobile；最小宽度 320px。
- 键盘焦点、屏幕阅读器标签、44px 触控目标。
- API 正常、部分降级、全部不可用、数据过期。
- Mock / Demo、Live、Mixed 模式必须可辨认。
- 加载、空数据、校验错误、业务错误、限流、离线、404、500。
- Toast：成功、失败、复制完成、复制权限拒绝。
- 风险等级同时使用图标、文字、颜色，不得只用颜色。
- 所有报告显示检测时间、数据来源、覆盖率和“分数不代表安全保证”。

### 2.2 全局导航

| 端                | 导航要求                                                                        |
| ----------------- | ------------------------------------------------------------------------------- |
| Website Desktop   | 首页、CA 安检、钱包体检、风险情报、学习、价格、开发者、Bot、语言、进入 Web DApp |
| Web DApp Desktop  | CA 安检、钱包体检、授权检查、风险情报、高级工作台、数据源状态、语言             |
| Web DApp Mobile   | 安检、钱包、授权、情报、我的                                                    |
| Workspace Desktop | 总览、钱包、授权、资产整理、监控、报告、VP、推广、设置                          |
| Workspace Mobile  | 总览、钱包、报告、VP；次级模块通过菜单进入                                      |

### 2.3 核心用户旅程

设计稿必须按完整旅程验收，不能只检查单张页面。

| 旅程               | 入口                | 主流程                                          | 关键分支                                   | 完成标准                                 |
| ------------------ | ------------------- | ----------------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| J01 CA 安检        | Website / Web DApp  | 输入 → 识链 → 扫描 → 风险结论 → 证据            | 地址错误、链不支持、单源降级、超时、高风险 | 用户无需连接钱包即可理解结论和下一步     |
| J02 钱包体检       | Web DApp            | 输入公开地址 → 扫描 → 健康报告 → 授权/资产/监控 | 空钱包、未知资产、部分覆盖、高危授权       | 先给优先级，再进入具体处理工具           |
| J03 授权复查       | 钱包报告 / 授权入口 | 筛选 → 查看 spender → 风险原因 → 撤销说明       | 无授权、无限授权、未知合约、网络/Gas 问题  | 清楚区分只读检查、钱包连接和演示交易     |
| J04 Token 分享     | Token 报告          | 隐私预览 → 隐藏地址 → 复制链接/文案 → 分享      | 复制失败、分享取消、Mock/Live/Mixed        | 分享内容不泄露余额和完整地址             |
| J05 周度安全总结   | 监控 / 我的         | 七日时间线 → 隐私设置 → 分享只读卡              | 无数据、部分数据、新增高危、无新增高危     | 不用奖励强迫分享，不使用绝对安全表述     |
| J06 高级工作台承接 | Web DApp 结果       | 添加监控/进入工作台 → 钱包/授权/报告            | 未登录、功能未开放、数据迁移说明           | 普通用户流程结束后再渐进式进入 Workspace |
| J07 资产理发师     | Workspace           | 设置 → 扫描 → 分类 → 建议 → 动作说明            | clean、empty、failed、升级弹层             | 不暗示自动卖出、转账、销毁或隐藏资产     |
| J08 内容获客       | 搜索/社媒           | SEO 页面 → 风险教育 → 工具 CTA → Web DApp       | 无内容、404、来源缺失、Bot 不可用          | 页面能被搜索理解，也能自然转化到检测工具 |

### 2.4 台账规模

- Website：18 个路由/页面。
- Consumer Web DApp：14 个路由、关键屏幕或设计集合。
- Workspace：11 个路由/页面。
- 系统页与共享组件：10 组。
- Admin：10 个路由/页面。
- 当前总计：63 个一级交付项；每项还需按响应式、语言和异常状态展开。

## 3. Website 页面清单

| ID  | 路由 / 页面                              | 用户目标               | 核心交互                                       | 必须设计的状态                    | 优先级 |
| --- | ---------------------------------------- | ---------------------- | ---------------------------------------------- | --------------------------------- | ------ |
| W01 | `/` 首页                                 | 理解产品并开始检测     | 输入 CA、进入钱包体检、查看模块、进入 Web DApp | 默认、API 降级、移动端            | P0     |
| W02 | `/intel` 风险情报中心                    | 进入榜单、数据库和百科 | 选择情报模块、开始检测                         | 默认、空内容                      | P1     |
| W03 | `/risk-database` 风险数据库              | 理解风险分类与数据入口 | 进入榜单、假币库、百科、CA 检测                | 默认、数据更新说明                | P1     |
| W04 | `/leaderboard/high-risk-tokens` 高危榜单 | 浏览高危 Token         | 链筛选、风险筛选、打开报告                     | 加载、空榜单、部分数据、分页/更多 | P1     |
| W05 | `/fake-token-database` 假币数据库        | 识别仿冒 Token         | 查看样例、进入榜单、检测地址                   | 默认、空样例、风险样例            | P1     |
| W06 | `/learn` 风险百科                        | 按主题学习             | 分类导航、精选文章、近期文章、开始检测         | 默认、空分类                      | P1     |
| W07 | `/learn/[slug]` 百科详情                 | 理解风险和处理方法     | 目录、来源外链、FAQ、相关 CTA                  | 长文、表格溢出、来源缺失、404     | P1     |
| W08 | `/solana` Solana 专题                    | 了解 Solana 风险工具   | CA 安检、资产整理、教程入口                    | 默认、移动端                      | P2     |
| W09 | `/bnb` BNB 专题                          | 了解 BNB 风险工具      | CA 安检、授权检查、教程入口                    | 默认、移动端                      | P2     |
| W10 | `/pricing` 价格页                        | 比较免费/会员/群方案   | 选择计划、查看 API、进入产品                   | 当前不可购买、未来购买、FAQ       | P2     |
| W11 | `/developers` 开发者中心                 | 理解 API 能力          | 查看引擎、复制 Quickstart、进入 API/价格       | 默认、代码复制、权限未开放        | P2     |
| W12 | `/api` API 文档页                        | 查看端点和运行状态     | 展开端点、查看 OpenAPI、进入风险库             | API 不可用、配置缺失、移动表格    | P2     |
| W13 | `/bot` Telegram Bot                      | 了解并安装 Bot         | 打开 Telegram、查看命令、查看状态              | Bot 可用、不可用、未配置          | P1     |
| W14 | `/about` 关于                            | 建立产品认知           | 返回产品                                       | 中英文、移动端                    | P2     |
| W15 | `/methodology` 方法论                    | 理解数据与风险分级     | 返回产品、联系纠错                             | 中英文、长内容                    | P1     |
| W16 | `/privacy` 隐私                          | 理解数据处理           | 返回产品、联系                                 | 中英文、长内容                    | P1     |
| W17 | `/terms` 条款                            | 理解责任边界           | 返回产品                                       | 中英文、长内容                    | P1     |
| W18 | `/contact` 联系与纠错                    | 提交纠错/披露信息      | 邮箱 CTA、复制地址                             | 未配置邮箱、提交说明              | P1     |

## 4. Consumer Web DApp 页面与交互清单

这是当前设计缺口的主体。Web DApp 必须形成最小端到端闭环：输入 → 扫描 → 结论 → 证据 → 下一步 → 分享。

| ID  | 路由 / 屏幕                             | 用户目标                 | 核心交互                                                | 必须设计的状态                                                             | 优先级 |
| --- | --------------------------------------- | ------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------- | ------ |
| D01 | Web DApp Launch                         | 选择 CA 或钱包任务       | 输入地址/链接、自动识链、清空、查看最近记录、进入工作台 | 默认、最近记录为空、API 降级                                               | P0     |
| D02 | `/check` CA 安检入口                    | 提交 CA/DEX 链接         | 粘贴、示例填充、自动识链、提交                          | 空、格式错误、链不支持、提交中                                             | P0     |
| D03 | CA 扫描进度                             | 理解系统正在做什么       | 查看阶段、取消、失败重试、后台继续                      | 正常、单源降级、超时、失败、取消                                           | P0     |
| D04 | `/token/[chain]/[address]` Token 报告   | 快速判断风险并查看证据   | 复制地址、重新扫描、展开证据、查看钱包、分享            | LOW、MEDIUM、HIGH、BLOCK、UNKNOWN、Live/Mock/Mixed、数据过期               | P0     |
| D05 | Token 低风险结果变体                    | 理解“未发现高危≠安全”    | 查看证据、添加监控、复制/分享                           | 4/4、部分覆盖、来源冲突                                                    | P0     |
| D06 | Token 高风险结果变体                    | 立即理解危险原因         | 查看 Top 3 原因、完整证据、复制地址、分享警示           | 貔貅、高税、Owner 权限、LP 风险、来源冲突                                  | P0     |
| D07 | Token 分享卡 / OG                       | 在社群传播只读结论       | 预览、隐藏地址、复制链接、复制文案、Telegram、X         | 复制成功/失败、隐私确认、Mock 标记                                         | P0     |
| D08 | `/wallet-check` 钱包体检入口            | 只读检查钱包             | 输入地址、链选择、提交、进入相关工具                    | 空、格式错误、扫描中、失败                                                 | P0     |
| D09 | 钱包扫描进度                            | 理解钱包检测阶段         | 查看计数/步骤、取消、重试                               | 正常、部分覆盖、超时、失败                                                 | P0     |
| D10 | `/wallet/[address]/health` 钱包健康报告 | 查看整体风险和优先处理项 | 查看授权、资产整理、重新检测、分享                      | 健康、需关注、高危、未知、空钱包、Mock/Live/Mixed                          | P0     |
| D11 | `/approvals` Consumer 授权检查          | 查找危险授权             | 排序、筛选、查看详情、复制 spender、形成复查列表        | 无授权、无限授权、未知合约、过期数据                                       | P1     |
| D12 | 撤销授权说明/确认                       | 理解撤销影响             | 勾选已理解、取消、确认演示                              | 未连接钱包、Gas 不足、网络错误、演示完成                                   | P1     |
| D13 | 安全总结 / 周报                         | 查看连续监控成果         | 七日时间线、隐私预览、分享只读卡                        | 无数据、部分数据、高危新增、无新增高危                                     | P1     |
| D14 | Web DApp 组件/状态库                    | 统一实现所有真实状态     | 状态切换和组件对照                                      | loading、invalid、unsupported、no data、degraded、stale、429、500、offline | P0     |

## 5. Workspace 页面与交互清单

| ID  | 路由 / 页面                          | 用户目标                   | 核心交互                                                           | 必须设计的状态                                                                  | 优先级 |
| --- | ------------------------------------ | -------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------ |
| A01 | `/app` 总览                          | 查看需要优先处理的安全事项 | 快捷扫描、打开模块、查看风险队列                                   | Demo、空工作台、降级、移动端                                                    | P0     |
| A02 | `/app/wallets` 钱包中心              | 管理观察地址               | 添加地址、搜索、筛选、打开健康报告、创建监控                       | checked、pending、watching、empty                                               | P0     |
| A03 | `/app/approvals` 授权扫描            | 审查危险授权               | 过滤、查看原因、打开撤销说明                                       | high/medium/low/unknown、empty                                                  | P0     |
| A04 | `/app/approval-cleaner` 授权清理策略 | 理解执行边界               | 查看策略、进入钱包体检                                             | waiting、must-confirm、不可执行                                                 | P1     |
| A05 | `/app/asset-barber` 资产理发师       | 分类钱包资产并查看建议     | 地址输入、链范围、Demo Profile、扫描、结果筛选、动作说明、Pro 预览 | setup、scanning、risk result、clean、empty、failed、action modal、upgrade modal | P1     |
| A06 | `/app/dust` 粉尘扫描                 | 理解粉尘处理策略           | 查看检查项、禁止项、进入资产理发师                                 | 默认、空、不可处理                                                              | P2     |
| A07 | `/app/monitor` 风险监控              | 查看监控规则与信号         | 创建/暂停/恢复规则、查看证据、打开报告                             | watching、needs review、paused、stale、provider conflict                        | P1     |
| A08 | `/app/reports` 报告中心              | 查找历史报告               | 搜索、筛选、打开报告、分享                                         | Token/Wallet、empty、loading、stale                                             | P1     |
| A09 | `/app/points` VP 中心                | 查看积分、任务和权益       | 任务 CTA、兑换预览、查看历史                                       | confirmed、pending、preview、coming soon、active                                | P2     |
| A10 | `/app/growth` 推广中心               | 使用邀请链接和渠道         | 复制链接、查看渠道、进入 Bot/VP                                    | 复制成功/失败、空渠道                                                           | P2     |
| A11 | `/app/settings` 设置                 | 管理语言、提醒、隐私       | 切换语言、查看可编辑项                                             | editable、read-only、保存反馈                                                   | P2     |

## 6. Admin 页面与交互清单

Admin 是独立内部产品，只用于上线、运营、风控和审计。当前 V0 以认证后的只读视图为主；任何未来写操作都必须记录操作人、对象、理由和结果，不能与 Website、Web DApp 或 Workspace 混用导航和权限语义。

| ID  | 路由 / 页面                  | 管理目标                                   | 核心交互                                                         | 必须设计的状态                                          | 优先级 |
| --- | ---------------------------- | ------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------- | ------ |
| N01 | `/` Admin 总览               | 查看运行模式、生产预检和后台模块           | 打开上线清单、数据源、报告、复核、标签、审计、VP、Telegram、渠道 | mock、production、needs review、无权限、移动端          | P0     |
| N02 | `/system-readiness` 系统就绪 | 核对代码侧和周末外部依赖                   | 查看模式、缺失配置名、Provider、Cache、Worker、生产安全警告      | ready、missing、mock、未注册 live client、预检警告      | P0     |
| N03 | `/data-sources` 数据源状态   | 核对 Provider contract 与降级策略          | 查看 adapter、支持链、证据类型、所需环境变量名                   | ready、mock、未配置、部分可用、全部不可用               | P0     |
| N04 | `/reports` Token 报告索引    | 只读查找现有报告                           | 搜索/筛选参考、打开公开报告                                      | mock 索引、空结果、长地址、移动表格、生产查询未开放     | P1     |
| N05 | `/risk-review` 高危 CA 复核  | 审核系统触发、用户举报和群组上报           | 查看报告、信号、来源、状态；未来复核动作预览                     | pending、needs data、escalated、来源缺失、写入关闭      | P0     |
| N06 | `/risk-labels` 风险标签      | 查看 token、deployer、spender、domain 标签 | 搜索/筛选参考、查看证据与置信度；未来新增/修订预览               | active、pending review、retired、写入关闭、证据不足     | P1     |
| N07 | `/audit` 后台审计日志        | 追踪后台敏感操作                           | 按动作/对象/操作人筛选参考、展开脱敏 metadata                    | API、local mock fallback、空日志、长 metadata、加载失败 | P0     |
| N08 | `/points` VP 事件审核        | 查看 VP 账本和审核状态                     | 筛选事件、查看 pending/confirmed/rejected；未来审核预览          | mock ledger、pending、confirmed、rejected、写入关闭     | P1     |
| N09 | `/telegram` Telegram 群组    | 查看群额度、提醒和命令 contract            | 查看群状态、命令、配置参考                                       | mock 群、Bot 未配置、自动检测关闭、限额、写入关闭       | P1     |
| N10 | `/channels` KOL 渠道         | 查看真实转化归因与 VP 状态                 | 筛选渠道、查看有效访问/CA/待确认/已确认                          | active、paused、pending review、空渠道、mock 数据       | P1     |

## 7. 系统级页面与弹层

| ID  | 页面/组件            | 必须覆盖                                                 |
| --- | -------------------- | -------------------------------------------------------- |
| S01 | `loading.tsx`        | 页面骨架、扫描骨架、列表骨架                             |
| S02 | `error.tsx`          | 错误摘要、重试、返回 CA 安检、错误编号                   |
| S03 | `not-found.tsx`      | 404、返回首页、开始检测                                  |
| S04 | API Status Banner    | 服务降级、恢复、关闭提示                                 |
| S05 | Scan Progress        | 正常、降级、失败、重试、取消                             |
| S06 | Wallet Scan Progress | 计数、阶段、失败、重试、取消                             |
| S07 | Share Report         | 复制链接、复制文案、Telegram、X、隐私提示、复制失败      |
| S08 | Revoke Confirm Modal | 钱包、资产、spender、原因、Gas、勾选确认、取消、演示完成 |
| S09 | Toast                | success、error、warning、info                            |
| S10 | Language Switcher    | 中文、英文、当前态、移动端                               |

## 8. 设计覆盖矩阵

状态定义：`DONE` 已有可用设计；`DRAFT` Stitch 已生成但仍需核对；`MISSING` 未设计；`N/A` 不需要独立设计。

| 页面组                             | Desktop | Mobile | 交互状态 | 中英文 | 当前结论                                                                                              |
| ---------------------------------- | ------- | ------ | -------- | ------ | ----------------------------------------------------------------------------------------------------- |
| Website 首页                       | DONE    | DONE   | DONE     | DRAFT  | Desktop/Mobile Final Compliance 权威画板已完成代码还原与 320/390/1440 浏览器复核；完整英文仍需终审   |
| Solana / BNB 专题                  | DONE    | DRAFT  | DONE     | DRAFT  | 两条链 Desktop 已完成品牌与教育样例真实性修订；Mobile 与完整英文待逐屏复核                            |
| Consumer Web DApp 核心流程         | DONE    | DONE   | DONE     | DRAFT  | Desktop/Mobile 核心入口、扫描、报告、钱包和授权已完成真实路由验收；完整英文复杂状态仍需终审           |
| Token 报告与分享                   | DONE    | DRAFT  | DRAFT    | DRAFT  | 高风险、低风险/未知/降级与移动分享参考均已建立；待逐屏验收                                            |
| 钱包体检与钱包报告                 | DRAFT   | DRAFT  | DRAFT    | DRAFT  | Desktop Final Compliance 与 Mobile 输入/扫描/健康报告已建立；待逐屏验收                               |
| Consumer 授权检查                  | DRAFT   | DRAFT  | DRAFT    | DRAFT  | Desktop Final Compliance 与 Mobile 授权/总结/分享参考已建立；待与 Workspace 逐屏区分验收              |
| Workspace 总览/钱包/授权/监控/报告 | DONE    | DONE   | DONE     | DRAFT  | 独立桌面/移动 Workspace 壳与总览、钱包、授权、报告、监控、VP 已完成代码还原；完整双语复杂状态仍需终审 |
| 资产理发师完整状态机               | DONE    | DONE   | DONE     | DRAFT  | 桌面完整状态机与移动关键流程已完成 Final Compliance；完整英文版待逐屏验收                             |
| VP / 推广 / 设置                   | DRAFT   | DRAFT  | DRAFT    | DRAFT  | 7 类桌面/移动/异常/组件画板已建立，VP 与设置完成重点合规修订，推广中心继续做最终像素级复核            |
| 风险数据库/榜单/假币库             | DRAFT   | DRAFT  | DRAFT    | DRAFT  | 8 类桌面/移动/搜索/异常画板已建立并完成关键产品事实修订；完整英文与最终像素级复核待完成               |
| Learn / Trust                      | DRAFT   | DRAFT  | DRAFT    | DRAFT  | 10 个风险百科、文章详情与信任页面画板已建立；待完整英文、320px 与逐屏像素级复核                       |
| Pricing / Developers               | DONE    | DONE   | DONE     | DRAFT  | Desktop/Mobile 权威版已完成定价、路由、品牌、未开放状态及 320/390/768/1440 浏览器复核                 |
| API / Bot                          | DONE    | DONE   | DONE     | DRAFT  | API、Bot 与状态库 Desktop/Mobile Final Compliance 权威版已完成真实路由、未配置和错误状态修订          |
| 全局状态与组件库                   | DRAFT   | DRAFT  | DRAFT    | N/A    | 需要组件级验收                                                                                        |
| Admin                              | DONE    | DONE   | DONE     | DRAFT  | 10 个真实路由已接入独立 Control Room 壳并完成 320/390/768/1440 浏览器终审；完整英文仍待产品决策       |

### 8.1 Consumer Web DApp 当前设计交付快照

Stitch 项目内已建立独立的 `Consumer Security Journey` 页面组，并生成以下 9 类画板：

1. 安检入口 Desktop。
2. 安检入口 Mobile。
3. 扫描中 Desktop。
4. 安检结果：高风险。
5. 安检结果：低风险。
6. 钱包体检结果。
7. Consumer 授权检查。
8. Web DApp 状态库。
9. 安全总结 / 周报分享。

Desktop 核心链路已完成逐屏 `Final Compliance` 修订；Mobile 安检入口也已完成最终合规版。已视觉确认入口、扫描、高风险和低风险画板使用无文字雷达盾牌，并仅展示 GoPlus、Honeypot.is、Solana RPC、BNB Chain RPC。钱包体检、授权检查、状态库和安全总结已生成最终合规版，仍需在下一轮做完整像素级复核；移动端其余流程和完整英文版继续保持 `DRAFT`。

### 8.2 Asset Barber 当前设计交付快照

已向 Stitch 提交独立页面组，覆盖以下 8 类桌面画板与 3 个移动参考画板：

1. Setup / 体检设置。
2. Scanning / 扫描中。
3. Risk Queue / 风险队列。
4. Clean Wallet / 钱包整洁。
5. Empty & First Use / 首次使用。
6. Failed & Partial Coverage / 失败与部分覆盖。
7. Action Review Modal / 操作确认。
8. Upgrade Modal / 升级方案。
9. Mobile Setup、Mobile Risk Queue、Mobile Action Review 参考画板。

该页面组已完成逐屏 `Final Compliance` 验收：仅支持 BNB Chain 与 Solana；数据来源严格限定为 GoPlus、Honeypot.is、Solana RPC、BNB Chain RPC；默认只读，不连接钱包、不签名、不代用户执行撤销、转账、销毁或隐藏资产。涉及外部处理时，只提供证据、网络费用、不可逆风险和可信外部工具说明。完整英文版继续保持 `DRAFT`。

### 8.3 VP、推广与设置当前设计交付快照

Stitch 项目内已建立独立页面组，覆盖以下 7 类画板：

1. VP 中心 Desktop。
2. VP 中心 Mobile。
3. 推广中心 Desktop。
4. 推广中心状态与异常。
5. 设置 Desktop。
6. 设置 Mobile。
7. VP / 推广 / 设置组件状态库。

VP 桌面与移动端已完成重点合规修订：用户身份统一为普通用户与安全贡献者，不再出现节点运营者、在线率、被动任务、内部节点 ID 或财务收益暗示；VP 明确为不可提现、不可转让的产品权益积分，不是代币、投资、收益承诺、治理权或保证现金价值。

设置桌面与移动端已重构为“偏好与隐私 / Preferences & Privacy”：不要求连接钱包，不提供私钥、助记词、管理员、MFA、生物识别或链上执行能力；当前控件均为只读设计参考，通知与保存能力明确标注规划中；本地历史默认不保存，数据保留仅提供不保存、7 天和 30 天参考选项。

推广中心已建立邀请链接、归因指标、渠道、待确认/已确认/已拒绝和复制失败等状态，并要求采用用户主动分享、30 天归因和反作弊审核。最终验收必须继续清理节点、指挥官、固定奖励、收益倍数、内部遥测和虚假账号等措辞；在完成该轮像素级复核前保持 `DRAFT`。

### 8.4 风险数据库、榜单与假币库当前设计交付快照

Stitch 项目内已建立独立的 Website 风险情报页面组，覆盖以下 8 类画板：

1. 风险数据库 Desktop。
2. 风险数据库 Mobile。
3. 高危 CA 样例榜 Desktop。
4. 高危 CA 样例榜 Mobile。
5. 假币对照库 Desktop。
6. 假币对照库 Mobile。
7. 风险情报搜索结果与空状态。
8. 风险情报组件与异常状态库。

该页面组已按现有路由、API contract 与 mock 数据完成关键产品事实修订：风险数据库定位为静态教育目录，不冒充实时黑名单；高危榜只展示 SOL-MOCK、FAKE、MIMIC 三条现有 V0 mock 样例，不制造查询量、举报量、首报人、实时更新时间或热度排名；假币库只展示假 USDT、假 PEPE、假空投 Token/NFT 三类教育模式，不保存或认证官方 CA，也不展示真实官方合约地址。

桌面页面统一采用 Website 顶部导航，不使用 Workspace 固定侧栏；移动端统一采用安检、钱包、授权、情报、我的导航，并高亮情报。所有页面默认只读，不要求连接钱包、不签名、不提供购买或交易入口。用户检查自己的地址时统一引导至 CA 安检重新扫描。

搜索与异常状态已覆盖静态术语命中、CA 识别、无匹配术语、暂无样例、筛选后为空、复制成功、复制权限拒绝、格式错误、不支持的链、部分覆盖、数据过期、429、500、离线和全部来源不可用。数据来源名称严格限定为 GoPlus、Honeypot.is、Solana RPC、BNB Chain RPC。

当前仍保持 `DRAFT`：需继续完成所有画板的完整英文文案、320px 极窄屏、键盘焦点顺序、长文本溢出和最终像素级复核。

### 8.5 风险百科与信任中心当前设计交付快照

Stitch 项目内已建立独立的 Website Learn & Trust 页面组，并在画布中核验以下 10 类画板均已出现：

1. 风险百科 / Learn Desktop。
2. 风险百科 / Learn Mobile。
3. GEO 风险文章详情 Desktop。
4. GEO 风险文章详情 Mobile。
5. 关于 ChainVigil / About Desktop。
6. 风险方法论 / Methodology Desktop。
7. 隐私说明 / Privacy Desktop。
8. 使用条款 / Terms Desktop。
9. 联系与纠错 / Contact & Corrections Desktop。
10. Trust Pages Mobile Reference。

风险百科定位为公开风险教育与自然搜索入口，不在用户界面展示内部 SEO/GEO 运营数量、关键词矩阵或内容生产状态。文章详情统一覆盖面包屑、标题、审核角色、更新时间、可引用定义、风险来源、影响说明、信号表、检查步骤、FAQ、下一步 CTA 与免责声明，并要求来源、审核人和日期均使用真实可确认信息，不制造人物、链接或绝对安全结论。

信任页面严格采用现有产品事实：ChainVigil 提供只读风险教育与筛查，不索取私钥、助记词或签名，不自动交易；方法论仅引用 GoPlus、Honeypot.is、Solana RPC、BNB Chain RPC 和经过人工复核的内部标签，Mock 置信度统一为 `UNASSESSED`；隐私页只描述公开钱包/合约查询、基础访问日志、限流标识和用户反馈等实际可能处理的数据；条款、法域、公司主体、支持邮箱与安全联系人均不得编造，未完成配置或法律审核时必须显示待确认状态。

当前保持 `DRAFT`：已完成页面组存在性和核心产品真实性核验，仍需逐屏检查完整英文、320px 极窄屏、键盘焦点、长文章表格、移动目录与最终像素一致性。

### 8.6 Pricing 与 Developers 当前设计交付快照

Stitch 项目内已建立独立的 Website Pricing & Developers 页面组，并核验以下 5 个画板名称全部存在：

1. 定价 / Pricing Desktop 1440。
2. 定价 / Pricing Mobile 390。
3. 开发者中心 / Developers Desktop 1440。
4. 开发者中心 / Developers Mobile 390。
5. Pricing & Developer States / FAQ Desktop + Mobile Reference。

初始画板保留为过程稿；当前权威版本为 Pricing Desktop Final Compliance、Pricing Mobile Final Compliance、Developers Desktop Final Compliance 和 Developers Mobile Final Compliance。权威版本已统一品牌为 `ChainVigil`，删除配额、发布日期、邀请制 API Key、Ethereum/Arbitrum、GraphQL、虚构响应时间和未确认口号。

定价页严格采用当前产品契约：Free 为 ¥0；Pro 为计划价格范围 ¥19–49/月；Group 为计划价格范围 ¥99–399/月。Pro 与 Group 必须显示“计划方案 / 参考价格区间 / 支付与订阅尚未开放”，不提供购买、结账、虚假优惠或倒计时。VP 只作为不可提现、不可转让的产品内权益积分，不是代币、投资或收益产品；API 商业定价单独标记后续开放。

开发者中心定位为 `Developer Center · V0`，能力范围为 Token Risk API、只读 Wallet Safety / Approval capability preview、Fake Token / Public Risk Intel API。Quickstart 使用真实内部包 `@chainvigil/sdk`、`http://localhost:4000` 和 Solana `checkToken` 示例；接口采用 `POST /api/v1/token/check`、`POST /api/v1/wallet/health`、`GET /api/v1/wallet/check-capabilities`、`GET /api/v1/risk/fake-token-examples` 等现有 REST 路由。当前没有公开商业 API key，不提供 `Get API Key`；公开 API 需在准确性、限流、审计和计费稳定后开放。示例响应必须标记 `SAMPLE / MOCK / UNASSESSED`，不能伪造性能、风险结论或生产可用性。

当前保持 `DRAFT`：页面组和核心事实约束已建立，仍需逐屏检查实际文案、所有不可用 CTA、英文长文本、320px、代码复制、键盘焦点与最终视觉一致性。

### 8.7 API 与 Telegram Bot 当前设计交付快照

Stitch 项目内已建立独立的 Website API & Telegram Bot 页面组，并核验以下 5 个画板名称全部存在：

1. API 文档 / API V0 Desktop 1440。
2. API 文档 / API V0 Mobile 390。
3. Telegram Bot Desktop 1440。
4. Telegram Bot Mobile 390。
5. API & Bot Availability / Error States / Launch Status Desktop + Mobile Reference。

上述 5 个初始画板均已补充同名 `Final Compliance` 权威版本：API Desktop、API Mobile、Bot Desktop、Bot Mobile 和 API & Bot Availability / Error States / Launch Status。旧稿中 `/token/analyze`、`/wallet/approvals`、Bearer Key、固定限流、在线 Bot username、Global Node、uptime 和 latency 等内容已被权威版替代。

API 文档按公开产品接口与系统/管理员内部契约分组，内部管理员接口不得成为公开产品 CTA。权威版使用现有路由 `POST /api/v1/token/check`、`GET /api/v1/token/:chain/:address`、`POST /api/v1/wallet/health`、`GET /api/v1/wallet/check-capabilities`、`GET /api/v1/risk/fake-token-examples`、`GET /api/v1/risk/evidence-providers`、`GET /api/v1/meta` 和 `GET /api/v1/system/readiness`。OpenAPI 仅为 `http://localhost:4000/openapi.json` 本地能力；示例响应统一为 `ILLUSTRATIVE SAMPLE / NOT LIVE DATA`，不伪造真实风险分数、代币余额、性能或生产认证。

Telegram Bot 仅展示 `/start`、`/help`、`/check <CA>`、`/top`、`/settings` 五个现有命令；支持范围为 SOL 与 BNB。V0 结果可能为 Mock 或降级，只提供只读风险辅助，不自动交易、不自动签名。Bot username 和 Telegram 链接可能未配置；未配置时 CTA 必须禁用，不得编造用户名。Webhook 只显示 `TELEGRAM_WEBHOOK_SECRET` 配置名，不展示真实值；群主、分成和商业化统一标记计划中。

异常与上线状态参考覆盖 OpenAPI unavailable、复制成功/失败、429、公开认证未开放、配置缺失、Bot 未配置、Telegram link unavailable、Mock/降级、空状态、404、500、重试和返回文档，并以“当前可用 / 计划中 / 需配置 / 不提供”矩阵明确当前产品边界。

核心产品事实与代表性视觉验收已完成；`DRAFT` 仅保留给完整英文、320px、代码区键盘交互、焦点顺序和最终像素一致性。

### 8.8 Admin 当前设计交付快照

Stitch 项目内已建立独立的内部 ChainVigil Admin 页面组，覆盖 10 个真实后台路由，并额外补齐移动导航和系统状态，共核验以下 12 个画板名称全部存在：

1. Admin Control Room / 后台总览 Desktop。
2. System Readiness / 系统就绪 Desktop。
3. Data Sources / 数据源状态 Desktop。
4. Token Reports / 报告索引 Desktop。
5. Risk Review Queue / 高危 CA 复核 Desktop。
6. Risk Labels / 风险标签 Desktop。
7. Audit Trail / 后台审计日志 Desktop。
8. VP Events / VP 事件审核 Desktop。
9. Telegram Operations / 群组管理 Desktop。
10. Growth Channels / KOL 渠道 Desktop。
11. Admin Mobile Navigation & Dashboard Mobile 390/320 Reference。
12. Admin Auth / Empty / Error / Write-disabled States Desktop + Mobile Reference。

`Admin Control Room / 后台总览 (Desktop 1440) (Final Compliance)` 已作为总览权威版：删除 85% 系统健康、4/4 Online、固定延迟、网络曲线、队列数量和 LIVE 时间，改用 `CHECK CONFIG`、`MOCK FALLBACK`、`WRITE DISABLED`、`UNCONFIGURED`、`NOT VERIFIED` 和 `MEMORY MOCK` 等非数字状态。其他 Admin 路由继续以初始画板为设计覆盖，仍需同标准逐屏抽检。

Admin 与 Website、Consumer DApp、Workspace 使用独立的信息架构和权限语义。当前 V0 是 Basic Auth 保护后的只读运营视图，生产写操作关闭；任何未来人工修正必须记录 `actor`、`target`、`reason` 和 `result`。设计不得展示密钥值、环境变量值、真实用户、真实客户、真实举报量或虚构 SLA；认证状态只覆盖浏览器/反代 Basic Auth 的 401、403 和认证失效，不发明注册、找回密码或普通用户账号体系。

系统就绪页分开显示代码侧上线项与周末外部依赖，仅展示缺失配置名称；数据源页只展示 adapter contract、ready/mock、支持链、证据类型和降级策略，不因配置存在就声称真实扫描已完成。报告、复核、标签、VP、Telegram 和渠道页均必须显著标记 Mock/只读/写入关闭；审计页支持 API 只读日志和 local mock fallback，并对 metadata 脱敏。

状态参考覆盖 loading、empty、mock fallback、partial unavailable、401、403、429、500、offline、long metadata、copy failed、write disabled 和缺少复核理由。移动端使用内部控制台顶部品牌与模块抽屉，不复用普通 DApp 底部导航；复杂表格转卡片或可控横向滚动。

当前保持 `DRAFT`：后台 12 画板和权限/只读边界已建立，仍需逐屏检查实际数据字段、Mock 标记、英文长文本、320px、键盘焦点、表格/抽屉交互和最终像素一致性。

### 8.9 Website 首页与链专题当前设计交付快照

Stitch 项目内已建立独立的 Website Home & Chain Guides 最终页面组，并核验以下 6 个画板名称全部存在：

1. ChainVigil Website Home Desktop 1440 Final。
2. ChainVigil Website Home Mobile 390 Final。
3. Solana Risk Guide Desktop 1440。
4. Solana Risk Guide Mobile 390。
5. BNB Risk Guide Desktop 1440。
6. BNB Risk Guide Mobile 390。

首页已补充 `ChainVigil Website Home (Desktop 1440) (Final Compliance)` 与 `ChainVigil Website Home (Mobile 390) (Final Compliance)` 权威版；原桌面/移动过程稿被替代。权威版已删除实时链上验证、mempool 扫描、近期扫描时间、系统在线、latency/mainnet 和 VP 解锁高级 API 等未确认内容。Solana 与 BNB Desktop 已原位增加 `EDUCATIONAL REFERENCE / MOCK-READINESS / NOT REAL-TIME`，并统一品牌为 `ChainVigil`。

Website 首页与 Web DApp、Workspace 使用不同信息架构：桌面采用公开站顶部导航，移动采用简洁顶部栏、菜单和聚焦的 CA 安检 CTA，不使用 Workspace 固定侧栏。首页默认只读，支持 CA 或 DEX 链接输入和钱包公开地址体检入口，不要求连接钱包、不签名、不交易。高危卡只作为明确标记的 Mock/教育示例，不冒充实时告警；VP 卡继续使用不可提现、不可转让、非代币/投资/收益产品的统一说明。

Solana 专题只覆盖 Mint/Freeze Authority、流动性可验证性、Top-10 集中度等现有教育范围；次级入口为资产理发师租金/空账户演示和 SOL 租金科普。BNB 专题覆盖买卖/高税、Owner/黑名单权限和 LP 锁定/集中度；次级入口为授权只读检查、外部处理安全说明和貔貅科普。两条链都明确 V0 报告可能为 Mock/降级，不连接钱包、不签名、不发起 swap、Revoke 或广播交易，不构成投资建议。

当前状态：Website 首页、Solana 与 BNB 的桌面/移动真实路由、核心事实边界、中英文、320px、390px、1440px、导航、来源状态、44px 触控目标和浏览器控制台验收标记为 `DONE`；真机软键盘、系统字体差异与屏幕阅读器完整走查继续纳入周末外部验收。

### 8.10 Consumer Web DApp 移动端补全快照

Stitch 项目内已建立独立的 Consumer Mobile Completion 页面组。首轮批次生成了 5 个完整画板并遗漏 Wallet Health；随后已单独补齐缺失页面，并增加响应式与交互状态终审参考，最终核验以下 8 类移动画板全部存在：

1. CA Scan Progress Mobile。
2. Token Report High Risk Mobile。
3. Token Report Low / Unknown / Degraded Reference Mobile。
4. Wallet Check & Scan Progress Mobile。
5. Wallet Health Report Mobile 390。
6. Consumer Approvals & Safety Summary / Share Reference Mobile。
7. Consumer DApp 320px Responsive Stress Reference。
8. Consumer Mobile Interaction State Library 390。

移动流程继续使用一次任务型 Consumer DApp 信息架构，不使用 Workspace 固定侧栏。底部导航为 Scan、Reports、Wallet、Monitor、Profile；Token 检查支持 Solana 与 BNB Chain，钱包体检当前仅为 BNB Smart Chain 只读地址分析。数据来源只使用 GoPlus、Honeypot.is、Solana RPC、BNB Chain RPC。时间、覆盖率和来源成功数只有在真实可验证时才能展示；否则统一使用 `MOCK / SAMPLE / READINESS / DEGRADED / UNASSESSED`，禁止用 `LIVE`、计时器、延迟或近期更新时间制造实时感。

移动端 6 类终审画板已完成逐屏视觉确认。`CA Scan Progress (Mobile 390) (Final Compliance)` 与 `Wallet Check & Scan Progress (Mobile 390) (Final Compliance)` 已从 1800px 以上的网页长页重建为 `390 × 884` 单栏移动工作台，删除营销页脚、重复品牌区、LIVE、计时器、延迟、在线节点和危险终端措辞，保留不确定进度、Provider 配置状态、降级/重试与只读安全边界。`Token Report Low / Unknown / Degraded Reference (Mobile 390) (Final Compliance)` 已确认包含 Low Risk Sample、Unassessed、Degraded 三类参考状态，并将页头统一为 `REPORT STATES`。`Token Report High Risk`、`Wallet Health Report` 与 `Consumer Approvals & Safety Summary / Share Reference` 均已完成品牌、证据来源、Mock/Readiness、只读操作和五栏底部导航终审；旧的桌面侧栏版和超长过程稿仅作为历史草稿，不再作为开发依据。

移动状态覆盖扫描阶段、单源降级、取消、后台继续、超时、失败重试；Token 的 BLOCK/HIGH、LOW、UNKNOWN、部分覆盖、来源冲突和过期；钱包的健康、需关注、高危、UNKNOWN、空钱包、危险授权和未知资产；授权与总结/分享的无授权、无限授权、未知 spender、隐私预览、隐藏地址、复制成功/失败、分享取消和 Mock 标记。所有链上处理只提供说明和可信工具入口，不代用户撤销、转账、销毁或隐藏资产。

#### 8.10.1 移动端统一视觉与交互基线

- 画板基准为 `390 × 844`，同时必须验证 `320px`；内容宽度使用 16px 安全边距，底部固定操作区必须计入系统安全区。
- 使用深黑背景、石墨灰分层卡片、ChainVigil 青绿色主色；红色只表达高风险证据，黄色表达未知/降级，绿色表达低风险或已验证状态，禁止整屏霓虹和无意义发光。
- 顶部统一为 `ChainVigil`、页面标题、链标识和明确的 `MOCK / SAMPLE / READINESS / DEGRADED / UNASSESSED` 状态；不得出现 `ChainVigil AI`、`LIVE`、节点在线、延迟、倒计时或虚构更新时间。
- Token 报告底部导航激活 `Reports`；钱包体检和授权报告激活 `Wallet`。导航固定为 Scan、Reports、Wallet、Monitor、Profile。
- 首屏只保留一个结论、一个解释和一个主操作；来源证据、技术字段、免责声明使用渐进披露，避免把移动端做成缩小版后台表格。
- 所有地址默认中间省略并支持复制；复制成功、复制失败、分享取消、离线和重试必须有非阻塞反馈。任何分享预览默认隐藏完整地址。

#### 8.10.2 Token Report High Risk 权威版验收

权威画板命名为 `Token Report High Risk (Mobile 390) (Final Compliance)`。首屏采用红色风险摘要卡，但结论必须为“Mock/readiness report detected high-risk signals”，不能直接宣判诈骗或保证损失。风险摘要下展示 SOL/BNB 链标识、截断 CA、报告状态和“非投资建议”。

证据区只允许展示 GoPlus、Honeypot.is、Solana RPC、BNB Chain RPC，并为每个来源显示 `AVAILABLE / UNCONFIGURED / DEGRADED / CONFLICT / NOT APPLICABLE`。风险卡使用证据标题、影响说明、来源和置信边界；没有真实响应时使用 Sample 字段，不展示虚构余额、价格、利润、准确率、风险数量或来源成功率。

主操作为“View evidence”，次操作为“Copy CA”和“Rescan”；可提供“Open trusted external tool”说明，但必须先展示域名、网络费用、不可逆风险和离开 ChainVigil 提示。禁止 Buy、Sell、Swap、Connect Wallet、Sign、Approve、Revoke 或自动处理。分享与 VP 只能显示计划中/待确认状态，并说明 VP 不可提现、不可转让、不是代币、投资或收益产品。

#### 8.10.3 Wallet Health Report 权威版验收

权威画板命名为 `Wallet Health Report (Mobile 390) (Final Compliance)`。当前 V0 只允许 `BNB Smart Chain · Read-only address analysis`，不得出现 Solana、Ethereum、Base 等网络切换，也不得暗示连接钱包、签名或读取私钥。

首屏展示截断公开地址、`MOCK / READINESS / DEGRADED / UNASSESSED` 状态和总体结论：Healthy、Needs review、High-risk signals 或 Unable to assess。所有风险数字、资产数量、授权数量和余额必须来自真实返回；没有真实数据时改用 Empty、Unknown 或 Sample，不得显示“4/4 sources”“实时扫描”等装饰性指标。

内容按“可疑 Token”“授权暴露”“未知资产”“数据覆盖”四个可折叠分组组织；授权只做只读证据摘要，并明确跳转 Consumer Approvals 查看详情。允许操作为“View evidence”“Check approvals”“Copy address”“Rescan”；禁止一键撤销、自动清理、隐藏资产、转账和交易。

#### 8.10.4 Consumer Approvals、Safety Summary 与分享权威版验收

权威画板命名为 `Consumer Approvals & Safety Summary / Share Reference (Mobile 390) (Final Compliance)`。页面只覆盖 BNB Smart Chain 公开地址授权查询，顶部固定标注 `READ-ONLY`。授权条目必须包含 Token、截断 spender、Allowance 状态、证据来源和 `KNOWN / UNKNOWN / UNVERIFIED` 标签；支持 No approvals、Infinite allowance、Unknown spender、Provider unavailable、Partial coverage 和 Empty wallet。

页面不得提供直接 Revoke。对于危险或无限授权，仅提供解释、复制合约地址、查看证据和可信外部工具入口；跳转前显示目标域名、需自行连接钱包/签名、可能产生网络费以及 ChainVigil 不代用户执行操作。

Safety Summary 使用可分享的单卡结构：风险结论、覆盖状态、最多三条关键证据、生成类型 `MOCK / SAMPLE / VERIFIED RESPONSE` 和隐私开关。默认隐藏完整钱包地址、Token 余额、资产明细和内部标识；用户主动选择后才能显示更多。分享流程必须包含预览、复制成功/失败、系统分享取消和重试状态，不自动发布。VP 奖励继续标记 Pending/Planned，并使用统一非金融声明。

第二阶段已新增 `Consumer DApp 320px Responsive Stress Reference (Final Compliance)`：Stitch 固定保留 `390px` 外画板，内部按 `320px` 内容约束展示 16px 安全边距、长英文自动换行、长地址中间省略、44px 点击目标、键盘焦点环、底部粘性操作区与 iOS safe area，禁止横向滚动。另新增 `Consumer Mobile Interaction State Library (390) (Final Compliance)`，覆盖 loading、empty、offline、Provider unavailable、partial coverage、429、500、复制成功/失败、分享预览、分享取消/重试、focus、pressed、disabled、loading 与只读破坏性操作边界。

当前状态：6 类 `390px` 权威业务画板以及 320px 压力测试、移动交互状态库的结构与事实边界标记为 `DONE`。真实 Web DApp 路由已完成 320px / 390px 浏览器响应式、横向溢出、导航激活态、键盘焦点环、复制 Toast 与基础语义验收；真实 iOS / Android 系统分享回调、屏幕阅读器完整走查和触摸设备安全区仍纳入周末外部验收。

开发同步（2026-08-07）：Web 实现已先完成一轮上线风险收敛。品牌在 UI、SEO、Open Graph、Manifest、Trust、Learn 与分享测试中统一为 `ChainVigil`；Token 报告移除 `ChainVigil AI` 结论和 Mock 生成时间；报告模式不再展示数值 confidence score；钱包健康 Mock 页移除伪精确生成时间和健康分首屏，改为 `MOCK / READINESS` 与 BNB-only 只读边界；Consumer Approvals 已移除直接“撤销演示”入口，改为复制 spender 和安全处理说明。该轮已通过 Web TypeScript、25 项测试与 Next.js 生产构建。

第二轮开发同步（2026-08-07）：资产理发师已删除 Mock 钱包连接入口，仅接受公开演示地址；Workspace 监控不再把 Mock `lastSignalAt` 显示为实时事件；Learn 的 `live` 发布状态改为 `available`，避免与链上实时数据混淆；Admin 首页、系统就绪、风险审核、渠道、Telegram 与风险标签已统一使用 `MOCK FALLBACK / READ-ONLY / Sample` 边界，并将 Live client 数量明确为代码实现注册数而非在线数或可用率。Web、Admin 和全仓 17 packages 的类型检查、测试、静态 launch check 与生产构建均已通过。

上线安全同步（2026-08-07）：生产依赖审计初始发现 10 个高危与 6 个中危漏洞，已升级 Next.js、PostCSS、Sharp、`fast-uri` 与 `find-my-way`，复核结果为 `0 known vulnerabilities`。升级后全仓 `51/51` typecheck/test/build tasks 通过；Web 使用独立本地端口完成 Web/Admin/API/Bot 运行态 `smoke:v0`，64 项检查全部通过。

第三轮开发同步（2026-08-10）：Consumer Web DApp 移动端终审规范已落到真实路由。新增 Scan、Reports、Wallet、Monitor、Profile 五栏导航和统一 Provider Coverage；Token 报告固定操作区改为移动端 `2 × 2` 网格并适配系统安全区；分享流程补齐默认隐藏地址的隐私预览、系统分享、取消与不可用反馈；钱包健康、Token Mock 与 Consumer Approvals 删除伪精确分数、数量、税率和来源成功率，统一使用 `SAMPLE / UNKNOWN / UNASSESSED / DEGRADED` 等可验证状态；Consumer Approvals 不提供直接 Revoke，只保留证据、复制与安全处理说明。报告、风险核心、数据适配器、API、Telegram、SDK 和共享类型中的旧品牌已统一为 `ChainVigil`。

真实路由验收（2026-08-10）：在 320px 对 Token 报告、钱包健康和 Consumer Approvals 完成浏览器渲染检查，均无横向溢出；报告固定操作区与五栏导航无重叠，Reports / Wallet 激活态正确；授权页无风险分和直接 Revoke；隐私预览默认隐藏地址，复制反馈可见；键盘焦点环为可见状态，控制台无错误或警告。390px 复核同样未发现横向溢出。全仓 `typecheck`、`test` 均为 `29/29` tasks 通过，生产构建为 `17/17` tasks 通过；`launch:check`、Prisma schema 校验和生产依赖审计均通过，生产依赖为 `0 known vulnerabilities`。

#### 8.10.5 全项目 1:1 还原实施状态

实施原则：Stitch 中标记为 `Final Compliance` 的画板提供视觉结构、字体、色彩、间距和组件形态；页面交互台账与真实代码契约提供产品事实。对于旧画板中的 `4/4 LIVE`、虚构分数、在线节点、随机计数、直接 Revoke 等已确认错误，不复制错误内容，而是保留同等视觉层级并替换为 `MOCK / READINESS / SAMPLE / UNASSESSED / DEGRADED` 等真实状态。新旧终审画板冲突时，以最近确认的五栏导航、只读边界和本台账为准。

第一实施批次（2026-08-10）已完成 Consumer Web DApp P0 视觉基座和核心路由：

1. `/check` CA 安检入口。
2. CA 扫描中、失败、重试状态。
3. `/token/[chain]/[address]` Token 报告首屏、证据、Provider、分享与移动固定操作区。
4. `/wallet-check` 钱包体检入口。
5. 钱包扫描中、失败、重试状态；删除随机 spender 数量和伪进度百分比。
6. `/wallet/[address]/health` 钱包健康报告。
7. `/approvals` Consumer 授权检查与安全总结。

共享实现包括 Stitch 青色/石墨 DApp Design Tokens、Space Grotesk / Inter / IBM Plex Mono / Noto Sans SC 字体体系、统一 DApp Header、Vigil Core 雷达盾牌、五栏移动导航、Provider Coverage、44px 触摸目标、系统安全区和本地化路由页脚隔离。权威 Vigil Core 图形已作为本地静态资产纳入 Web 构建，不依赖 Stitch 临时下载地址。

本批次已在 320px、390px、1440px 对上述 5 个真实路由完成浏览器渲染复核：无横向溢出，Consumer 路由不再混入 Website 法务页脚，移动可见交互目标不低于 44px，控制台无错误。Web 类型检查通过，29 项测试通过，57 个页面生产构建通过。

第二实施批次（2026-08-10）已完成 Website 首页与链专题的真实路由还原：

1. `/` Website 首页桌面 1440 与移动 390/320 编排。
2. `/solana` Solana 风险教育桌面与移动行动手册。
3. `/bnb` BNB 风险情报桌面与移动风险指南。
4. 新增 Website 专用 Header、移动菜单、Footer、字体/网格/面板/扫描线视觉容器，与 Consumer DApp、Workspace 信息架构分离。
5. 首页补齐只读 CA 输入、支持网络、公开地址钱包体检、Mock 风险教育样例、VP 非金融政策、功能入口和 Provider 配置矩阵。
6. Solana 补齐 Mint/Freeze、LP 可验证性、Top-10 教育范围、资产理发师/租金科普和 FAQ；BNB 补齐税率、Owner 权限、LP、只读授权说明、貔貅结构与 FAQ。

本批次未复制 Stitch 过程稿中的实时区块高度、延迟、24 小时扫描量、精确锁仓比例、直接 `REVOKE ACCESS` 或 System Operational 等不可验证内容；对应视觉层级替换为 `RULE MAPPED / PROVIDER DEPENDENT / SAMPLE / NO LIVE CLAIM / NO REVOKE / NO SIGN`。同时修复全局链接颜色覆盖 Tailwind 工具类的问题，恢复浅色主按钮的文字对比度。

真实浏览器已对 `/en`、`/zh`、`/en|zh/solana`、`/en|zh/bnb` 执行 320px、390px、1440px 验收：中英文标题与 `html lang` 正确，Website 导航激活态正确，无横向溢出，320px 可见交互目标不低于 44px，控制台无错误。Web TypeScript、30 项测试、57 页面生产构建与 `git diff --check` 通过。

第三实施批次（2026-08-10）已完成 Workspace 视觉壳和首轮真实路由还原。`/app`、`/app/wallets`、`/app/reports`、`/app/monitor`、`/app/points`、`/app/growth`、`/app/settings`、`/app/dust`、`/app/approval-cleaner`、`/app/asset-barber` 已统一接入独立 Workspace 桌面 Header、移动模块抽屉和总览/钱包/报告/贡献四栏底部导航。桌面导航具备对应路由激活态；移动端 Approvals、Monitor、Asset Barber、Growth、Settings 从模块抽屉进入，次级页面不伪造主导航激活态。

Workspace 总览已按终审画板重排优先事项、快速审计、Provider Coverage 和模块矩阵，删除虚构队列数量；钱包明确为公开地址 Mock watchlist；报告移除伪风险分并标记 Sample/read-only；监控标记为 Mock rule library 而非实时告警。旧画板中的 `ChainVigil AI`、节点 Synced、`28m ago`、ETH 监控和直接 Revoke 仅作为视觉参考，不进入事实层。`summary` 已纳入统一键盘焦点环契约。

真实浏览器已对 Workspace 核心路由执行 320px、390px、1440px 复核，并对次级模块执行 320px、1440px 复核：无横向溢出，桌面/移动导航激活态和模块抽屉正确，移动可见交互目标不低于 44px，中文 `html lang` 正确。Web TypeScript、31 项测试、57 页面生产构建、静态 launch check 与 `git diff --check` 通过。完整屏幕阅读器、真机安全区与软键盘仍进入周末外部终审。

第四实施批次（2026-08-10）已完成风险情报、Learn 与 Trust 公开内容页的统一视觉壳：`/intel`、`/risk-database`、`/leaderboard/high-risk-tokens`、`/fake-token-database`、`/learn`、`/learn/[slug]` 统一使用 Website Header、Website Footer 和独立风险情报二级导航，不再混用旧 SiteHeader、Consumer/Workspace 移动底栏或假币库桌面侧栏。高危榜单删除伪精确风险分展示，统一为明确的 Sample evidence 标签；Learn 长尾矩阵与 GEO 文章改为宽屏响应式卡片和结构化长内容布局。

About、Methodology、Privacy、Terms、Contact 已接入同一 Trust Center 视觉体系，并补齐此前 Footer 指向但真实路由缺失的 `/risk-disclosure` 中英文页面、Canonical/Hreflang 动态元数据和 Sitemap 收录。全局 TrustFooter 已对这些使用 WebsiteFooter 的页面关闭，避免双重页脚。该批次已通过 Web TypeScript、32 项测试、58 页面生产构建、静态 launch check 与 `git diff --check`；320/390/768/1440 浏览器像素复核、长表格、英文长文本和屏幕阅读器仍在后续终审中完成。

第五实施批次（2026-08-10）已完成 Pricing、Developers、API 与 Telegram Bot 的公开转化页代码还原。四个页面统一使用 Website Header、Website Footer 和 Pricing/Developers/API/Bot 二级导航，删除旧 SiteHeader 与 Consumer 移动底栏。Pricing 改为全球化定价预览：Free 显示 `$0 / ¥0`，Pro 与群商业版在支付、地区价格和税费发布前只显示 `TBD / 待定` 与 `NO CHECKOUT / NOT FOR SALE`，不再用未确认人民币区间制造可购买感。

Developers Quickstart 删除硬编码 localhost，改用 `CHAINVIGIL_API_URL`，并补齐可访问的复制反馈；API 文档入口改为读取 `NEXT_PUBLIC_API_BASE_URL`，未配置时明确显示不可用状态，不再跳转用户本机地址；Bot 继续按 `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` 配置门控，未配置时不提供虚假打开入口。该批次已通过 Web TypeScript、33 项测试、58 页面生产构建、静态 launch check 与 `git diff --check`。

第六实施批次（2026-08-10）已完成 Admin 控制台视觉基座和 Consumer/Workspace 授权信息架构拆分。Admin 10 个真实路由统一接入独立 Control Room 壳：桌面固定侧栏、移动模块抽屉、路由激活态、`READ-ONLY / MOCK READINESS / WRITE DISABLED` 状态栏、320px 最小宽度与统一键盘焦点；总览、系统就绪、数据源、人工复核、报告、风险标签、审计、VP、渠道和 Telegram 页面统一使用 Admin 页面、标题与面板契约。人工复核和风险标签移除样例精确 score/confidence 展示，保留 Sample label 与 Unverified 边界。

授权路径已按产品职责拆开：Consumer DApp 使用新的 `/approvals` 一次性只读检查路由，并设置 `noindex`；Workspace 使用 `/app/approvals` 持续观察视图，接入 Workspace Header、四栏移动导航、Mock watchlist、Provider Coverage、公开地址与处理策略入口。Consumer 的 DappHeader、钱包健康、链专题和 GEO 文章 CTA 已全部迁移到 `/approvals`，Workspace 总览与模块抽屉继续指向 `/app/approvals`，不再让两种产品共用同一页面壳。

该批次已通过 Admin/Web TypeScript、Admin 8 项测试、Web 33 项测试、Admin 12 页面与 Web 59 页面生产构建以及 `git diff --check`。当时未完成范围为：Workspace/Consumer 授权空态、Provider 失败和长列表等复杂状态；Admin 与公开页面的 320/390/768/1440 浏览器像素终审；全项目双语、交互状态、截图差异、屏幕阅读器和真机验收。在这些终审完成前，不得宣称整个项目已 1:1 还原。

第七实施批次（2026-08-10）已完成 Web 与 Admin 响应式终审和 Admin 样式构建链修复。Admin 补齐 `@tailwindcss/postcss` 配置，恢复页面中网格、间距、字号、颜色、边框和响应式工具类的生产输出；风险复核、风险标签、审计日志、报告表格和系统就绪页的长地址、长配置名、JSON metadata 均改为可控换行或容器内滚动。Admin 移动模块抽屉已实测打开、路由跳转和自动收起，10 个菜单项均满足 44px 触控高度。

Web 侧修复 Workspace 授权页卡片最小宽度、桌面导航临界断点、Learn/Pricing 文字操作触控尺寸及 Bot 未配置长文案换行。移除 Web/Admin `body` 的固定 320px 最小宽度，避免经典滚动条环境在 320px 视口产生二次横向滚动。

真实生产构建已对 18 个代表路由执行 320、390、768、1440 四档共 72 个浏览器组合检查，结果为 `72/72`：根级横向溢出为零，抽检关键操作目标均不小于 44px。Admin 移动风险复核与 Workspace 授权桌面页已完成最终截图核对。剩余范围仅包括未实现的复杂业务状态、完整英文长文本、屏幕阅读器、真机软键盘/安全区和接入真实 Provider 后的数据验收；因此仍不宣称全项目已经完成绝对像素级 1:1。

第八实施批次（2026-08-10）已完成基础无障碍与授权空态终审。Web 与 Admin 全局增加“跳到主要内容”入口和可聚焦目标，并支持 `prefers-reduced-motion`；错误页按钮补齐明确 `type`。Admin 10 个路由全部使用独立页面标题，报告表格增加只读数据说明 caption，不再让屏幕阅读器和浏览器历史只能识别统一的 `ChainVigil Admin`。

Consumer `/approvals?state=empty` 与 Workspace `/app/approvals?state=empty` 增加确定性中英文空态，明确“空结果不等于零风险”，并引导用户先核对 Provider Coverage。两类空态已在 320、390、1440px 验证无横向溢出、单一 `main`/`h1` 和正确语言标记。

新增共享弹窗焦点管理：打开后进入弹窗、Tab/Shift+Tab 不逃逸、Escape 关闭、背景滚动锁定、关闭后恢复原触发按钮。资产理发师弹窗已通过真实键盘交互验证；公开地址输入补齐显式 `label`、错误关联和地址输入属性。24 个代表路由的稳定页面状态完成基础语义扫描，未发现无名称控件、缺失图片替代文本或重复 ID。VoiceOver / TalkBack 真机朗读顺序仍属于周末外部验收，不能由桌面 DOM 扫描替代。

### 8.11 Workspace 移动端补全快照

Stitch 项目内已建立独立的 Workspace Mobile Completion 页面组。首轮批次落盘 4 个页面并遗漏报告/导航/状态库，随后已单独补齐缺失画板，最终核验以下 5 类移动设计全部存在：

1. Workspace Overview Mobile。
2. Wallet Center Mobile。
3. Workspace Approvals Mobile。
4. Risk Monitor Mobile。
5. Reports, Navigation & Workspace State Library Mobile Reference。

Workspace 移动端继续服务高级用户的持续安全管理，与 Consumer DApp 一次任务流程区分。主导航为总览、钱包、报告、VP；授权、监控、资产理发师、推广和设置通过模块菜单进入。所有观察地址、授权、监控和报告能力默认只读，不把“添加钱包”解释为钱包连接，不自动撤销、转账、交易或签名。

移动状态覆盖 Demo、空工作台、降级；钱包的 checked、pending、watching、empty；授权的 high/medium/low/unknown、无限授权、无授权和过期；监控的 watching、needs review、paused、stale、provider conflict；报告的 Token/Wallet、empty、loading、stale；以及模块抽屉、语言、toast、offline、429、500、复制失败、全部来源不可用和功能未开放。

当前实现结论：Workspace 移动壳、核心路由、320px/390px 响应式、44px 触控目标、底部安全区、模块抽屉、键盘焦点契约、授权专属视图和确定性授权空态已完成代码验收；Provider 失败/长列表、完整英文长文本、VoiceOver/TalkBack 和真机安全区仍保持 `DRAFT`。

## 9. UI/UX 设计交付规则

每个页面交付必须同时包含：

1. 页面目标与主用户任务。
2. Desktop 和 Mobile。
3. 默认、加载、空、错误、降级和成功状态。
4. 所有可点击控件的 hover、focus、disabled、pressed 状态。
5. 中文与英文真实文案样例。
6. 风险等级和数据来源说明。
7. 页面进入路径、退出路径和下一步 CTA。
8. 是否需要钱包连接、签名或交易；默认只读必须明确。
9. 隐私、分享和 Mock/Live 边界。
10. 对应真实路由与开发组件，不能只输出概念图。

## 10. 验收流程

```text
产品经理确认页面台账
→ UI/UX 逐页生成
→ 产品经理核对用户任务与文案
→ 开发核对可实现性和现有组件
→ 测试核对状态覆盖与交互路径
→ 中英文与响应式验收
→ 才能标记 DONE
```

任何新页面或新交互都必须先加入本台账，再进入设计和开发，禁止绕过覆盖矩阵直接生成孤立设计稿。
