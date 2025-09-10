
export interface EligibleLender {
  lenderId: number;
  ruleId: number;
  name: string;
  interestRate: number;
  minimumLoanAmount: number;
  maximumLoanAmount: number;
}

export interface LoanApplication {
  loanApplicationId: number;
  loanPurpose: string;
  borrowerName: string;
  status: string;
  loanAmount: number;
  creditScore: number;
  age: number;
  employmentStatus: string;
}

export interface MyApplication {
  loanApplicationId: number;
  loanPurpose: string;
  borrowerName: string;
  status: string;
  loanAmount: number;
  lenderCompanyName: string;
  interestRate: number;
}