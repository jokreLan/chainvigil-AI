import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/check",
          "/token/",
          "/wallet-check",
          "/risk-database",
          "/leaderboard/high-risk-tokens",
          "/fake-token-database",
          "/learn",
          "/pricing",
          "/developers",
          "/bot",
          "/api",
        ],
        disallow: ["/app/", "/login", "/admin"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
