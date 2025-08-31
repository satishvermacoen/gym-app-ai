"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useMembers } from "@/hooks//members/useMember";
import { SearchInput } from "@/components/main/members/SearchInput";
import { MembersTable } from "@/components/main/members/MembersTable";
import { PaginationLite } from "@/components/main/members/PaginationLite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { useActiveBranch } from "@/components/layout/branchSelector";

export default function MembersPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const qFromUrl = sp.get("q") ?? "";
  const pageFromUrl = Number(sp.get("page") ?? "1");

  const [search, setSearch] = React.useState(qFromUrl);
  const [page, setPage] = React.useState(pageFromUrl);
  const limit = 10;

  const debouncedSearch = useDebouncedValue(search, 400);
  const {activeBranchId} = useActiveBranch();
  const branchId = activeBranchId ?? undefined;
  const { data, isFetching, isLoading } = useMembers({ branchId: branchId!, search: debouncedSearch, page, limit });
//  console.log("branchId", data);
  React.useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    if (search) params.set("q", search); else params.delete("q");
    params.set("page", String(page));
    if (branchId) params.set("branchId", branchId); else params.delete("branchId");
    // router.replace(`/members?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, branchId]);

  // Require branch selection before fetching
  if (!branchId) {
    return (
      <Alert className="max-w-2xl">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Select a branch</AlertTitle>
        <AlertDescription>
          Choose a branch from the Branch Selector to load its members list.
        </AlertDescription>
      </Alert>
    );
  }

  const total = data?.meta?.total;
  const hasNextPage = data?.meta?.hasNextPage;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-xl">Members</CardTitle>
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} isSearching={isFetching} />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
              <MembersTable rows={data?.members ?? []} baseHref="/app/members" />
              <PaginationLite
                page={page}
                limit={limit}
                total={total}
                hasNextPage={hasNextPage}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}