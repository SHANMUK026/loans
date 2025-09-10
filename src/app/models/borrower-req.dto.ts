
export interface CreateRequest {
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  creditScore: number;
  age: number;
  salary: number;
}

export interface RequestResponse {
  id: number;
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  creditScore: number;
  age: number;
  salary: number;
}