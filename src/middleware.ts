// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const isPublic = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/sign-up");

  if (isPublic) return NextResponse.next();

  const access = req.cookies.get("accessToken")?.value;
  const refresh = req.cookies.get("refreshToken")?.value;

  if (!access && !refresh) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    if (access) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${access}` },
        // Edge runtime: credentials are not shared automatically across domains
      });
      if (res.ok) return NextResponse.next();
    }

    if (refresh) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // If your API reads refresh from cookies, include:
        credentials: "include",
      });

      if (res.ok) {
        const data = (await res.json()) as { accessToken?: string };
        if (data?.accessToken) {
          const next = NextResponse.next();
          next.cookies.set("accessToken", data.accessToken, {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: true,
          });
          return next;
        }
      }
    }
  } catch {
    // swallow and fall through to redirect
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!login|sign-up|_next/static|_next/image|favicon.ico|api/.*).*)"],
};
