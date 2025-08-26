// src/components/BranchAwareLink.tsx
"use client";
import Link from "next/link";
import * as React from "react";
import { useSearchParams } from "next/navigation";

export function BranchAwareLink(
  { href, children, ...rest }:
  { href: string; children: React.ReactNode } & React.ComponentProps<typeof Link>
) {
  const searchParams = useSearchParams();
  const branchId = searchParams.get("branchId");
  const url = React.useMemo(() => {
    if (!branchId) return href;
    const u = new URL(href, "http://dummy");
    u.searchParams.set("branchId", branchId);
    return `${u.pathname}${u.search}`;
  }, [href, branchId]);
  return <Link href={url} {...rest}>{children}</Link>;
}
