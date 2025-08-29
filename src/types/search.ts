export type SearchEntity = "all" | "members" | "employees" | "branches";

export interface SearchAllResponse {
  success: boolean;
  data: {
    members: Array<{
      _id: string;
      branch?: string;
      email?: string;
      memberId?: string;
      fullName?: { firstName?: string; lastName?: string };
      contact?: { mobile?: string };
    }>;
    employees: Array<{
      _id: string;
      branch?: string;
      email?: string;
      role?: string;
      fullName?: { firstName?: string; lastName?: string };
    }>;
    branches: Array<{
      _id: string;
      name?: string;
      code?: string;
      city?: string;
      state?: string;
    }>;
  };
}

export interface SearchSingleResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}