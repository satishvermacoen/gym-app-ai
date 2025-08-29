// src/components/branchSelector.tsx
"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
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

type Branch = { _id: string; name: string; plan?: string };

type Props = {
  className?: string;
  /** controlled active branch id (optional) */
  value?: string | null;
  /**
   * fires whenever user switches branch
   * gives you the _id and the full branch object
   */
  onChange?: (branchId: string, branch: Branch) => void;
  /** localStorage key used to persist selection */
  persistKey?: string; // default: "activeBranchId"
};

export default function BranchSelector({
  className,
  value = null,
  onChange,
  persistKey = "activeBranchId",
}: Props) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: branches = [], isLoading, isError } = useBranches();

  // internal state only if not controlled
  const [internalId, setInternalId] = React.useState<string | null>(null);

  // load persisted selection once on mount
  React.useEffect(() => {
    if (value != null) return; // controlled: parent owns the state
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved) setInternalId(saved);
    } catch {}
  }, [value, persistKey]);

  // default to first branch once branches arrive
  React.useEffect(() => {
    if (value != null) return;
    if (!branches.length) return;
    setInternalId((prev) => prev ?? branches[0]!._id);
  }, [branches, value]);

  const activeBranchId = value ?? internalId ?? null;
  const active = React.useMemo(
    () => branches.find((b) => b._id === activeBranchId) ?? branches[0],
    [branches, activeBranchId]
  );

  const handleSelect = React.useCallback(
    (nextId: string) => {
      const next = branches.find((b) => b._id === nextId);
      if (!next) return;

      // persist for future visits
      try {
        localStorage.setItem(persistKey, nextId);
      } catch {}

      // update internal (if uncontrolled)
      if (value == null) setInternalId(nextId);

      // notify parent (preferred way to “export” _id)
      onChange?.(nextId, next);

      // broadcast to the app (handy for listeners/hooks)
      window.dispatchEvent(
        new CustomEvent("branch:change", {
          detail: { branchId: nextId, branch: next },
        })
      );

      // NOTE: No router.push here -> URL remains the same (e.g., /app/dashboard)
    },
    [branches, onChange, persistKey, value]
  );

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
                <span className="truncate font-medium">{active?.name ?? "Branch"}</span>
                <span className="truncate text-xs">Switch branch</span>
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

            {branches.map((b, i) => {
              const selected = b._id === active?._id;
              return (
                <DropdownMenuItem
                  key={b._id}
                  className="gap-2 p-2"
                  onClick={() => handleSelect(b._id)}
                  aria-checked={selected}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Building2 className="size-3.5 shrink-0" />
                  </div>
                  <div className="flex-1 truncate">{b.name}</div>
                  {selected ? (
                    <Check className="size-4" />
                  ) : (
                    <DropdownMenuShortcut>⌘{i + 1}</DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              );
            })}

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

/**
 * Tiny hook you can use anywhere (Dashboard, Members page, etc.)
 * It returns the current activeBranchId and the full branch object.
 *
 * Example usage with React Query:
 *   const { activeBranchId } = useActiveBranch();
 *   const { data } = useQuery({
 *     queryKey: ["dashboard", activeBranchId],
 *     queryFn: () => api.get(`/dashboard?branchId=${activeBranchId}`),
 *     enabled: !!activeBranchId,
 *   });
 */
export function useActiveBranch(persistKey = "activeBranchId") {
  const { data: branches = [], isLoading } = useBranches();
  const [activeBranchId, setActiveBranchId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // initial read from localStorage
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved) setActiveBranchId(saved);
    } catch {}
    // listen to global branch change events
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { branchId?: string };
      if (detail?.branchId) setActiveBranchId(detail.branchId);
    };
    window.addEventListener("branch:change", handler as EventListener);
    return () => window.removeEventListener("branch:change", handler as EventListener);
  }, [persistKey]);

  // if nothing chosen yet, prefer first branch once available
  React.useEffect(() => {
    if (!branches.length) return;
    setActiveBranchId((prev) => prev ?? branches[0]!._id);
  }, [branches]);

  const activeBranch =
    branches.find((b) => b._id === activeBranchId) ?? (branches[0] ?? null);

  return { activeBranchId, activeBranch, isLoading };
}
