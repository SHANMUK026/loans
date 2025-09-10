
export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}


export interface BorrowerDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}


export interface LenderDetails {
  firstName: string;
  lastName: string;
  companyName: string;
  licenseNumber: string;
  phoneNumber: string;
  address: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  role: string;
  lender?: LenderDetails;
  borrower?: BorrowerDetails;
}