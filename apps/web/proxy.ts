import { NextRequest, NextResponse } from "next/server";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
} from "./app/i18n/config";

const publicFile = /\.[a-z0-9]+$/i;
const unlocalizedRoutes = new Set([
  "/health",
  "/manifest.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/referral") ||
    unlocalizedRoutes.has(pathname) ||
    publicFile.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const pathLocale = segments[1];
  if (isLocale(pathLocale)) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/${segments.slice(2).join("/")}`.replace(/\/+$/, "") || "/";
    const headers = new Headers(request.headers);
    headers.set("x-chainvigil-locale", pathLocale);
    const response = NextResponse.rewrite(rewritten, { request: { headers } });
    response.cookies.set(localeCookieName, pathLocale, {
      path: "/",
      maxAge: 31_536_000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const localized = request.nextUrl.clone();
  localized.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(localized, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
