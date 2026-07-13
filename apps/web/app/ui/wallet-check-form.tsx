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
          placeholder="粘贴钱包地址，进行只读体检"
          className="min-h-14 flex-1 border border-emerald-300/20 bg-white/9 px-4 text-white outline-none transition focus:border-emerald-300/70"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="min-h-14 bg-emerald-300 px-6 font-semibold text-emerald-950 transition hover:bg-emerald-200"
        >
          {isChecking ? "体检中..." : "开始体检"}
        </button>
      </div>
      {error ? <p className="text-sm text-red-200">{error}</p> : null}
      <p className="text-xs text-emerald-100/55">只读检测｜无需连接钱包｜不会请求签名</p>
    </form>
  );
}
