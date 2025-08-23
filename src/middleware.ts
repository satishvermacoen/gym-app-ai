// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Public routes
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/");

  if (isPublic) return NextResponse.next();

  // Only protect app area
  if (!pathname.startsWith("/app")) return NextResponse.next();

  const access = req.cookies.get("accessToken")?.value;
  const refresh = req.cookies.get("refreshToken")?.value;

  if (!access && !refresh) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // (Optional) If you want a cheap “is token present” check only, stop here:
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"], // keep middleware focused
};
