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
    <div className="fixed inset-x-0 z-30 border-t border-[#3b494c]/45 bg-[#0d1516]/96 px-3 py-2 backdrop-blur-xl cv-report-actions-safe md:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2 md:flex">
        <Link
          href="/check"
          className="flex min-h-11 items-center justify-center rounded-lg bg-[#c3f5ff] px-3 text-center cv-font-display text-sm font-semibold text-[#00363d]"
        >
          {t("report.recheck")}
        </Link>
        <Link
          href="/wallet-check"
          className="flex min-h-11 items-center justify-center rounded-lg border border-[#3b494c] bg-[#242b2d] px-3 text-center text-sm font-semibold text-[#dce4e5]"
        >
          {t("report.checkWallet")}
        </Link>
        <a
          href={`#share-report`}
          className="flex min-h-11 items-center justify-center rounded-lg border border-[#3b494c] bg-[#242b2d] px-3 text-center text-sm font-semibold text-[#dce4e5]"
        >
          {t("report.share")}
        </a>
        <Link
          href="/intel"
          className="flex min-h-11 items-center justify-center rounded-lg border border-[#ffc775]/35 bg-[#ffc775]/8 px-3 text-center text-sm font-semibold text-[#ffc775]"
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
