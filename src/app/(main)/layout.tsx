"use client"

import { AppSidebar } from '@/components/app-sidebar';
import { NavUser } from '@/components/nav-user';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useUser } from '@/context/UserContext';
import React from 'react';




export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    
      <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 56)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
      <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader  />
            <main>
              {children}
            </main>
        </SidebarInset>
      </SidebarProvider>   

  );
}