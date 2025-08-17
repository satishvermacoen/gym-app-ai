"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOwnedBranches } from "@/features/owners/hooks/useOwnedBranches"
import { useBranchStore } from "@/stores/branch.store"
import { useRouter, usePathname } from "next/navigation"

export default function BranchSelector() {
  const { data, isLoading } = useOwnedBranches()
  const activeBranchId = useBranchStore((s) => s.activeBranchId)
  const setActiveBranchId = useBranchStore((s) => s.setActiveBranchId)
  const router = useRouter()
  const pathname = usePathname()

  function goToBranch(id: string) {
    setActiveBranchId(id)
    // If current path already contains a branch segment, replace it; otherwise go to /[branchId]
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length && parts[0] !== "(dashboard)") {
      parts[0] = id
      router.push("/" + parts.join("/"))
    } else {
      router.push(`/${id}`)
    }
  }

  return (
    <Select value={activeBranchId ?? undefined} onValueChange={goToBranch} disabled={isLoading || !data?.length}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Loading branches…" : "Select branch"} />
      </SelectTrigger>
      <SelectContent>
        {data?.map((b: any) => (
          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
