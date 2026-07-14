"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { WalletHealthResponse } from "@chainvigil/types";
import { readApiErrorMessage } from "../lib/api-error";

export function WalletCheckForm() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!address.match(/0x[a-fA-F0-9]{40}/)) {
      setError("请输入有效的 EVM 钱包地址。");
      return;
    }

    setError("");
    setIsChecking(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiBaseUrl}/api/v1/wallet/health`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          address,
          chain: "bsc",
          source: "web",
        }),
      });

      if (!response.ok) {
        throw new Error(await readApiErrorMessage(response, "钱包体检接口暂时不可用，请稍后重试。"));
      }

      const data = (await response.json()) as WalletHealthResponse;
      router.push(`/wallet/${data.report.address}/health`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "钱包体检失败，请稍后重试。");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="钱包地址"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="粘贴 BNB Smart Chain 钱包地址"
          className="min-h-14 flex-1 rounded-md border border-[#464554] bg-[#0d0d15] px-4 font-mono text-sm text-[#f9fafb] outline-none transition placeholder:text-[#6b7280] focus:border-[#8083ff] focus:ring-2 focus:ring-[#8083ff]/20"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="min-h-14 rounded-md bg-[#8083ff] px-6 font-semibold text-[#0d0096] transition hover:bg-[#c0c1ff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isChecking ? "体检中..." : "开始体检"}
        </button>
      </div>
      {error ? <p className="text-sm text-[#fca5a5]">{error}</p> : null}
      <p className="text-xs text-[#9ca3af]">只读检测｜无需连接钱包｜不会请求签名｜不执行清理</p>
    </form>
  );
}
