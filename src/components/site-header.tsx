"use client"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SiteHeader() {
  const [dateTime, setDateTime] = useState(new Date())
  const workspaces = ["Acme Inc.", "FitLife Gym", "Zenith Fitness", "Core Strength Co."]
  const [workspace, setWorkspace] = useState(workspaces[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDateTime = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = date.toLocaleString("en-US", { month: "short" })
    const year = date.getFullYear()
    const time = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    return `${day} ${month} ${year} • ${time}`
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Workspace Dropdown in place of Documents */}
        <Select value={workspace} onValueChange={setWorkspace}>
          <SelectTrigger className="w-[200px] flex items-center gap-2">
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((ws) => (
              <SelectItem key={ws} value={ws}>
                {ws}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Bar with Button */}
        <div className="flex-1 px-4 flex gap-2">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full"
          />
          <Button variant="default" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Date & Time */}
        <div className="ml-auto flex items-center gap-2 text-sm font-medium">
          {formatDateTime(dateTime)}
        </div>
      </div>
    </header>
  )
}
