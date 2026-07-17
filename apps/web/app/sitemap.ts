import type { MetadataRoute } from "next";
import { geoArticleSlugs } from "./lib/geo-articles";

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: (route === "" || route === "/check" ? "daily" : "weekly") as
      | "daily"
      | "weekly",
    priority: route === "" ? 1 : route === "/check" ? 0.9 : route.startsWith("/learn") ? 0.85 : 0.7,
  }));

  const geoEntries = geoArticleSlugs.map((slug) => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...geoEntries];
}
