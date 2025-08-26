// src/components/branchSelector.tsx
"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useBranches } from "@/hooks/branch/useBranches";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type Branch = {
  _id: string;
  name: string;
  // optional: plan/tier if you have it on your API for subtitle
  plan?: string;
};

export default function BranchSelector({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobile } = useSidebar();

  const { data: branches, isLoading, isError } = useBranches();

  const branchIdFromUrl = searchParams?.get("branchId") ?? undefined;
  const [activeId, setActiveId] = React.useState<string | undefined>(branchIdFromUrl);

  // initialize from URL or last-used branch
  React.useEffect(() => {
    if (!branchIdFromUrl) {
      const last = typeof window !== "undefined" ? localStorage.getItem("branchId") : null;
      if (last) setActiveId(last);
    } else {
      setActiveId(branchIdFromUrl);
    }
  }, [branchIdFromUrl]);

  // keep last used
  React.useEffect(() => {
    if (activeId) localStorage.setItem("branchId", activeId);
  }, [activeId]);

  const setBranch = (newId: string) => {
    setActiveId(newId);
    const params = new URLSearchParams(searchParams?.toString?.() ?? "");
    params.set("branchId", newId);
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg animate-pulse" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Loading branches…</span>
              <span className="truncate text-xs">Please wait</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError || !branches?.length) {
    return (
      <SidebarMenu className={className}>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" variant="outline">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">No branches</span>
              <span className="truncate text-xs">Add a branch</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const active = branches.find((b: Branch) => b._id === activeId) ?? branches[0];

  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Building2 className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{active?.name}</span>
                <span className="truncate text-xs">
                  {/* Subtitle: show plan if you have it, else static “Branch” */}
                  {active?.name ? "Branch" : "Select branch"}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Branches
            </DropdownMenuLabel>

            {branches.map((b: Branch, index: number) => (
              <DropdownMenuItem
                key={b._id}
                onClick={() => setBranch(b._id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building2 className="size-3.5 shrink-0" />
                </div>
                <div className="flex-1 truncate">{b.name}</div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {/* Optional: route to “create branch” page if you have one */}
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                // change this route if your app uses a different path
                router.push("/branches/new");
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add branch</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
