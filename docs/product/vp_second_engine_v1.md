# 哨点 VP｜第二增长引擎 v1

## 定位

- **亮点**：安检与贡献可积累、可兑换防护权益  
- **盈利**：订阅 / 群版 / API；VP 是转化与分润润滑剂  
- **禁止**：暗示 token、提现、转让、暴富  

## 三账本

| Ledger | 用户名 | 来源 | 确认策略 |
|--------|--------|------|----------|
| xp | 成长哨点 | 查 CA、日活 | 可自动，强 cap |
| security_contribution | 贡献哨点 | 有效举报 | 人工/强规则 |
| growth_reward | 推广哨点 | 有效分享/拉新 | 延迟 24–72h + 去重 |

## 发放（v1 参数）

| 事件 | 分 | 账本 |
|------|----|------|
| FIRST_CA_CHECK | 20 | xp |
| DAILY_FIRST_CA_CHECK | 5 | xp |
| REPORT_SHARED | 5 | growth_reward |
| SHARE_EFFECTIVE_VISIT | 3 | growth_reward |
| SHARE_EFFECTIVE_CA_CHECK | 15 | growth_reward |
| RISK_REPORT_SUBMITTED | 30 | security_contribution |

## 消耗 / 权益目录（产品亮点）

| ID | 权益 | 成本 VP | 阶段 | 现金替代 |
|----|------|---------|------|----------|
| redeem.extra_checks_10 | 额外安检 10 次 | 40 | S1 展示 / S3 兑现 | Pro 含 |
| redeem.monitor_ca_7d | 监控 1 个 CA · 7 天 | 100 | S3 | ¥9 加购 |
| redeem.pro_7d | Pro 体验 7 天 | 200 | S3 | ¥19/月 Pro |
| redeem.group_boost_day | 群日查询扩容 | 150 | S3 群版 | 群月费 |

现金抵扣：**VP 最多抵 30%** 订单，避免零现金羊毛。

## 状态机

```text
事件产生 → pending → (规则/人工) confirmed | rejected
仅 confirmed 可兑换
增长类默认延迟确认
```

## UI 原则

1. 首页 VP 入口强调「换防护权益」  
2. 积分中心：总览 → 账本 → **可兑换** → 任务 → 历史  
3. 始终展示 disclaimer  
4. V0 mock 用黄/绿标签，避免像可提现钱包  

## 工程契约

- `listVpRedemptions()` in `@chainvigil/points`  
- 客户端不得自报高价值 confirmed  
- 写接口走 `INTERNAL_WRITE_SECRET`  
