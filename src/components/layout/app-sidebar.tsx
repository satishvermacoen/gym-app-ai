"use client"

import { AudioWaveform, Calendar, Command, GalleryVerticalEnd, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import BranchSelector from "./branchSelector"
import { NavUser } from "./nav-user"
import { useMeQuery } from "@/hooks/auth/useMeQuery"



// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Members",
    url: "/members",
    icon: Inbox,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Calendar,
  },
  {
    title: "Expenses",
    url: "/expenses",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]


export function AppSidebar() {
   const { data: currentUser } = useMeQuery();
   const avatar =
     typeof currentUser?.avatar === "string"
       ? currentUser.avatar
       : currentUser?.avatar?.url ?? "";
   const data2 = { user: {
    name: currentUser?.fullName?.firstName || "",
    email: currentUser?.email || "",
    avatar,
  } }
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <BranchSelector />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data2.user}/>
      </SidebarFooter>
    </Sidebar>
  )
}