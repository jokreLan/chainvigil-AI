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
  const [copyError, setCopyError] = useState(false);
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
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        throw new Error("clipboard_unavailable");
      }
      recordShareEvent(type === "link" ? "copy_report_link" : "copy_share_text");
      setCopyError(false);
      setCopied(type);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopyError(true);
      window.setTimeout(() => setCopyError(false), 2400);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => copy(reportUrl, "link")}
        className="min-h-11 w-full rounded-md border border-[#464554] px-4 text-sm font-semibold text-[#f9fafb] transition hover:border-[#8083ff] hover:bg-[#8083ff]/10"
      >
        {copied === "link" ? "已复制链接" : "复制报告链接"}
      </button>
      <button
        type="button"
        onClick={() => copy(shareText, "text")}
        className="min-h-11 w-full rounded-md border border-[#464554] px-4 text-sm font-semibold text-[#f9fafb] transition hover:border-[#8083ff] hover:bg-[#8083ff]/10"
      >
        {copied === "text" ? "已复制文案" : "复制分享文案"}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => recordShareEvent("share_telegram")}
          className="flex min-h-11 items-center justify-center rounded-md bg-[#8083ff] px-4 text-sm font-semibold text-[#0d0096] transition hover:bg-[#c0c1ff]"
        >
          Telegram
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => recordShareEvent("share_x")}
          className="flex min-h-11 items-center justify-center rounded-md border border-[#464554] bg-[#292932] px-4 text-sm font-semibold text-[#f9fafb] transition hover:bg-[#34343d]"
        >
          X
        </a>
      </div>
      {copyError ? <p aria-live="polite" className="text-xs text-[#fca5a5]">浏览器未允许剪贴板访问，请手动复制报告地址。</p> : null}
    </div>
  );
}
