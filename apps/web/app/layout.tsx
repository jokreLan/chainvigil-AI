import type { Metadata } from "next";
import "./globals.css";
import { getServerLocale } from "./i18n/server";
import { LocaleProvider } from "./i18n/locale-context";
import { buildPageMetadata, buildWebsiteJsonLd } from "./lib/seo";
import { ApiStatusBanner } from "./ui/api-status-banner";
import { JsonLd } from "./ui/json-ld";
import { ToastProvider } from "./ui/toast";
import { TrustFooter } from "./ui/trust-footer";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home");
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  const htmlLang = locale === "zh" ? "zh-CN" : "en";

  return (
    <html lang={htmlLang}>
      <body>
        <JsonLd data={buildWebsiteJsonLd(locale)} />
        <LocaleProvider initialLocale={locale}>
          <ToastProvider>
            <ApiStatusBanner />
            {children}
            <TrustFooter />
          </ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
