import type { MetadataRoute } from "next";
import { geoArticleSlugs } from "./lib/geo-articles";
import { locales } from "./i18n/config";

export const dynamic = "force-dynamic";

/**
 * Durable SEO/GEO surfaces only.
 * Do NOT list /token/* or /wallet/* — per-CA pages are share tools (noindex).
 */
const staticRoutes = [
  "",
  "/check",
  "/solana",
  "/bnb",
  "/wallet-check",
  "/risk-database",
  "/leaderboard/high-risk-tokens",
  "/fake-token-database",
  "/learn",
  "/pricing",
  "/developers",
  "/bot",
  "/api",
  "/intel",
  "/about",
  "/methodology",
  "/privacy",
  "/terms",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();

  const localizedEntry = (route: string) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [
        locale === "zh" ? "zh-CN" : locale,
        `${baseUrl}/${locale}${route}`,
      ]),
    );
    return locales.map((locale) => ({
      locale,
      url: `${baseUrl}/${locale}${route}`,
      languages,
    }));
  };
  const staticEntries = staticRoutes.flatMap((route) => {
    const isHub =
      route === "/leaderboard/high-risk-tokens" ||
      route === "/fake-token-database" ||
      route === "/risk-database";
    const changeFrequency = (
      route === "" || route === "/check" || isHub ? "daily" : "weekly"
    ) as "daily" | "weekly";
    return localizedEntry(route).map(({ url, languages }) => ({
      url,
      lastModified: now,
      changeFrequency,
      priority:
        route === ""
          ? 1
          : route === "/check"
            ? 0.9
            : isHub
              ? 0.85
              : route.startsWith("/learn")
                ? 0.85
                : 0.7,
      alternates: { languages },
    }));
  });

  const geoEntries = geoArticleSlugs.flatMap((slug) =>
    localizedEntry(`/learn/${slug}`).map(({ url, languages }) => ({
      url,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages },
    })),
  );

  return [...staticEntries, ...geoEntries];
}
