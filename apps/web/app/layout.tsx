import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Inter,
  Noto_Sans_SC,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { getServerLocale } from "./i18n/server";
import { LocaleProvider } from "./i18n/locale-context";
import { buildPageMetadata, buildWebsiteJsonLd } from "./lib/seo";
import { ApiStatusBanner } from "./ui/api-status-banner";
import { JsonLd } from "./ui/json-ld";
import { ToastProvider } from "./ui/toast";
import { TrustFooter } from "./ui/trust-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});
const notoSansSc = Noto_Sans_SC({
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-sc",
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home");
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  const htmlLang = locale === "zh" ? "zh-CN" : "en";

  return (
    <html
      lang={htmlLang}
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} ${notoSansSc.variable}`}
    >
      <body>
        <JsonLd data={buildWebsiteJsonLd(locale)} />
        <LocaleProvider initialLocale={locale}>
          <ToastProvider>
            <a className="cv-skip-link" href="#main-content">
              {locale === "zh" ? "跳到主要内容" : "Skip to main content"}
            </a>
            <ApiStatusBanner />
            <div id="main-content" tabIndex={-1}>
              {children}
            </div>
            <TrustFooter />
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
