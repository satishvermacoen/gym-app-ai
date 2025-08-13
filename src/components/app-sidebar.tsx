"use client";

import { Home, Users, Briefcase, BarChart, Settings, Building } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useBranch } from "@/context/BranchContext";
import { useSidebar } from "@/components/ui/sidebar"; // shadcn sidebar hook

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Members", url: "/members", icon: Users },
  { title: "Employees", url: "/employees", icon: Briefcase },
  { title: "Reports", url: "/reports", icon: BarChart },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { branches, selectedBranch, setSelectedBranch } = useBranch();
  const { collapsed } = useSidebar(); // tells us if sidebar is collapsed

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col justify-between h-full">
        <div>
          {/* Branch Selector / Icon */}
          <div className="p-4 border-b flex items-center justify-center">
            {collapsed ? (
              <Building className="h-5 w-5 text-gray-600" />
            ) : (
              <Select value={selectedBranch || ""} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Menu */}
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t flex items-center gap-3">
          <Avatar>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div>
              <p className="font-medium">John Doe</p>
              <Link href="/profile" className="text-sm text-gray-500 hover:underline">
                Manage Profile
              </Link>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
