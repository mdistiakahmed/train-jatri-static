import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTE_URL_SUFFIX } from "@/utils/stringutils";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/stations\/([^/]+)\/([^/]+)$/);

  if (!match) {
    return NextResponse.next();
  }

  const [, station, slug] = match;

  if (slug.includes("-to-") && !slug.endsWith(ROUTE_URL_SUFFIX)) {
    const url = request.nextUrl.clone();
    url.pathname = `/stations/${station}/${slug}${ROUTE_URL_SUFFIX}`;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/stations/:name/:slug"],
};
