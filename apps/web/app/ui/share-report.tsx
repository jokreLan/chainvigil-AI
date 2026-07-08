"use client";

import { useState } from "react";

interface ShareReportProps {
  reportUrl: string;
  shareText: string;
  subjectId: string;
  referralCode: string;
}

export function ShareReport({ reportUrl, shareText, subjectId, referralCode }: ShareReportProps) {
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(reportUrl)}&text=${encodeURIComponent(shareText)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  function recordShareEvent(action: string) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

    void fetch(`${apiBaseUrl}/api/v1/referral/event`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        referralCode,
        source: "web",
        action,
        subjectId,
      }),
    }).catch(() => undefined);
  }

  async function copy(value: string, type: "link" | "text") {
    await navigator.clipboard.writeText(value);
    recordShareEvent(type === "link" ? "copy_report_link" : "copy_share_text");
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => copy(reportUrl, "link")}
        className="min-h-11 w-full border border-emerald-300/30 px-4 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-300/10"
      >
        {copied === "link" ? "已复制链接" : "复制报告链接"}
      </button>
      <button
        type="button"
        onClick={() => copy(shareText, "text")}
        className="min-h-11 w-full border border-emerald-300/30 px-4 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-300/10"
      >
        {copied === "text" ? "已复制文案" : "复制分享文案"}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => recordShareEvent("share_telegram")}
          className="flex min-h-11 items-center justify-center bg-emerald-300 px-4 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200"
        >
          Telegram
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => recordShareEvent("share_x")}
          className="flex min-h-11 items-center justify-center bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
        >
          X
        </a>
      </div>
    </div>
  );
}
