# 资产理发师 Stitch UI 对照记录

## 本轮目标

`/app/asset-barber` 以 Stitch 项目 `projects/13031700938683083250` 的真实源屏为主还原，主参考屏是 `a9923988dc1649318f98a3b651c04e88`（资产理发师 - 链哨 AI，780x5074）。页面默认首屏改为源图的结果型仪表盘，而不是营销介绍页。

## Stitch 源屏对照

| 状态 | Stitch 源屏 | 本地实现 |
| --- | --- | --- |
| 主仪表盘 | `资产理发师 - 链哨 AI` / `a9923988dc1649318f98a3b651c04e88` | 标题、英文说明、洁净度圆环、4 个指标卡、AI Cleanup Strategy、Asset Classification 三列卡、底部 Wallet 导航 |
| 授权风险细节 | `授权清理 - 链哨 AI` / `e0cd6715dd2c41e8931e98862a88383f` | BNB Mock 授权列表、High/Medium/Low 风险标签、仅 Mock 的撤销前检查 |
| 撤销确认 | `撤销确认 - 链哨 AI` / `bde0a3f70afb4f048d260f7f01b254c5` | 所有 Recycle/Hide/Revoke/Pro 动作进入安全确认弹窗，不执行真实交易 |
| 扫描中 | `CA 安检中 - 链哨 AI` / `ac188bc74ce8495f9087ed657a90a0f9` | 四阶段扫描进度、深色卡片、紫色进行态、完成态标记 |
| 输入入口 | `钱包体检 - 链哨 AI` / `e106f2c09ca04e0ab20edfbd48a8b4cf` | 连接/输入演示地址、SOL + BNB 范围切换、错误状态 |
| 全局框架 | `首页 - 链哨 AI` / `dafdd1eb939e4517abac988a3c88c139` | ChainVigil AI 顶栏、深色背景、移动底部导航与 Wallet 激活态 |

## 已还原的视觉结构

- 背景、表面、边框、主色使用 Stitch 设计系统：`#0A0B0F`、`#16181D`、`#262932`、`#c0c1ff`、`#8083ff`。
- 顶栏固定 64px，高对比品牌区，右侧语言入口。
- 主屏按源图顺序排列：标题区 → 洁净度 + 指标网格 → AI 建议卡 → Asset Classification → SOL/BNB 细分 Mock。
- Asset Classification 保留源图三类：`可回收资产`、`建议隐藏资产`、`禁止处理资产`，并接入安全确认弹窗。
- 默认首屏是源图的结果仪表盘；点击 `扫描我的钱包 (Initiate Full Scan)` 后进入输入与扫描状态。

## 当前能力边界

当前实现仍是纯前端、本地 Mock 预览：不连接真实钱包、不读取链上数据、不请求私钥/助记词，也不会执行 CloseAccount、Burn NFT、Revoke、归集、Swap、Bridge 或转账。

## 已知偏差

- Stitch 只提供资产理发师结果长屏，没有单独的资产理发师输入页/扫描页/确认弹窗源屏；这些状态参考钱包体检、CA 安检中、授权清理、撤销确认的同项目源屏补齐。
- 浏览器插件可视截图通道当前在本机运行时卡在 `Cannot redefine property: process`，所以本轮视觉依据来自 Stitch 原始截图/HTML、本地类型检查与构建校验；未能用 in-app browser 生成最终页面截图叠图。
