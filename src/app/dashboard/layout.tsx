import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
    style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar/>
        <SidebarInset>
        <SiteHeader />
          {children}
        </SidebarInset>
    </SidebarProvider>
  )
}