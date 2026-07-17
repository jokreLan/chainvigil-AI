# Stitch v1 屏幕对照索引

来源：用户导出至 `docs/design/stitch-v1/`（2026-07-17）  
设计系统：`chainvigil_ai/DESIGN.md`

| 目录 | 页面 | 对应产品路由（目标） | 优先级 |
|------|------|----------------------|--------|
| `ai_8` | 首页 Landing（买币前先查 CA） | `/` | **P0** |
| `ca_ai` | 扫描中 Scanning | `/check` 提交后状态 | **P0** |
| `ai_4` | Token 风险报告（禁买结论） | `/token/[chain]/[address]` | **P0** |
| `ai_11` | 钱包体检入口 | `/wallet-check` | **P1** |
| `ai_10` | 授权扫描 | `/app/approvals` 或 `/app/approval-cleaner` | **P1** |
| `ai_1` | 撤销授权二次确认 Modal | 授权流程组件 | **P1**（功能后置，UI 先备） |
| `ai_12` | 哨点 VP 中心 | `/app/points` | **P1** |
| `ai_2` | 高危 CA 数据库/榜单 | `/leaderboard/high-risk-tokens` | **P2** |
| `ai_3` | 假币数据库 | `/fake-token-database` | **P2** |
| `ai_5` | 风险百科 | `/learn` / `/risk-database` | **P2** |
| `ai_6` | 资产理发师 | `/app/asset-barber` | **P2** |
| `ai_7` | 推广中心 Growth | `/app/growth` | **P2** |
| `ai_9` | 开发者中心 | `/developers` | **P3** |

## 设计系统要点（DESIGN.md）

- 背景 `#0A0B0F`，卡片 `#16181D`，边框 `#262932`
- Primary 蓝紫 `#c0c1ff` / `#8083ff`
- 风险：禁买红 / 高危橙 / 谨慎琥珀 / 低风险绿 / 未知灰
- VP 专用金 `#EAB308`（不得与风险色混用）
- 底栏 4 项：**Home · Wallet · Database · Points**
- 先读后写：扫码/报告不连钱包；撤销才签名

## 实现进度（2026-07-17）

| 优先级 | 状态 |
|--------|------|
| P0 首页 / 扫描中 / 报告 | ✅ 已按 Stitch 落地（保留 mode 条与 SOL/BNB） |
| P1 钱包入口 / VP / 底栏 | ✅ 已对齐 |
| P2 高危榜 / 假币 / 授权扫描 | ✅ UI 强化 |
| P3 推广/百科/开发者/理发师/撤销 Modal | ✅ 已对齐 |

## 与产品战略冲突点（实现时要改文案）

| Stitch 稿 | 问题 | 上线文案改为 |
|-----------|------|----------------|
| VP「governance weight」 | 像治理币 | 产品权益 / 贡献记录，无治理权 |
| 首页「支持主流 EVM 链」 | 我们主推 SOL+BNB | 优先 SOL / BNB |
| 高危库「Real-time」 | 当前 mock | V0 mock / 更新机制标明 |
| 报告无 mode 条 | 与上线诚实契约冲突 | 保留 MOCK/LIVE banner |
