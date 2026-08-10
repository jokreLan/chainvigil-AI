"use client";

import { useState } from "react";
import { useT } from "../i18n/locale-context";

interface CopyValueButtonProps {
  value: string;
  label: string;
  className?: string;
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("copy_failed");
  }
}

export function CopyValueButton({ value, label, className = "" }: CopyValueButtonProps) {
  const t = useT();
  const [feedback, setFeedback] = useState<"copied" | "failed" | null>(null);

  async function onCopy() {
    try {
      await copyText(value);
      setFeedback("copied");
    } catch {
      setFeedback("failed");
    }

    window.setTimeout(() => setFeedback(null), 1800);
  }

  const text =
    feedback === "copied" ? t("common.copied") : feedback === "failed" ? t("common.copyFailed") : label;

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`min-h-11 rounded border border-[#464554] px-2 py-1 text-xs font-semibold text-[#c7c4d7] transition hover:border-[#8083ff] hover:text-white ${className}`}
    >
      {text}
    </button>
  );
}
