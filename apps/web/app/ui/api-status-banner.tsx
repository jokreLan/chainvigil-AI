"use client";

import { useEffect, useState } from "react";
import { useT } from "../i18n/locale-context";

export function ApiStatusBanner() {
  const t = useT();
  const [down, setDown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

    async function probe() {
      try {
        const response = await fetch(`${apiBaseUrl}/health`, {
          signal: AbortSignal.timeout(4000),
          cache: "no-store",
        });
        if (!cancelled) setDown(!response.ok);
      } catch {
        if (!cancelled) setDown(true);
      }
    }

    void probe();
    const timer = window.setInterval(probe, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!down) return null;

  return (
    <div
      role="status"
      className="border-b border-[#f59e0b]/35 bg-[#f59e0b]/10 px-4 py-2 text-center text-xs text-[#fde68a] md:text-sm"
    >
      {t("api.banner")}
    </div>
  );
}
