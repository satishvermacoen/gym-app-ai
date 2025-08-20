// src/components/shell/Sidebar.tsx
"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useBranchStore } from "@/stores/branch.store"
import { useAuthStore } from "@/stores/auth.store"
import BranchSelector from "@/components/shell/BranchSelector"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Sidebar() {
  const activeBranchId = useBranchStore((s) => s.activeBranchId)
  const { user, logout } = useAuthStore((s) => ({ user: s.user, logout: s.logout }))
  const pathname = usePathname()

  const nav = useMemo(() => {
    const base = activeBranchId ? `/${activeBranchId}` : "/(dashboard)"
    return [
      { label: "Dashboard", href: base },
      { label: "Members", href: `${base}/members` },
      { label: "Employees", href: `${base}/employees` },
      { label: "Reports", href: `${base}/reports` },
      { label: "Finance", href: `${base}/finance` },
    ]
  }, [activeBranchId])

  return (
    <aside className="h-screen w-72 shrink-0 border-r bg-background hidden md:flex md:flex-col">
      {/* App name */}
      <div className="px-4 py-4">
        <Link href="/(dashboard)" className="text-xl font-bold tracking-tight">
          GymFusion
        </Link>
      </div>
      <Separator />

      {/* Branch selector */}
      <div className="px-4 py-4">
        <BranchSelector />
      </div>
      <Separator />

      {/* Nav */}
      <nav className="px-2 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm ${
                active ? "bg-muted font-medium" : "hover:bg-muted/60"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* push user area to the bottom */}
      <div className="mt-auto" />
      <Separator />

      {/* User info + logout at bottom */}
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/60">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>{(user?.fullName?.firstName || "U")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 text-left">
                <div className="text-sm font-medium truncate">
                  {user?.fullName?.firstName ?? user?.username ?? "User"}
                </div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
            <DropdownMenuLabel className="truncate">Signed in as {user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/(dashboard)/settings">Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/(dashboard)/billing">Subscription</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="pt-3">
          <Button variant="outline" className="w-full" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}
