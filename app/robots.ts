import type { MetadataRoute } from "next";
import { firma } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${firma.siteUrl}/sitemap.xml`,
    host: firma.siteUrl,
  };
}
