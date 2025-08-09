"use client"; // This is a client component

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * This component checks if a user is authenticated before rendering its children.
 * It's designed to be used within a layout to protect a group of routes.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      // If no token, redirect to the login page
      router.replace('/login');
    } else {
      // User is authenticated, so we can show the page
      setIsLoading(false);
    }
  }, [router, pathname]); // Re-run check if route changes

  // While checking, show a loading indicator
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If authenticated, render the children (the actual page)
  return <>{children}</>;
}