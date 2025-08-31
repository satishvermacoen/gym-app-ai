"use client"

import { useActiveBranch } from '@/components/layout/branchSelector';
import { useMembers } from '@/hooks/members/useMember'
import React from 'react'

export default function page() {
    const {activeBranchId} = useActiveBranch();
    const branchId = activeBranchId ?? undefined;
    const {data} = useMembers({branchId:branchId, search:"", page:1, limit:10} as any)
    console.log("branchId", data);
    return (
    <div>page</div>
  )
}
