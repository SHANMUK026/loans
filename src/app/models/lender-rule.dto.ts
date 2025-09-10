
export interface CreateRule {
  minimumSalary: number;
  minimumLoanAmount: number;
  maximumLoanAmount: number;
  interestRate: number;
  minimumCreditScore: number;
  minimumAge: number;
  maximumAge: number;
  employmentTypes: string;
  ruleStatus: string;
}

export interface RuleResponse {
  id: number;
  minimumSalary: number;
  minimumLoanAmount: number;
  maximumLoanAmount: number;
  interestRate: number;
  minimumCreditScore: number;
  minimumAge: number;
  maximumAge: number;
  employmentTypes: string;
  ruleStatus: string;
}