// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/sign-up"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Let public paths straight through
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // Cheap auth gate: presence of either token
  const access = req.cookies.get("accessToken")?.value;
  const refresh = req.cookies.get("refreshToken")?.value;

  if (!access && !refresh) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Run on everything except Next internals, assets, API, and your public pages
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|fonts|images|api|login|sign-up).*)",
  ],
};
