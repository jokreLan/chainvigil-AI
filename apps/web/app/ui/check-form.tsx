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
