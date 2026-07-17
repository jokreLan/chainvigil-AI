"use client";

import { useT } from "./i18n/locale-context";

export default function Loading() {
  const t = useT();

  return (
    <main aria-live="polite" className="min-h-screen bg-[#0a0b0f] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-6 w-40 rounded bg-[#262932]" />
        <div className="h-11 max-w-md rounded bg-[#262932]" />
        <div className="h-24 max-w-2xl rounded bg-[#1d2027]" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-40 rounded-lg border border-[#262932] bg-[#16181d]" />
          <div className="h-40 rounded-lg border border-[#262932] bg-[#16181d]" />
          <div className="h-40 rounded-lg border border-[#262932] bg-[#16181d]" />
        </div>
      </div>
      <p className="sr-only">{t("common.loading")}</p>
    </main>
  );
}
