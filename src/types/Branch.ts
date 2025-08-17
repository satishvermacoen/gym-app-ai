// A generic interface for your standard API response structure
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Interface for the nested location object
export interface Location {
  adreessline1: string;
  addressline2: string;
  city: string;
  state: string;
  pinCode: number | null;
  country: string;
}

// Interface for the nested contact object
export interface Contact {
  mobile: string;
  phone: string;
  email: string;
}

// Interface for each entry in the operatingHours array
export interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
  _id: string;
}

// The main interface for a single Branch object
export interface Branch {
  location: Location;
  contact: Contact;
  _id: string;
  name: string;
  owner: string[];
  operatingHours: OperatingHours[];
  staff: any[]; // You can define a more specific 'Staff' interface if needed
  createdAt: string; // Or Date if you plan to parse it
  updatedAt: string; // Or Date
  __v: number;
}

// The complete type for the API response containing an array of branches
export type BranchListResponse = ApiResponse<Branch[]>;