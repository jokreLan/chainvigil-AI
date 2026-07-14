"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { TokenCheckResponse } from "@chainvigil/types";
import { readApiErrorMessage } from "../lib/api-error";

const tokenAddressPattern = /(0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,44})/;

export function CheckForm({ compact }: { compact: boolean }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.match(tokenAddressPattern)) {
      setError("请输入有效的 SOL 或 BNB Token 合约地址。");
      return;
    }

    setError("");
    setIsChecking(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiBaseUrl}/api/v1/token/check`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          input,
          source: "web",
        }),
      });

      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response, "安检接口暂时不可用，请稍后重试。"));
      }

      const data = (await response.json()) as TokenCheckResponse;
      router.push(`/token/${data.report.chain}/${data.report.tokenAddress}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "安检失败，请稍后重试。");
    } finally {
      setIsChecking(false);
    }
  }

  if (isChecking) {
    return (
      <section aria-live="polite" className="mx-auto max-w-md space-y-8 py-2 text-center">
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border-2 border-[#c0c1ff]/25 bg-[#0d0d15]">
          <div className="absolute inset-4 rounded-full border border-[#c0c1ff]/40" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c0c1ff] motion-safe:animate-spin" />
          <div className="relative"><p className="text-3xl font-semibold text-[#c0c1ff]">CA</p><p className="mt-1 text-sm font-semibold text-[#c0c1ff]">扫描中</p></div>
        </div>
        <div className="rounded-xl border border-[#262932] bg-[#16181d] p-5 text-left">
          <div className="mb-5 text-center"><h2 className="text-xl font-semibold text-[#f9fafb]">深度安全分析</h2><p className="mt-2 text-sm text-[#c7c4d7]">正在深度扫描智能合约，请稍候...</p></div>
          <div className="space-y-3">
            <ScanStep label="识别合约" state="done" />
            <ScanStep label="检测买卖" state="active" />
            <ScanStep label="扫描权限" state="pending" />
            <ScanStep label="检查流动性" state="pending" />
            <ScanStep label="分析持仓" state="pending" />
            <ScanStep label="生成 AI 报告" state="pending" />
          </div>
          <p className="mt-6 rounded-full bg-[#292932] px-4 py-3 text-center text-sm text-[#c7c4d7]">无需连接钱包，安全只读扫描。</p>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Token 合约地址"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="粘贴 SOL / BNB Token 合约地址或链接"
          className="min-h-14 flex-1 rounded-md border border-[#464554] bg-[#0d0d15] px-4 font-mono text-sm text-[#f9fafb] outline-none transition placeholder:text-[#6b7280] focus:border-[#8083ff] focus:ring-2 focus:ring-[#8083ff]/20"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="min-h-14 rounded-md bg-[#8083ff] px-6 font-semibold text-[#0d0096] transition hover:bg-[#c0c1ff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isChecking ? "检测中..." : "立即安检"}
        </button>
      </div>
      {error ? <p className="text-sm text-[#fca5a5]">{error}</p> : null}
      {!compact ? (
        <p className="text-xs text-[#9ca3af]">免费检测｜无需连接钱包｜无需签名｜不执行交易</p>
      ) : null}
    </form>
  );
}

function ScanStep({ label, state }: { label: string; state: "done" | "active" | "pending" }) {
  const styles = state === "done" ? "bg-[#1b1b23] text-[#6ee7b7]" : state === "active" ? "border border-[#c0c1ff]/30 bg-[#8083ff]/10 text-[#c0c1ff]" : "bg-[#1b1b23]/60 text-[#9ca3af]";
  const status = state === "done" ? "完成" : state === "active" ? "运行中" : "等待中";
  return <div className={`flex items-center justify-between rounded-lg p-3 text-sm ${styles}`}><span>{label}</span><span className="text-xs font-semibold">{status}</span></div>;
}
