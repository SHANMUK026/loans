import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EligibleLender, LoanApplication, MyApplication } from '../models/loan-application.dto';

@Injectable({
  providedIn: 'root'
})
export class LoanApplicationService {
  private baseUrl = 'http://localhost:8080/loans';

  constructor(private http: HttpClient) {}

  
  getEligibleLenders(requestId: number, salary: number): Observable<EligibleLender[]> {
    return this.http.get<EligibleLender[]>(`${this.baseUrl}/${requestId}/eligible-lenders?salary=${salary}`);
  }

 
  applyForLoan(requestId: number, ruleId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply/request/${requestId}/rule/${ruleId}`, {});
  }

  
  updateLoanStatus(loanId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-status/${loanId}?status=${status}`, {});
  }

  
  getLenderApplications(): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${this.baseUrl}/borrower-applications`);
  }

  
  getBorrowerApplications(): Observable<MyApplication[]> {
    return this.http.get<MyApplication[]>(`${this.baseUrl}/borrower/my-applications`);
  }
}