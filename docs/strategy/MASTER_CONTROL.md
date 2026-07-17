# ChainVigil AI｜总控推进计划（OPC）

**角色合并**：市场总监 · 运营总监 · 运维总监 · 开发总监 · UI/UX  
**更新**：2026-07-17  
**约束**：一人公司（OPC）；资源优先顺序固定如下。

### ⛔ 当前窗口：周末只做 S0 收尾

| | |
|--|--|
| **开放** | S0 外部 key / live 或书面 mock 上线 / TG webhook / 域名 / 生产 smoke |
| **冻结** | S1 Redis·队列·pending、S1.5 Dust 动效、S2 群规模、S3 VP 加权/投票、S4 规模化 |
| **SSOT** | `TASKS.md` 顶部闸门 · `DECISIONS.md`「周末闸门」· `docs/ops/launch_checklist.md` D/E |
| **解冻** | S0 收尾完成（或书面 mock 上线）→ 才开 S1；脉冲爆额度可先解冻 Redis/限流 |

**不要误判为「UI/DevOps/运营建议都搞定了」：**

- 已落地：三红线与 S1 **合同（文档）**；钱包渐进扫描 + Revoke 绿框（演示 UX）  
- 未落地且冻结：Redis 热路径、异步队列、Dust 粉碎、VP 防作弊加权、社群纠错投票、平台垫付 Gas  

---

## 1. 战略锁定（不再摇摆）

| 项 | 决策 |
|----|------|
| 品类 | Web3 **买前 CA 安检**（L2 消费端入口） |
| 人群 | 中文 meme / 土狗玩家 · TG 群 |
| 链 | **SOL + BNB 做深**，其它链仅兼容 |
| 竞品 | GoPlus / Honeypot = **供应商**；Token Sniffer = 零售扫盘参照 |
| 一句话 | 买币前，在群里用中文把 CA 查清楚 |
| 主引擎 | 真检测可信度 + TG 分发 |
| 第二曲线 | **哨点 VP → 产品权益 → 订阅/群版**（不绑 token） |
| 不做 | 自动交易、签名拦截、承诺 VP=币、全链数据帝国 |

**精力分配（OPC）**

```text
真检测 50%  ·  TG/群分发 30%  ·  VP 权益 20%
未上真检测前：VP 只做展示与权益目录，不猛推
```

---

## 2. 北极星与阶段 KPI

### North Star
**有效 CA 安检次数 / 周**（非 PV、非空分享）

### 阶段闸门

| 阶段 | 名称 | 状态（2026-07-17） | 必须达成才能进下一阶段 |
|------|------|--------------------|------------------------|
| S0 | 可信骨架 | **代码侧 ✅ · 周末收尾 ⏳** | mock 标明；安全 P0；定位；SEO/GEO；本地 smoke 64 ✅；**密钥/域名/生产 smoke ⏳** |
| S1 | 真检测 MVP | 🔒 冻结（合同已写） | SOL+BNB 核心信号 live；`mode=live|mixed`；Redis/限流按需 |
| S1.5 | UX 信任 | 部分 ✅ · 剩余 🔒 | 体检仪轨/Revoke 绿框 ✅；Dust 等后置 |
| S2 | 群内分发 | 🔒 冻结 | 正式 Bot + ≥5 试点群；周有效检查 ≥ 阈值 |
| S3 | 第二曲线 | 🔒 冻结 | 首个可兑权益 + Pro/群版收银；VP 加权确认 |
| S4 | 规模化 | 🔒 冻结 | 反作弊 + 渠道结算 + API 小套餐 |

---

## 3. 90 天节奏（总览）

| 天数 | 市场/运营 | 产品/UX | 研发 | 运维 |
|------|-----------|---------|------|------|
| D1–14 | 定位物料、群话术 | 首页/报告/VP 权益目录对齐 | 真检测编排骨架、接 1 数据源 | runbook、密钥清单 |
| D15–45 | 找 5–10 群主试点 | Bot 欢迎语/报告分享流 | RPC+GoPlus 或 Honeypot 实连 | 预发环境、限流监控 |
| D46–75 | 案例周报、分润试点 | 监控权益 v0 UI | 延迟确认 VP、反刷 v0 | 备份、告警 |
| D76–90 | 复盘 GTM、定价试探 | Pro 抵扣文案 | 订阅占位 API | 生产 fail-closed 演练 |

详细动作见 `docs/go-to-market/gtm_90_days.md`。

---

## 4. 本轮已落地（代码/文档）

- 安全 P0（鉴权、CORS、Webhook、限流、mode/confidence）
- 总控与 GTM / VP / 运维文档
- 首页与 VP 中心叙事对齐第二曲线
- VP 可兑换权益目录 contract
- 真检测编排接口骨架（live path）
- Bot 欢迎语强化定位
- 对外 zh/en；Admin 仅中文
- SEO/GEO：耐久页 metadata + 全站 JSON-LD + `/learn/*`；CA/token **noindex**、sitemap 不含 CA
- `launch:check` + `smoke:v0`（64：robots/sitemap/learn GEO/token noindex/双语）
- 产品三红线 + S1 缓存/异步**合同**（`DECISIONS.md`）；周末闸门（S0 only / S1+ 冻结）
- UX：钱包渐进扫描、健康分圆环、Revoke 安全绿框（仍 mock）
- S0.5 常青 SEO/GEO：title 矩阵、learn 11 词条 + 断言表、Developers/Risk Dataset JSON-LD、双链 CTA

### 明确未做（冻结，勿当完成）

- Redis 进热路径 / BullMQ pending / 爬虫级限流  
- Dust 粉碎与「省钱」执行叙事  
- VP 推荐加权、纠错投票、平台垫付 Gas  
- 生产密钥与正式 TG / 生产 smoke  
- 真小时榜轮动、对随机 CA IndexNow、查询破百自动推送  

详见 `DECISIONS.md`「S0.5 常青 SEO/GEO」。

---

## 5. 决策权限（OPC 默认）

一人拍板时按此优先级冲突消解：

1. **信任**（误导 mock、假承诺）> 增长  
2. **真检测** > 新页面皮肤  
3. **TG 场景** > 独立站花活  
4. **可兑权益** > 发分活动  
5. **可运维** > 功能数量  

---

## 6. 每周例行（建议日历）

| 日 | 动作 |
|----|------|
| 一 | 看周有效安检、错误率、限流 429 |
| 三 | 1 条风险案例内容（TG/X） |
| 五 | 推进 1 个真检测或 Bot 任务到可演示 |
| 日 | 写 5 行周报进 `PROGRESS.md` |

---

## 7. 关联文档

- 定位与竞品：会话结论 + `docs/product/vp_second_engine_v1.md`
- GTM：`docs/go-to-market/gtm_90_days.md`
- 运维：`docs/ops/runbook_v1.md`
- 安全：`SECURITY.md`
- 任务板：`TASKS.md`
