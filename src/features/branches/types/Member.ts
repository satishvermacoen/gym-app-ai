// A generic interface for your standard API response structure
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Interface for personal information
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  mobileNumberMain: string;
}

// Interface for membership information
export interface MembershipInfo {
  membershiptype: string;
  membershipFees?: number;
  totalReceived?: number;
  totalDues?: number;
}

// The main interface for a single Member object
export interface Member {
  _id: string;
  personalInfo: PersonalInfo;
  membershipInfo: MembershipInfo;
}

// Interface for the paginated response from the API
export interface PaginatedMembersResponse {
  docs: Member[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// The complete type for the API response containing paginated members
export type MemberListResponse = ApiResponse<PaginatedMembersResponse>;
