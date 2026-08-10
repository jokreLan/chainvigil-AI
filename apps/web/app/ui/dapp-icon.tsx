import type { SVGProps } from "react";

export type DappIconName =
  | "alert"
  | "chart"
  | "check"
  | "copy"
  | "document"
  | "globe"
  | "home"
  | "radar"
  | "scan"
  | "shield"
  | "terminal"
  | "user"
  | "wallet";

export function DappIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: DappIconName }) {
  const paths: Record<DappIconName, React.ReactNode> = {
    alert: <path d="M12 3 2.8 20h18.4L12 3Zm0 6v4m0 3h.01" />,
    chart: <path d="M4 19V9m5 10V5m5 14v-7m5 7V3M3 19h18" />,
    check: <path d="m5 12 4 4L19 6" />,
    copy: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="1.5" />
        <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-10A1.5 1.5 0 0 0 3 5.5v10A1.5 1.5 0 0 0 4.5 17H8" />
      </>
    ),
    document: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5M9 13h6m-6 4h6" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.2 2.4 3.2 5.4 3.2 9S14.2 18.6 12 21c-2.2-2.4-3.2-5.4-3.2-9S9.8 5.4 12 3Z" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" />
      </>
    ),
    radar: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
        <path d="m12 12 6-6" />
      </>
    ),
    scan: (
      <>
        <path d="M4 9V5a1 1 0 0 1 1-1h4m6 0h4a1 1 0 0 1 1 1v4M4 15v4a1 1 0 0 0 1 1h4m6 0h4a1 1 0 0 0 1-1v-4" />
        <path d="M7 12h10" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5c0 5.2-3.2 8.5-8 10-4.8-1.5-8-4.8-8-10V6l8-3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    terminal: <path d="m5 7 4 5-4 5m7 0h7" />,
    user: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18a2 2 0 0 1 2 2v13H6a2 2 0 0 1-2-2V6.5Z" />
        <path d="M4 8h16m-5 4h6v4h-6a2 2 0 1 1 0-4Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
