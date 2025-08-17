"use client"
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOwnedBranches } from "@/features/owners/hooks/useOwnedBranches"
import { useAuthStore } from "@/stores/auth.store"
import { Home, Users, UserCog, BarChart3, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Sidebar() {
  const { data: branches } = useOwnedBranches()
  const [branchId, setBranchId] = useState<string | null>(null)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  function handleBranchChange(id: string) {
    setBranchId(id)
    router.push(`/${id}`)
  }

  return (
    <ShadSidebar>
      <SidebarContent>
        {/* Branch Selector */}
        <div className="p-4">
          <h1 className="text-lg font-semibold mb-2">GymFusion</h1>
          <Select value={branchId || undefined} onValueChange={handleBranchChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches?.map((b: any) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nav Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(branchId ? `/${branchId}` : "/(dashboard)")}>
                <Home className="h-4 w-4" /> Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${branchId}/members`)}>
                <Users className="h-4 w-4" /> Members
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${branchId}/employees`)}>
                <UserCog className="h-4 w-4" /> Employees
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${branchId}/reports`)}>
                <BarChart3 className="h-4 w-4" /> Reports
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push(`/${branchId}/finance`)}>
                <Wallet className="h-4 w-4" /> Finance
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <div className="flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {/* <AvatarImage src={user.avatar} /> */}
                <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.fullName?.firstName} {user.fullName?.lastName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
          </div>
        )}
      </SidebarFooter>
    </ShadSidebar>
  )
}