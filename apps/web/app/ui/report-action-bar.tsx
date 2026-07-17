"use client";

import Link from "next/link";
import { useT } from "../i18n/locale-context";

export function ReportActionBar({
  reportUrl,
  chain,
  address,
}: {
  reportUrl: string;
  chain: string;
  address: string;
}) {
  const t = useT();

  return (
    <div className="fixed inset-x-0 bottom-16 z-30 border-t border-[#262932] bg-[#0a0b0f]/95 px-3 py-2 backdrop-blur md:bottom-0 md:px-6">
      <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto pb-1">
        <Link
          href="/check"
          className="min-h-11 shrink-0 rounded-xl bg-[#8083ff] px-4 text-sm font-semibold leading-[2.75rem] text-[#0d0096]"
        >
          {t("report.recheck")}
        </Link>
        <Link
          href="/wallet-check"
          className="min-h-11 shrink-0 rounded-xl border border-[#464554] px-4 text-sm font-semibold leading-[2.75rem] text-[#f9fafb]"
        >
          {t("report.checkWallet")}
        </Link>
        <a
          href={`#share-report`}
          className="min-h-11 shrink-0 rounded-xl border border-[#464554] px-4 text-sm font-semibold leading-[2.75rem] text-[#f9fafb]"
        >
          {t("report.share")}
        </a>
        <Link
          href="/intel"
          className="min-h-11 shrink-0 rounded-xl border border-[#eab308]/30 px-4 text-sm font-semibold leading-[2.75rem] text-[#eab308]"
        >
          {t("report.learn")}
        </Link>
        <Link href={`/token/${chain}/${address}`} className="sr-only" aria-hidden>
          {reportUrl}
        </Link>
      </div>
    </div>
  );
}
