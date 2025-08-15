"use client";

import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { UserContext, UserContextType } from "./UserContext";
import { getCurrentUser, logOut } from "@/lib/api/User-Respone";
import { User } from "@/lib/types/User";

/**
 * Provides user-related data (like the current user) to all child components.
 * It fetches user data on initial load and handles user logout.
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The provider component.
 */
export const UserContextProvider = ({
  children,
}: {
  children: ReactNode;
}): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetches the current user's data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getCurrentUser();
        if (response.data && response.data.success) {
          setUser(response.data.data);
        } else {
          setUser(null);
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null); // Clear user data on error
        localStorage.removeItem("accessToken");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handles user logout
  const logout = useCallback(async () => {
    // Immediately update UI for a better user experience
    setUser(null);
    localStorage.removeItem("accessToken");
    router.push("/login");

    try {
      await logOut({}); // Perform the API call in the background
    } catch (error) {
      console.error("Logout API call failed:", error);
      // The user is already logged out on the client-side
    }
  }, [router]);

  const value: UserContextType = {
    user,
    setUser,
    isLoading,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
