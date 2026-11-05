import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { investigations } from "@/content/investigations";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.4 },
    ...investigations.map((i) => ({
      url: `${siteUrl}/investigations/${i.slug}`,
      lastModified: new Date(i.published),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
