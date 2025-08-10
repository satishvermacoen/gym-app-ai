"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ 1. Check accessToken
        const meResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          withCredentials: true,
        });

        if (meResponse.status === 200) {
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Access token may be expired, trying refresh...");
      }

      // ✅ 2. Try refresh token if accessToken failed
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.status === 200 && refreshResponse.data.accessToken) {
          // Optionally store accessToken in cookies via server response
          console.log("Token refreshed successfully");
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("Refresh token invalid or expired.");
      }

      // ✅ 3. If both fail → redirect to login
      router.replace("/login");
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return<>{children}</>;
}
