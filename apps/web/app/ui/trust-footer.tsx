import Link from "next/link";

const links = [
  ["About", "/about"],
  ["Methodology", "/methodology"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Contact", "/contact"],
] as const;

export function TrustFooter() {
  return (
    <footer className="border-t border-[#262932] bg-[#0a0b0f] px-5 py-7 text-xs text-[#9ca3af]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <p>© 2026 ChainVigil AI · Risk education, not investment advice.</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Trust and legal">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-[#f9fafb]">{label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
