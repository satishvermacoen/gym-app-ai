"use client"

import { data } from '@/context/data'
// import BranchDashboard from '@/features/branches/components/dashboard'
import React from 'react'
import { BranchDashboardData } from '@/features/branches/types/branches'
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"



export const page = () => {
  const defaultBranchData: BranchDashboardData = data[0].data
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  )
}
export default page
// <>
// <div className="text-center p-6">
//   <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
//   <p className="mt-4 text-lg">This is your dashboard where you can manage your branches.</p>
// </div>
// <BranchDashboard data={defaultBranchData} />
// </>