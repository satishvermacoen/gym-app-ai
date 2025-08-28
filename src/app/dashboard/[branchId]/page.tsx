"use client";

import * as React from "react";
import { useBranches } from "@/hooks/branch/useBranches";
import { findBranchBySlug } from "@/lib/branchSlug";
import { useDashboard } from "@/hooks/branch/useBranches"; // your existing hook that needs branchId

export default function DashboardClient({ branchSlug }: { branchSlug: string }) {
  const { data: branches = [], isLoading: branchesLoading, isError: branchesError } = useBranches();

  const active = React.useMemo(() => {
    if (!branches.length) return null;
    return findBranchBySlug(branchSlug, branches as any);
  }, [branches, branchSlug]);

  const branchId = active?._id;
  const { data: summary, isLoading: dashLoading, isError: dashError, error } = useDashboard(branchId);

  if (branchesLoading || dashLoading) return <div>Loading…</div>;
  if (branchesError) return <div>Failed to load branches.</div>;
  if (!active) return <div>Unknown branch.</div>;
  if (dashError) return <div>Failed to load dashboard: {(error as Error)?.message}</div>;
  if (!summary) return <div>No data.</div>;

  return (
    <section className="grid gap-3">
      <h1 className="text-xl font-semibold">Dashboard · {active.name}</h1>
      {/* render summary.cards / tables here */}
    </section>
  );
}
