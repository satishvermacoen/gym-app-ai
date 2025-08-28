// src/components/branchSelector.tsx
"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useBranches } from "@/hooks/branch/useBranches"; // keep your existing hook path
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
import { findBranchBySlug, replaceFirstSegment, toBranchSlug } from "@/lib/branchSlug";

type Branch = { _id: string; name: string; plan?: string };

export default function BranchSelector({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobile } = useSidebar();

  const { data: branches = [], isLoading, isError } = useBranches();

  // Read current slug from the first path segment
  const currentSlug = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts[0];
  }, [pathname]);

  // Resolve to the active branch (fallback to first)
  const active = React.useMemo(() => {
    if (!branches.length) return null;
    if (currentSlug) {
      const found = findBranchBySlug(currentSlug, branches as Branch[]);
      if (found) return found;
    }
    return branches[0] as Branch;
  }, [branches, currentSlug]);

  const goToBranch = (b: Branch) => {
    const slug = toBranchSlug(b, branches as Branch[]);
    const nextPath = pathname.startsWith("/")
      ? replaceFirstSegment(pathname, slug)
      : `/${slug}`;

    // preserve other query params except old branchId
    const params = new URLSearchParams(searchParams?.toString?.() ?? "");
    params.delete("branchId");
    const query = params.toString();
    router.push(query ? `${nextPath}?${query}` : nextPath);

    // optional: remember last-used branch
    if (typeof window !== "undefined") {
      localStorage.setItem("branchId", b._id);
    }
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

  if (isError || !branches.length) {
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
                <span className="truncate text-xs">{active?.name ?? "Branch"}</span>
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

            {(branches as Branch[]).map((b, i) => (
              <DropdownMenuItem key={b._id} className="gap-2 p-2" onClick={() => goToBranch(b)}>
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building2 className="size-3.5 shrink-0" />
                </div>
                <div className="flex-1 truncate">{b.name}</div>
                <DropdownMenuShortcut>⌘{i + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2" onClick={() => router.push("/branches/new")}>
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
