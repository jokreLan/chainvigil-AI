"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "../i18n/locale-context";
import { useToast } from "./toast";

interface ShareReportProps {
  reportUrl: string;
  shareText: string;
  subjectId: string;
  referralCode: string;
  compact?: boolean;
}

export function ShareReport({
  reportUrl,
  shareText,
  subjectId,
  referralCode,
  compact = false,
}: ShareReportProps) {
  const t = useT();
  const { pushToast } = useToast();
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [showVpHint, setShowVpHint] = useState(false);
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(reportUrl)}&text=${encodeURIComponent(shareText)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  function recordShareEvent(action: string) {
    void fetch("/api/referral", {
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
      setShowVpHint(true);
      pushToast(t("share.toastCopied"), "success");
      window.setTimeout(() => setCopied(null), 1800);
      window.setTimeout(() => setShowVpHint(false), 5000);
    } catch {
      setCopyError(true);
      pushToast(t("share.toastDenied"), "error");
      window.setTimeout(() => setCopyError(false), 2400);
    }
  }

  const vpHint = showVpHint ? (
    <p role="status" className="text-xs leading-5 text-[#eab308]">
      {t("share.vpHint")}{" "}
      <Link href="/app/points" className="underline">
        {t("nav.points")}
      </Link>{" "}
      {t("share.or")}{" "}
      <Link href="/app/growth" className="underline">
        Growth
      </Link>
      .
    </p>
  ) : null;

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => copy(reportUrl, "link")}
          className="flex min-h-11 items-center justify-center rounded-lg bg-[#292932] px-3 text-sm font-semibold text-[#f9fafb] transition hover:bg-[#34343d]"
        >
          {copied === "link" ? t("share.copiedLink") : t("share.shareReport")}
        </button>
        <Link
          href="/wallet-check"
          className="flex min-h-11 items-center justify-center rounded-lg border border-[#464554] px-3 text-sm font-semibold text-[#f9fafb]"
        >
          {t("share.checkWallet")}
        </Link>
        {copyError ? (
          <p role="status" aria-live="polite" className="col-span-2 text-xs text-[#fca5a5]">
            {t("share.clipboardDenied")}
          </p>
        ) : null}
        {showVpHint ? <div className="col-span-2">{vpHint}</div> : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => copy(reportUrl, "link")}
        className="min-h-11 w-full rounded-md border border-[#464554] px-4 text-sm font-semibold text-[#f9fafb] transition hover:border-[#8083ff] hover:bg-[#8083ff]/10"
      >
        {copied === "link" ? t("share.copiedLink") : t("share.copyLink")}
      </button>
      <button
        type="button"
        onClick={() => copy(shareText, "text")}
        className="min-h-11 w-full rounded-md border border-[#464554] px-4 text-sm font-semibold text-[#f9fafb] transition hover:border-[#8083ff] hover:bg-[#8083ff]/10"
      >
        {copied === "text" ? t("share.copiedText") : t("share.copyText")}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            recordShareEvent("share_telegram");
            setShowVpHint(true);
            pushToast("Telegram", "info");
          }}
          className="flex min-h-11 items-center justify-center rounded-md bg-[#8083ff] px-4 text-sm font-semibold text-[#0d0096] transition hover:bg-[#c0c1ff]"
        >
          Telegram
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            recordShareEvent("share_x");
            setShowVpHint(true);
            pushToast("X", "info");
          }}
          className="flex min-h-11 items-center justify-center rounded-md border border-[#464554] bg-[#292932] px-4 text-sm font-semibold text-[#f9fafb] transition hover:bg-[#34343d]"
        >
          X
        </a>
      </div>
      {copyError ? (
        <p aria-live="polite" className="text-xs text-[#fca5a5]">
          {t("share.clipboardDenied")}
        </p>
      ) : null}
      {vpHint}
    </div>
  );
}
