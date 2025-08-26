export interface OperatingHour { day: string; open: string; close: string; isOpen: boolean; _id?: string; }
export interface Location { adreessline1: string; addressline2?: string; city: string; state: string; pinCode: string | number; }
export interface Contact { mobile?: string; email?: string; }

export interface BranchDashboardData {
  _id: string;
  name: string;
  owner: string[];                 // ids
  location: Location;
  contact: Contact;
  operatingHours?: OperatingHour[];
  // add other fields you actually use in UI here
}

export interface BranchListItem {
  _id: string;
  name: string;
  location: Location;
  contact: Contact;
  owner: string[];
  operatingHours?: OperatingHour[];
}
