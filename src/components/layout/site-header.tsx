"use client"


import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useActiveBranch } from "./branchSelector"
import { useDashboard } from "@/hooks/branch/useBranches"
import { OpenStatusBadge } from "../main/branch/atoms"
import { getTodayName, isOpenNow } from "../main/branch/utils"
import SearchBar from "../main/search/SearchBar"

export function SiteHeader() {

  const {activeBranchId} = useActiveBranch();
  const branchId = activeBranchId ?? undefined;
  const { data } = useDashboard(branchId);
  const todayName = getTodayName();
   const today = data?.operatingHours?.find((d) => d.day.toLowerCase() === todayName.toLowerCase());
  const status = isOpenNow(today);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {data?.name ?? "Dashboard"}
        </h1>
        <div className="flex-1 flex justify-center">
        <SearchBar branchId={branchId ?? null} />
      </div>
        <div className="ml-auto flex items-center gap-2">
          <OpenStatusBadge
            open={status.open}
            {...(status.closesAt !== undefined ? { closesAt: status.closesAt } : {})}
            {...(status.opensAt !== undefined ? { opensAt: status.opensAt } : {})}
          />
        </div>
      </div>
    </header>
  )
}
