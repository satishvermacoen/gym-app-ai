// src/app/(main)/layout.tsx
"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useHydrateUser } from "@/features/auth/hooks/use.Login.Auth";

export default function DashboardLayout({ children }: { children: React.ReactNode;}) {
  useHydrateUser(); // hydrate user in store for Navbar/Sidebar

  return (
    <div className="min-h-screen">
      <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
