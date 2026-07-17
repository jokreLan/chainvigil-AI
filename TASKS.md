# ChainVigil AI｜推进任务板（OPC 总控）

> 战略见 `docs/strategy/MASTER_CONTROL.md`。决策见 `DECISIONS.md`。阻塞写 `BLOCKERS.md`。

---

## ⛔ 周末闸门（硬约束 · 2026-07-17）

**只做 S0 收尾。S1 及以后先不补实现。**

| 状态 | 含义 |
|------|------|
| **周末允许** | 下方 **S0 · 周末收尾** 清单 |
| **冻结** | S1 工程实现、S1.5 剩余 UX、S2 群规模、S3 VP 运营、S4 规模化 |
| **可写文档** | 合同/红线/排期可以补字，**不写生产功能代码**（S0 密钥接线除外） |
| **解冻** | 见 `DECISIONS.md`「周末闸门」· 解冻条件 |

**精力：** 真检测接入（S0→S1 边界）优先；禁止周末并行开 Redis 队列、Dust 动效、VP 挖矿、治理投票。

---

## S0 可信骨架

### 代码侧（已完成 · mock 可验收）

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
- [x] 本地 dev 起全套后跑一遍 `pnpm smoke:v0`（2026-07-17：64 checks 全绿）
- [x] 对外双语 / Admin 仅中文
- [x] SEO/GEO 耐久页 + token/wallet **noindex** + sitemap 无 CA
- [x] 产品三红线 + S1 缓存/异步**合同**写入 DECISIONS（实现仍属 S1 冻结）

### S0 · 周末收尾（唯一开放清单）

- [ ] 填 `.env.production`（对照 `.env.production.example`）
- [ ] 接至少 1 个 live provider（GoPlus **或** Honeypot **或** BSC/SOL RPC）**或** 书面确认「纯 mock 上线 + mode 诚实」
- [ ] 若有 live：`collectTokenRiskData` / 报告页可见 `mode=live|mixed|mock` 诚实展示
- [ ] Telegram 正式 webhook + secret
- [ ] HTTPS 域名 + 反代 `TRUST_PROXY`
- [ ] 生产 readiness 绿
- [ ] 对**生产域名**跑 `pnpm smoke:v0`（或等价 smoke）
- [ ] 上线前 `pnpm build` 在目标环境通过（若尚未验）
- [ ] 上线日：1 次 token check + 1 次 bot check + admin 无密码不可进

清单细节：`docs/ops/launch_checklist.md` 节 D/E。

---

## S1 真检测 MVP + 脉冲基础 — 🔒 冻结（周末不做）

> 合同已写在 `DECISIONS.md`。**有 live 且额度/脉冲爆了**可提前解冻 Redis/限流，其余仍按序。

- [ ] 接入至少 1 个 live provider（与 S0 周末项重叠时算 S0 完成）
- [ ] `collectTokenRiskData` 配置齐全时非纯 mock executionMode
- [ ] 报告页 mode 条 live/mock 文案与单测
- [ ] 失败降级：超时 → mock + fallbackReason 对人话可见
- [ ] **Redis 真用：** 热路径 + CA 分层 TTL（高危长 / 未知短 / 负缓存）
- [ ] **限流共享：** 生产 rate-limit 键走 Redis
- [ ] **pending 双路径：** miss → 202/pending + jobId；Worker 写缓存；前端短轮询
- [ ] `/token/*` 爬虫级 rate limit（配合 noindex）

---

## S0.5 常青 SEO/GEO（内容层 · 已做一批）

> 不挡 S0 密钥主线；纯 web 内容与结构化数据。详见 `DECISIONS.md`「S0.5」。

### 已完成

- [x] board / fakeDb / solana / bnb SEO title & description（诚实 mock 边界）
- [x] learn GEO 词条 22 + assertion + 信号对照表
- [x] **长尾矩阵 34**（`long-tail-keywords.ts`）+ `/learn` 四类转化分区
- [x] 租金/Phantom 关户、burn 退 SOL、免费 cleanup、metadata、rug check、Raydium LP、renounce、隐藏 mint、卖出失败、被盗体检、Revoke.cash 替代等词条
- [x] developers TechArticle/APIReference + risk-database Dataset JSON-LD
- [x] 双链页关键词 + 转化 CTA；sitemap/smoke/launch-check 同步

### 🔒 冻结

- [ ] 真·小时级链上榜轮动 worker
- [ ] IndexNow / Google Indexing（随机 CA 禁止；案例白名单后置）
- [ ] 查询热度破百自动推送
- [ ] 权威全量黑名单 Dataset 运营承诺
- [ ] 部署者历史扫描专页（长尾 #16）
- [ ] 平台垫付 Gas 真开通

---

## S1.5 UX 信任与仪轨 — 部分完成 · 剩余 🔒 冻结

### 已完成（不占用周末）

- [x] 钱包体检渐进扫描（阶段文案 + 进度环）
- [x] 钱包报告分值圆环动效（0→score）
- [x] Revoke 弹窗白话**安全绿框**（仅撤销、不转资产、Gas 默认不垫付）

### 冻结（周末不补）

- [ ] Dust/资产理发师：省钱数字英雄区 + 粉碎动效（仍 `preview`，不伪造成功）
- [ ] 真签名路径接上后再开「平台 Gas 券」开关文案

---

## S2 群内分发 — 🔒 冻结

- [ ] 生产 Telegram webhook 操作文档（一步步）（密钥接入本身属 S0）
- [ ] Bot `/check` 走 API 真报告（非仅本地 mock builder）
- [ ] 群主一页纸 PDF/MD 定稿
- [ ] 5 个试点群名单与反馈表

---

## S3 VP 第二曲线 — 🔒 冻结

- [ ] 积分中心兑换按钮状态机（V0 先 disabled + 说明）
- [ ] 服务端 confirmed 规则（日 cap、延迟确认）
- [ ] **推荐质量加权：** 空壳低 VP / 有交易史高 VP
- [ ] 第一个真权益：额外查询 **或** CA 监控 7 天
- [ ] Pro 定价页与 VP 抵扣说明（30% cap）
- [ ] 群主 growth 结算状态展示
- [ ] （后置）风险库纠错 + Admin 采纳；投票用 VP 权重而非平台币

---

## S4 规模化 — 🔒 冻结

- [ ] 反作弊深水（设备/农场/刷 CA）
- [ ] 渠道结算自动化
- [ ] API 小套餐商业化
- [ ] 执行型回收 / 垫付 Gas 产品化（须满足三红线收据要求）

---

## 工程卫生（非周末阻塞）

- [ ] CI audit 保持 high 门槛
- [ ] 依赖与 Docker 构建在可联网环境补验
- [blocked] 浏览器截图回归（见 BLOCKERS）

---

## 本周（周末）只做这三步

1. **密钥与 env** → live 或明确 mock 上线  
2. **TG webhook + 域名 HTTPS**  
3. **生产 readiness + smoke**  

其余一律回本文件「冻结」节，**不开新坑。**
