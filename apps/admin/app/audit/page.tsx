import { getAdminAuditLogs } from "../../lib/admin-audit-logs";

export const dynamic = "force-dynamic";

type AuditLog = Awaited<ReturnType<typeof getAdminAuditLogs>>["logs"][number];

const actionLabels: Record<AuditLog["action"], string> = {
  "risk_report.reviewed": "风险报告复核",
  "risk_label.created": "风险标签创建",
  "risk_label.updated": "风险标签更新",
  "telegram_group.updated": "Telegram 群组更新",
  "data_source.checked": "数据源状态查看",
  "system_readiness.viewed": "系统就绪查看",
};

export default async function AdminAuditPage() {
  const { logs: auditLogs, source } = await getAdminAuditLogs();

  return (
    <main className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-semibold">后台审计日志</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        V0 先展示审计事件 contract 和敏感字段脱敏效果。后续接入 Prisma `AdminAuditLog`
        后，风险审核、标签改动、群组设置和数据源查看都应写入同一结构。
      </p>
      <p className="mt-3 text-sm text-slate-500">
        数据来源：{source === "api" ? "API 只读审计日志" : "本地 mock fallback"}
      </p>

      <section className="mt-8 overflow-hidden border border-slate-700">
        <div className="grid grid-cols-[10rem_1fr_12rem] border-b border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200">
          <span>动作</span>
          <span>对象与理由</span>
          <span>操作人 / 时间</span>
        </div>
        <div className="divide-y divide-slate-800">
          {auditLogs.map((log) => (
            <article key={log.id} className="grid gap-4 px-4 py-4 md:grid-cols-[10rem_1fr_12rem]">
              <div>
                <p className="text-sm font-semibold text-emerald-100">{actionLabels[log.action]}</p>
                <p className="mt-1 text-xs text-slate-500">{log.action}</p>
              </div>
              <div>
                <p className="break-all text-sm text-slate-200">{log.target}</p>
                <p className="mt-2 text-sm text-slate-400">{log.reason}</p>
                {log.metadata ? (
                  <pre className="mt-3 overflow-x-auto bg-black/30 p-3 text-xs leading-5 text-slate-300">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                ) : null}
              </div>
              <div className="text-sm text-slate-400">
                <p>{log.actorId}</p>
                <p className="mt-1">{new Date(log.createdAt).toLocaleString("zh-CN")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
