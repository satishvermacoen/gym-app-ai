import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // If no tokens at all → redirect to login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // ✅ Step 1: Try validating the access token
    if (accessToken) {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: { Cookie: `accessToken=${accessToken}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        return NextResponse.next(); // User is logged in
      }
    }

    // ✅ Step 2: If access token failed, try refreshing
    if (refreshToken) {
      const refreshResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`,
        {},
        {
          headers: { Cookie: `refreshToken=${refreshToken}` },
          withCredentials: true,
        }
      );

      if (refreshResponse.status === 200 && refreshResponse.data.accessToken) {
        // Create a new response object so we can set the new accessToken cookie
        const res = NextResponse.next();
        res.cookies.set("accessToken", refreshResponse.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        });
        return res;
      }
    }
  } catch (error:any) {
    console.error("Auth middleware error:", error.message);
  }

  // If all checks fail → redirect to login
  return NextResponse.redirect(new URL("/login", req.url));
}

// Protect all routes except public ones
export const config = {
  matcher: [
    "/((?!login|sign-up|_next/static|_next/image|favicon.ico).*)",
  ],
};
