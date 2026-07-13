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
          className="min-h-14 flex-1 border border-emerald-300/20 bg-white/9 px-4 text-white outline-none transition focus:border-emerald-300/70"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="min-h-14 bg-emerald-300 px-6 font-semibold text-emerald-950 transition hover:bg-emerald-200"
        >
          {isChecking ? "检测中..." : "立即安检"}
        </button>
      </div>
      {error ? <p className="text-sm text-red-200">{error}</p> : null}
      {!compact ? (
        <p className="text-xs text-emerald-100/55">免费检测｜无需连接钱包｜无需签名｜不执行交易</p>
      ) : null}
    </form>
  );
}
