# ChainVigil AI｜推进任务板（OPC 总控）

> 战略见 `docs/strategy/MASTER_CONTROL.md`。完成一项勾一项；阻塞写 `BLOCKERS.md`。

## S0 可信骨架 / 上线代码就绪

- [x] 安全 P0（鉴权 / CORS / Webhook / 限流 / mode+confidence）
- [x] 总控、GTM 90 天、VP 第二引擎、运维手册
- [x] 首页 / VP 中心 / Bot 文案对齐定位
- [x] VP 可兑换权益目录 contract
- [x] 真检测编排骨架（live path interface）
- [x] 报告/钱包 mode 条组件 + 分享前缀
- [x] Bot → API 优先、失败降级 local-mock
- [x] 定价页对齐 Free/Pro/群版 + VP 抵扣
- [x] `pnpm launch:check` + `.env.production.example` + launch checklist
- [x] 全仓 typecheck / test / build 通过
- [x] Admin 就绪页含代码侧 + 周末上线清单；首页控制台摘要
- [x] smoke:v0 增加 mode/confidence、VP 权益目录、Bot check 断言
- [x] 本地 dev 起全套后跑一遍 `pnpm smoke:v0`（2026-07-17：64 checks 全绿；learn GEO / noindex / sitemap 无 CA / 双语）
- [ ] 周末：外部 key / RPC / Telegram 正式接入

## S1 真检测 MVP（下一优先）

- [ ] 接入至少 1 个 live provider（GoPlus **或** Honeypot **或** BSC/SOL RPC 权限读）
- [ ] `collectTokenRiskData` 在配置齐全时返回非纯 mock executionMode
- [ ] 报告页根据 `mode` 切换文案（mock 黄条 / live 绿条）
- [ ] 失败降级：超时 → mock + fallbackReason 对人话可见
- [ ] 单测：live 配置 / 缺配置 / 超时降级

## S2 群内分发

- [ ] 生产 Telegram webhook + secret 操作文档（一步步）
- [ ] Bot `/check` 走 API 真报告（非仅本地 mock builder）
- [ ] 群主一页纸 PDF/MD 定稿
- [ ] 5 个试点群名单与反馈表

## S3 VP 第二曲线

- [ ] 积分中心兑换按钮状态机（V0 先 disabled + 说明）
- [ ] 服务端 confirmed 规则（日 cap、延迟确认）
- [ ] 第一个真权益：额外查询 **或** CA 监控 7 天
- [ ] Pro 定价页与 VP 抵扣说明（30% cap）
- [ ] 群主 growth 结算状态展示

## 工程卫生

- [ ] CI audit 保持 high 门槛
- [ ] 依赖与 Docker 构建在可联网环境补验
- [blocked] 浏览器截图回归（见 BLOCKERS）

## 本周建议（自动排期）

1. 选一个 live 数据源拿 key，打通 `data-adapters`  
2. 改报告页 mode 条  
3. 约 3 个群主发合作话术  
