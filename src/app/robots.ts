import type { MetadataRoute } from "next";

const BASE = "https://agentspend-alpha.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Customer-specific surfaces. /team/<key> is readable by anyone holding
      // the key, so it must stay out of search results entirely.
      disallow: ["/team/", "/welcome", "/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
