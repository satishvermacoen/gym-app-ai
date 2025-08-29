// Next.js API Route (App Router)
// Proxies logout to your Express backend and mirrors Set-Cookie deletions.

import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const BACKEND_LOGOUT = `${BACKEND_URL}/users/logout`;

export async function POST() {
  // 1) Forward the user's cookies to Express
  const cookieHeader = (await headers()).get("cookie") ?? "";

  const res = await fetch(BACKEND_LOGOUT, {
    method: "POST",
    headers: {
      cookie: cookieHeader,
      // If your Express logout expects JSON/CSRF, add here (e.g., "content-type": "application/json")
    },
    // body: JSON.stringify({ csrfToken }) // if needed
  });

  // 2) Build a safe JSON body
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : { ok: res.ok };

  const nextRes = NextResponse.json(data, { status: res.status });

  // 3) Mirror backend Set-Cookie header(s) back to the browser so cookies are cleared
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    // append supports multiple Set-Cookie headers if the backend sent more than one
    nextRes.headers.append("set-cookie", setCookie);
  }

  // 4) Also delete any app-domain cookies as a safety net
  const jar = cookies();
  for (const name of ["accessToken", "refreshToken", "user"]) {
    try {
      (await jar).delete({ name, path: "/" });
    } catch {}
  }

  return nextRes;
}
