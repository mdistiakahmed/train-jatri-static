import { MetadataRoute } from "next";
import { trainDataSummary } from "@/data/trainDataSummary";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.trainjatri.com";

  const totalChunks = 6; // Assuming 6,000 pages / 1,000 per page = 6 chunks
  const chunkSitemaps = Array.from({ length: totalChunks }).map((_, i) => ({
    url: `https://www.trainjatri.com/stations-routes-sitemap/${i}`,
    lastModified: new Date(),
  }));

  // Static routes
  const staticRoutes = [
    "",
    "/about-us",
    "/live-tracking",
    "/metro-rail",
    "/places-to-visit",
    "/stations",
    "/trains",
  ];

  // Dynamic train routes - convert train names to URL-friendly format
  const trainRoutes = trainDataSummary.map((train) => {
    const trainName = train.name.replace(/\s+/g, "-").toLowerCase();
    return {
      url: `${baseUrl}/trains/${trainName}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  // Static routes with higher priority
  const staticSitemapEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticSitemapEntries, ...trainRoutes, ...chunkSitemaps];
}
