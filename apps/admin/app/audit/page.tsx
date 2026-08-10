import { getAdminAuditLogs } from "../../lib/admin-audit-logs";

export const metadata = { title: "审计日志" };

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
    <main className="admin-page min-h-screen">
      <p className="admin-kicker">AUDIT TRAIL · REDACTED METADATA</p>
      <h1 className="admin-title">后台审计日志</h1>
      <p className="admin-lead">
        V0 先展示审计事件 contract 和敏感字段脱敏效果。后续接入 Prisma
        `AdminAuditLog`
        后，风险审核、标签改动、群组设置和数据源查看都应写入同一结构。
      </p>
      <p className="mt-3 text-sm text-[#8f8b9e]">
        数据来源：{source === "api" ? "API 只读审计日志" : "本地 mock fallback"}
      </p>

      <section className="admin-panel mt-8 overflow-hidden">
        <div className="hidden grid-cols-[10rem_1fr_12rem] border-b border-[#262932] bg-[#1d2027] px-4 py-3 text-sm font-semibold text-[#e4e1ed] md:grid">
          <span>动作</span>
          <span>对象与理由</span>
          <span>操作人 / 时间</span>
        </div>
        <div className="divide-y divide-[#262932]">
          {auditLogs.map((log) => (
            <article
              key={log.id}
              className="admin-min-zero grid gap-4 px-4 py-4 md:grid-cols-[10rem_1fr_12rem]"
            >
              <div className="admin-min-zero">
                <p className="text-sm font-semibold text-[#c3f5ff]">
                  {actionLabels[log.action]}
                </p>
                <p className="mt-1 text-xs text-[#8f8b9e]">{log.action}</p>
              </div>
              <div>
                <p className="admin-break-chip text-sm text-[#e4e1ed]">
                  {log.target}
                </p>
                <p className="mt-2 text-sm text-[#c7c4d7]">{log.reason}</p>
                {log.metadata ? (
                  <pre className="admin-scroll mt-3 rounded border border-[#363944] bg-[#0f1015] p-3 text-xs leading-5 text-[#c7c4d7]">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                ) : null}
              </div>
              <div className="text-sm text-[#8f8b9e]">
                <p>{log.actorId}</p>
                <p className="mt-1">
                  {new Date(log.createdAt).toLocaleString("zh-CN")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
