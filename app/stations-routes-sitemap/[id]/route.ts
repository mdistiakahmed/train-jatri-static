import { NextResponse } from "next/server";
import { createFilenameFromRoute } from "@/utils/stringutils";

export const runtime = "edge";

const BASE_URL = "https://www.trainjatri.com";
const PAGE_SIZE = 1000;

let cachedRoutes: any = null;
const CDN_BASE_URL = "https://pub-a48b3342350946d49e7b66b624db1328.r2.dev";

async function getAllRouteSlugs() {
  try {
    if (cachedRoutes) return cachedRoutes;

    const res = await fetch(`${CDN_BASE_URL}/all-trips.json`, {
      next: { revalidate: 86400 }, // cache 1 day
    });

    if (!res.ok) return null;

    const data = await res.json();
    cachedRoutes = data.routes.map((entry: any) =>
      createFilenameFromRoute(entry.route),
    );
    return cachedRoutes;
  } catch (error) {
    return null;
  }
}

export async function generateSitemaps() {
  const routes = await getAllRouteSlugs();
  const total = Math.ceil(routes!.length / PAGE_SIZE);
  return Array.from({ length: total }).map((_, i) => ({ id: i }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idNum = parseInt(id);

  const routes = await getAllRouteSlugs();
  const start = idNum * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const subset = routes!.slice(start, end);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${subset
  .map((slug: string) => {
    const [from] = slug.split("-to-");
    return `  <url>
    <loc>${BASE_URL}/stations/${from}/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
