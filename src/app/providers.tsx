"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // create client per mount to avoid SSR mismatch
  const [client] = useState(() => new QueryClient());
  return ( 
    <QueryClientProvider client={client}>
      {children}
      <Toaster />
    </QueryClientProvider>
    )
}
