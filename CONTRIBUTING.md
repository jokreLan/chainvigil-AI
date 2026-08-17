# Contributing to ChainVigil

感谢你愿意改进 ChainVigil。项目目前处于实验阶段，优先接受能够提升正确性、安全性、可验证性和开发者体验的改动。

## 开始之前

- 先搜索已有 Issue 和 Pull Request，避免重复工作。
- 较大的功能、数据模型或公共 API 变更，请先创建 Issue 讨论。
- 安全漏洞不要提交公开 Issue，请按照 `SECURITY.md` 的方式私下报告。
- 不得提交真实密钥、用户数据、受版权保护的数据集或无法确认授权的素材。

## 本地开发

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm launch:check
```

开发模式：

```bash
pnpm dev
```

默认使用明确标记的 mock 数据。启用真实 Provider 前，请阅读 `.env.example`、`.env.production.example` 和 `SECURITY.md`。

## Pull Request 要求

- 每个 PR 聚焦一个问题，避免混入无关重构。
- 为行为变化补充或更新测试。
- 保持 Mock、Live、Mixed、Degraded 和 Unassessed 状态可区分。
- 风险结论必须能追溯到证据、数据源、置信度和新鲜度。
- 不得把示例数据描述为实时结果，不得承诺投资收益或绝对安全。
- UI 改动需兼顾中文、英文、键盘操作、减少动画和移动端布局。
- 确保 `pnpm typecheck`、`pnpm test`、`pnpm build` 和 `pnpm launch:check` 通过。

## 提交与许可

提交贡献即表示你有权提交相关内容，并同意该贡献按照项目的 Apache License 2.0 许可发布。

参与本项目还需要遵守 `CODE_OF_CONDUCT.md`。
