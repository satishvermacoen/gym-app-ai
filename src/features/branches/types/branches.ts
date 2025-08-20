export type OperatingHour = {
  day: string; // Monday, Tuesday, ...
  open: string; // "06:00 AM"
  close: string; // "10:00 PM"
  isOpen: boolean;
  _id: string;
};

export type Member = {
  _id: string;
  profilepic?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      pinCode?: string | number;
    };
    email?: string;
    mobileNumberMain?: string;
    alternateMobile?: string;
    physicalStats?: { weightKg?: number; heightCm?: number };
  };
  membershipInfo?: {
    membershiptype?: string;
    duration?: string;
    preferredStartDate?: string;
    specialRequests?: string;
    classInterests?: string[];
  };
  emergencyContactInfo?: {
    fullName?: string;
    relationship?: string;
    mobileNumber?: string;
  };
  paymentDetails?: string[];
  branch?: string;
  createdBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};

export type Staff = { _id: string; firstName: string; jobTitle: string };

export type BranchDashboardData = {
  _id: string;
  name: string;
  location: {
    adreessline1?: string; // note: typo in API retained for compatibility
    addressline2?: string;
    city?: string;
    state?: string;
    pinCode?: string | number;
    country?: string;
  };
  contact?: { mobile?: string; phone?: string; email?: string };
  operatingHours: OperatingHour[];
  createdAt?: string;
  staffCount?: number;
  activeMemberCount?: number;
  membershipBreakdown?: Record<string, number>;
  recentMembers: Member[];
  monthlyExpenseTotal?: number;
  staffList?: Staff[];
};

export type BranchDashboardResponse = {
  statusCode: number;
  data: BranchDashboardData;
  message: string;
  success: boolean;
};