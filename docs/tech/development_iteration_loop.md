# ChainVigil AI V0 开发迭代 Loop

本文档定义当前阶段的执行节奏。除非遇到明确阻塞，否则持续按小步闭环推进。

## 固定循环

```text
1. 选择一个 V0 小任务
2. 开发最小可运行实现
3. 运行校验
4. 失败则修复
5. 再运行校验
6. 通过后更新 PROGRESS.md / DECISIONS.md / BLOCKERS.md
7. 进入下一个小任务
```

## 每轮校验命令

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

必要时增加局部验证：

```bash
curl http://localhost:4000/health
curl -X POST http://localhost:4000/api/v1/token/check
curl -X POST http://localhost:4001/telegram/webhook
curl -I http://localhost:3000
```

## 修复规则

- 每个失败项最多连续修复 3 次。
- 3 次后仍失败，写入 `BLOCKERS.md`，说明失败命令、错误摘要、已尝试修复、下一步需要什么。
- 没有阻塞时不返回中间交付，而是继续推进下一个小任务。

## V0 当前任务队列

1. `/check` 表单调用 API，成功后进入报告页。
2. 建立 Web 端 API client 和错误状态。
3. 为 API token check 和 Bot webhook 增加测试。
4. 为 report/points 增加更具体的单元测试。
5. 增加分享复制按钮和 referral 参数保留。
6. 增加基础 SEO/GEO 页面：风险百科入口、Bot 落地页结构、API 文档入口。
7. 增加 Admin token report 查询 skeleton。
8. 增加 Prisma 迁移/生成脚本说明。
9. 接入真实数据源前，补充 data-adapters 接口契约。

## 当前不进入循环的内容

- 浏览器插件。
- 自动交易拦截。
- 钱包签名拦截。
- 自动 swap。
- 粉尘归集。
- 跨链 bridge。
- 平台币 claim。
- 任何“VP 等于未来 token”的承诺。
