// import AuthGuard from '@/components/AuthGuard';
import { AppSidebar } from '@/components/app-sidebar';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/sidebar-app';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BranchProvider } from '@/context/BranchContext';
import React from 'react';




export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BranchProvider>
        <Navbar/>
      <SidebarProvider>
        {/* <Sidebar /> */}
        <AppSidebar/>
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </BranchProvider>
  );
}