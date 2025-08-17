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
      {/* App brand */}
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
      <nav className="flex-1 px-2 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm ${active ? "bg-muted font-medium" : "hover:bg-muted/60"}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-4 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          {/* <AvatarImage src={user?.avatar} alt={user?.username} /> */}
          <AvatarFallback>{(user?.username?.[0] || "U").toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{user?.fullName?.firstName ?? user?.username ?? "User"}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          <div className="mt-2 flex gap-2">
            <Link href="/(dashboard)/settings" className="text-xs underline">Edit Profile</Link>
            <Link href="/(dashboard)/billing" className="text-xs underline">Subscription</Link>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <Button variant="outline" className="w-full" onClick={logout}>Logout</Button>
      </div>
    </aside>
  )
}