import type { MetadataRoute } from "next";

const BASE = "https://agentspend-alpha.vercel.app";

/**
 * Only public, indexable pages belong here. /team/[key] and /welcome are
 * keyed to a specific customer and must never be crawled.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${BASE}/guides/claude-code-usage-logs`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/guides/what-drives-claude-code-cost`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
