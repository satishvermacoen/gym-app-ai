"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMemberById, fetchMembers, type MemberListParams } from "@/services/member/members.service";


export function useMembers(params: MemberListParams) {
return useQuery({
queryKey: ["members", params],
queryFn: () => fetchMembers(params),
enabled: !!params.branchId,
keepPreviousData: true,
staleTime: 30_000,
});
}


export function useMember(memberId?: string) {
return useQuery({
queryKey: ["member", memberId],
queryFn: () => fetchMemberById(memberId!),
enabled: !!memberId,
staleTime: 30_000,
});
}