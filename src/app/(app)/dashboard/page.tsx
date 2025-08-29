"use client"

import React from "react"
import { SectionCards } from "@/components/dashboard/section-cards"
import { BranchInfoCard } from "@/components/main/branch/BranchInfoCard";
import { BranchInfo } from "@/types/branch";
import { useDashboard } from "@/hooks/branch/useBranches";

import { useActiveBranch } from "@/components/layout/branchSelector";


export default function Page() {

  const {activeBranchId} = useActiveBranch();
  const branchId = activeBranchId ?? undefined;
  const { data } = useDashboard(branchId);
  const demoData: BranchInfo = 
  {
  name: data?.name ?? "",
  location: {
    adreessline1: data?.location.adreessline1 ?? "",
    addressline2: data?.location.addressline2 ?? "",
    city: data?.location.city ?? "",
    state: data?.location.state ?? "",
    pinCode: data?.location.pinCode ?? "",
    country: data?.location.country ?? "",
  },
  contact: {
    mobile: data?.contact.mobile ?? "",
    phone: data?.contact.phone ?? "",
    email: data?.contact.email ?? "",
  },
  operatingHours: data?.operatingHours ?? [],
};
  // console.log({data})
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <BranchInfoCard data={demoData} />
        

          <SectionCards />
          <div className="px-4 lg:px-6">
          </div>
        </div>
      </div>
    </div>
  )
}

