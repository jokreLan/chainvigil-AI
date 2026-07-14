"use client";

import { useState } from "react";

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

  const text = feedback === "copied" ? "已复制" : feedback === "failed" ? "复制失败" : label;

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`rounded border border-[#464554] px-2 py-1 text-xs font-semibold text-[#c7c4d7] transition hover:border-[#8083ff] hover:text-white ${className}`}
    >
      {text}
    </button>
  );
}
