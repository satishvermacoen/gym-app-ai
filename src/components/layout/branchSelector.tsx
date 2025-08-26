"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useBranches } from "@/hooks/branch/useBranches";
import { useMeQuery } from "@/hooks/auth/useMeQuery";
import { fetchBranches } from "@/services/branch/branch.service";

export default function BranchSelector({ className }: { className?: string }) {

  // const {data} = useMeQuery();
  //   const branchesaa = data?.ownedBranches || [];


  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: branches, isLoading, isError, error } = useBranches();
    // console.log(data, isError, isLoading, error);?
  const currentFromUrl = searchParams.get("branchId") ?? undefined;
  const [value, setValue] = React.useState<string | undefined>(currentFromUrl);

  React.useEffect(() => {
    if (!currentFromUrl) {
      const last = typeof window !== "undefined" ? localStorage.getItem("branchId") : null;
      if (last) setValue(last);
    } else {
      setValue(currentFromUrl);
    }
  }, [currentFromUrl]);

  React.useEffect(() => {
    if (value) localStorage.setItem("branchId", value);
  }, [value]);

  const onChange = (newVal: string) => {
    setValue(newVal);
    const params = new URLSearchParams(searchParams.toString());
    params.set("branchId", newVal);
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) return <div className={className}>Loading branches…</div>;
  if (!branches?.length) return <div className={className}>No branches</div>;

  return (
    <select className={className} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>Select branch…</option>
      {branches.map((b) => (
        <option key={b._id} value={b._id}>{b.name}</option>
      ))}
    </select>
  );
}
