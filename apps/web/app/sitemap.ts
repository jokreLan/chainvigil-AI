import type { MetadataRoute } from "next";

const staticRoutes = [
  "",
  "/check",
  "/wallet-check",
  "/risk-database",
  "/leaderboard/high-risk-tokens",
  "/fake-token-database",
  "/learn",
  "/pricing",
  "/developers",
  "/bot",
  "/api",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/check" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/check" ? 0.9 : 0.7,
  }));
}
