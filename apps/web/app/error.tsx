"use client";

import Link from "next/link";
import { useT } from "./i18n/locale-context";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  return (
    <main className="min-h-screen bg-[#0a0b0f] px-5 py-12 md:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center rounded-lg border border-[#262932] bg-[#16181d] p-6 md:p-10">
        <p className="text-sm font-semibold text-[#f59e0b]">PAGE UNAVAILABLE</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">
          {t("error.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-[#c7c4d7]">{t("error.body")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-[#8083ff] px-5 py-3 font-semibold text-[#0d0096] transition hover:bg-[#c0c1ff]"
          >
            {t("common.retry")}
          </button>
          <Link
            href="/check"
            className="rounded-md border border-[#464554] px-5 py-3 font-semibold text-[#f9fafb] hover:border-[#8083ff]"
          >
            {t("error.goCheck")}
          </Link>
        </div>
      </div>
    </main>
  );
}
