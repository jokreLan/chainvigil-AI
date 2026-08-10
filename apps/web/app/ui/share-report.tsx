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
  const [sharing, setSharing] = useState(false);
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(reportUrl)}&text=${encodeURIComponent(shareText)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const [subjectPrefix, subjectValue = subjectId] = subjectId.split(":", 2);
  const maskedSubject =
    subjectValue.length > 12
      ? `${subjectPrefix}: ${subjectValue.slice(0, 6)}…${subjectValue.slice(-4)}`
      : subjectId;

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

  async function nativeShare() {
    if (!navigator.share) {
      pushToast(t("share.unavailable"), "warning");
      return;
    }

    setSharing(true);
    try {
      await navigator.share({ title: "ChainVigil", text: shareText, url: reportUrl });
      recordShareEvent("share_native");
      setShowVpHint(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        pushToast(t("share.cancelled"), "info");
      } else {
        pushToast(t("share.toastDenied"), "error");
      }
    } finally {
      setSharing(false);
    }
  }

  const privacyPreview = (
    <div className="rounded-lg border border-[#3b494c]/50 bg-[#0d1516] p-3 text-left">
      <p className="cv-font-mono text-[10px] font-semibold uppercase tracking-wide text-[#00e5ff]">
        {t("share.privacyPreview")}
      </p>
      <p className="mt-1 break-words cv-font-mono text-xs text-[#bac9cc]">{maskedSubject}</p>
    </div>
  );

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
        <div className="col-span-2">{privacyPreview}</div>
        <button
          type="button"
          onClick={() => copy(reportUrl, "link")}
          className="flex min-h-11 items-center justify-center rounded-lg bg-[#c3f5ff] px-3 text-sm font-semibold text-[#00363d] transition hover:bg-[#9cf0ff]"
        >
          {copied === "link" ? t("share.copiedLink") : t("share.shareReport")}
        </button>
        <button
          type="button"
          onClick={nativeShare}
          disabled={sharing}
          className="flex min-h-11 items-center justify-center rounded-lg border border-[#3b494c] bg-[#242b2d] px-3 text-sm font-semibold text-[#dce4e5] disabled:cursor-wait disabled:opacity-60"
        >
          {sharing ? t("common.loading") : t("share.native")}
        </button>
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
      {privacyPreview}
      <button
        type="button"
        onClick={() => copy(reportUrl, "link")}
        className="min-h-11 w-full rounded-lg border border-[#3b494c] bg-[#242b2d] px-4 text-sm font-semibold text-[#dce4e5] transition hover:border-[#00e5ff]/55"
      >
        {copied === "link" ? t("share.copiedLink") : t("share.copyLink")}
      </button>
      <button
        type="button"
        onClick={() => copy(shareText, "text")}
        className="min-h-11 w-full rounded-lg border border-[#3b494c] bg-[#242b2d] px-4 text-sm font-semibold text-[#dce4e5] transition hover:border-[#00e5ff]/55"
      >
        {copied === "text" ? t("share.copiedText") : t("share.copyText")}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={nativeShare}
          disabled={sharing}
          className="col-span-2 flex min-h-11 items-center justify-center rounded-lg bg-[#c3f5ff] px-4 text-sm font-semibold text-[#00363d] transition hover:bg-[#9cf0ff] disabled:cursor-wait disabled:opacity-60"
        >
          {sharing ? t("common.loading") : t("share.native")}
        </button>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            recordShareEvent("share_telegram");
            setShowVpHint(true);
            pushToast("Telegram", "info");
          }}
          className="flex min-h-11 items-center justify-center rounded-lg bg-[#c3f5ff] px-4 text-sm font-semibold text-[#00363d] transition hover:bg-[#9cf0ff]"
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
          className="flex min-h-11 items-center justify-center rounded-lg border border-[#3b494c] bg-[#242b2d] px-4 text-sm font-semibold text-[#dce4e5] transition hover:border-[#00e5ff]/55"
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
