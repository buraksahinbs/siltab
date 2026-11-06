import type { MetadataRoute } from "next";
import { firma } from "@/content/site";

// Tek sayfa landing: yalnızca kök adres.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${firma.siteUrl}/`, changeFrequency: "monthly", priority: 1 }];
}
