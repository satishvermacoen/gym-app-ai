export interface OperatingHour { 
  day: string; 
  open: string; 
  close: string; 
  isOpen: boolean; 
  _id?: string; 
}
export interface Location { 
  adreessline1: string; 
  addressline2?: string; 
  city: string; 
  state: string; 
  pinCode: string | number; 
  country: string; 
}
export interface Contact {
  mobile?: string; 
  email?: string; 
  phone?: string;
}

export type BranchInfo = {
name: string;
location: Location;
contact: Contact;
operatingHours: OperatingHour[];
};

export type MembershipBreakdown = Record<string, number>;

export interface StaffMember {
  _id: string;
  firstName: string;
  jobTitle: string;
}


export interface BranchDashboardData {
  _id: string;
  name: string;
  location: Location;
  contact: Contact;
  operatingHours: OperatingHour[];
  createdAt: string; // ISO string
  staffCount: number;
  activeMemberCount: number;
  membershipBreakdown: MembershipBreakdown;
  monthlyExpenseTotal: number;
  staffList: StaffMember[];

}

export interface BranchListItem {
  _id: string;
  name: string;
  location: Location;
  contact: Contact;
  owner: string[];
  operatingHours?: OperatingHour[];
}
