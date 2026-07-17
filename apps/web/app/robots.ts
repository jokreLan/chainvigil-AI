import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

/**
 * Discovery policy:
 * - Index/crawl durable tools & education (check, chain guides, intel, learn, bot, pricing).
 * - /token/* and /wallet/* stay crawlable so share previews (OG) work, but pages set
 *   meta robots noindex (CA heat dies in days; addresses are not SEO assets).
 * - /app/* workspaces stay private.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/check",
          "/solana",
          "/bnb",
          "/token/",
          "/wallet-check",
          "/wallet/",
          "/risk-database",
          "/leaderboard/high-risk-tokens",
          "/fake-token-database",
          "/learn",
          "/pricing",
          "/developers",
          "/bot",
          "/api",
        ],
        disallow: ["/zh/app/", "/en/app/", "/login", "/admin"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
