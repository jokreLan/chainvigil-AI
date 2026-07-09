import Link from "next/link";

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/token/check",
    description: "提交 CA、DEX 链接或原始文本，返回标准 Token 风险报告。",
  },
  {
    method: "GET",
    path: "/api/v1/token/:chain/:address",
    description: "读取指定链和合约地址的 Token 风险报告。",
  },
  {
    method: "POST",
    path: "/telegram/webhook",
    description: "Telegram Bot skeleton webhook，支持 mock /check 调用。",
  },
  {
    method: "GET",
    path: "/api/v1/telegram/groups",
    description: "读取 Telegram 群组 mock 设置、检测额度和高危提醒状态。",
  },
  {
    method: "GET",
    path: "/api/v1/telegram/commands",
    description: "读取 Telegram Bot 命令清单和人话说明。",
  },
  {
    method: "GET",
    path: "/openapi.json",
    description: "机器可读 API contract，用于 SDK、测试和未来开发者集成。",
  },
  {
    method: "GET",
    path: "/api/v1/meta",
    description: "读取品牌、V0 版本、运行模式和支持链，不返回密钥或连接串。",
  },
  {
    method: "GET",
    path: "/api/v1/system/readiness",
    description: "读取系统就绪状态、缺失变量名和生产安全预检警告。",
  },
  {
    method: "GET",
    path: "/api/v1/data-sources/adapters",
    description: "读取数据源 adapter mock/live 状态和缺失配置变量名，不返回密钥值。",
  },
  {
    method: "GET",
    path: "/api/v1/worker/jobs",
    description: "读取 Worker 健康状态和 V0 后台任务 contract。",
  },
  {
    method: "GET",
    path: "/api/v1/risk/database",
    description: "读取风险数据库人话解释、信号和建议动作。",
  },
  {
    method: "GET",
    path: "/api/v1/risk/high-risk-tokens",
    description: "读取公开高危 CA 榜单 mock contract。",
  },
  {
    method: "GET",
    path: "/api/v1/risk/fake-token-examples",
    description: "读取假币识别样例和风险信号。",
  },
  {
    method: "GET",
    path: "/api/v1/risk/monitor-rules",
    description: "读取只读风险监控规则，不执行自动交易拦截或钱包操作。",
  },
  {
    method: "GET",
    path: "/api/v1/asset-cleanup/policies",
    description: "读取授权清理、资产理发师和粉尘扫描的只读安全策略。",
  },
  {
    method: "POST",
    path: "/api/v1/wallet/health",
    description: "提交钱包地址，返回只读钱包健康报告。",
  },
  {
    method: "GET",
    path: "/api/v1/wallet/watchlist",
    description: "读取只读钱包 watchlist mock，不请求签名或私钥。",
  },
  {
    method: "GET",
    path: "/api/v1/points/rules",
    description: "读取哨点 VP 事件规则和积分边界说明。",
  },
  {
    method: "GET",
    path: "/api/v1/points/ledger",
    description: "读取哨点 VP mock ledger 摘要，区分 pending、confirmed、rejected。",
  },
  {
    method: "GET",
    path: "/api/v1/growth/channels",
    description: "读取 KOL、Telegram、X 渠道 mock 归因和 VP 结算摘要。",
  },
  {
    method: "GET",
    path: "/api/v1/admin/audit/logs",
    description: "读取只读 Admin 审计日志 mock contract，metadata 已脱敏。",
  },
  {
    method: "GET",
    path: "/api/v1/admin/risk-review/queue",
    description: "读取高危 CA 人工复核 mock 队列，供 Admin skeleton 展示。",
  },
  {
    method: "GET",
    path: "/api/v1/admin/risk-labels",
    description: "读取 Token、部署者、授权对象的风险标签 mock 目录。",
  },
  {
    method: "GET",
    path: "/api/v1/admin/token-reports",
    description: "读取后台 Token 报告 mock 索引，供 Admin skeleton 查询展示。",
  },
];

export default function ApiPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <nav className="flex items-center justify-between text-sm text-emerald-100/70">
        <Link href="/" className="font-semibold text-emerald-100">
          ChainVigil AI｜链哨 AI
        </Link>
        <Link href="/risk-database">风险数据库</Link>
      </nav>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Developer API
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-white">API 文档入口</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-emerald-50/72">
          V0 API 先服务 Web、Bot 和 Admin 内部调用。公开商业 API 会在风险准确率、限流、审计和计费模型稳定后开放。
        </p>
        <a
          href="http://localhost:4000/openapi.json"
          className="mt-6 inline-block border border-emerald-300/30 px-4 py-3 text-sm font-semibold text-emerald-100"
        >
          打开 OpenAPI JSON
        </a>
      </section>

      <section className="mt-10 space-y-4">
        {endpoints.map((endpoint) => (
          <article
            key={`${endpoint.method}-${endpoint.path}`}
            className="border border-emerald-300/14 bg-black/20 p-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-950">
                {endpoint.method}
              </span>
              <code className="break-all text-emerald-100">{endpoint.path}</code>
            </div>
            <p className="mt-3 leading-7 text-emerald-50/70">{endpoint.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
