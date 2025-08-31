import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/api-route";
import { useActiveBranch } from "@/components/layout/branchSelector";


export type MemberListParams = {
branchId: string; // REQUIRED by backend path
search?: string;
page?: number;
limit?: number;
status?: string;
};


export async function fetchMembers(params: MemberListParams) {
    const {activeBranchId} = useActiveBranch();
    const branchId = activeBranchId ?? undefined; 
    const { search = "", page = 1, limit = 10, status } = params;
    if (!branchId) throw new Error("branchId is required to list members");


    const url = API_ROUTES.members.list(branchId);
    const res = await api.get(url, { params: { search, page, limit, status } });


    // Normalize flexible shapes
    const body = res.data || {};
    const members = body.members ?? body.items ?? [];
    const meta = body.meta ?? {
    total: body.total ?? members.length,
    page,
    limit,
    hasNextPage:
    typeof body.hasNextPage === "boolean" ? body.hasNextPage : members.length === limit,
    };
    
    return { members, meta };
}


export async function fetchMemberById(memberId: string) {
    const url = API_ROUTES.members.info(memberId);
    const res = await api.get(url);
    return res.data; // interceptor already unwraps when present
}


// ——— Extras mapped to your routes ———
export async function createMember(branchId: string, form: FormData) {
    const url = API_ROUTES.members.create(branchId);
    // ensure field name matches multer key: `profilepic`
    const res = await api.post(url, form, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data;
}


export async function updateMember(memberId: string, form: FormData) {
    const url = API_ROUTES.members.update(memberId);
    const res = await api.patch(url, form, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data;
}


export async function membershipPaymentDetails(memberId: string, payload: unknown) {
    const url = API_ROUTES.members.payments(memberId);
    const res = await api.post(url, payload);
    return res.data;
}


export async function toggleMemberStatus(memberId: string) {
    const url = API_ROUTES.members.toggleStatus(memberId);
    const res = await api.patch(url);
    return res.data;
}