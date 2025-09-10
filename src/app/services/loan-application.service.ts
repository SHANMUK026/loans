import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EligibleLender, LoanApplication, MyApplication } from '../models/loan-application.dto';

@Injectable({
  providedIn: 'root'
})
export class LoanApplicationService {
  private baseUrl = 'http://localhost:8080/loans';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔍 LoanApplicationService - Getting token:', token);
    
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  
  getEligibleLenders(requestId: number, salary: number): Observable<EligibleLender[]> {
    // Ensure requestId is a valid number
    const validRequestId = Number(requestId);
    if (isNaN(validRequestId) || validRequestId <= 0) {
      throw new Error('Invalid request ID');
    }
    
    console.log('🔍 LoanApplicationService - Getting eligible lenders for request:', validRequestId);
    console.log('🔍 LoanApplicationService - URL:', `${this.baseUrl}/${validRequestId}/eligible-lenders`);
    
    return this.http.get<EligibleLender[]>(`${this.baseUrl}/${validRequestId}/eligible-lenders`, { headers: this.getAuthHeaders() });
  }

 
  applyForLoan(requestId: number, ruleId: number): Observable<any> {
    console.log('🔍 LoanApplicationService - Applying for loan with headers:', this.getAuthHeaders());
    return this.http.post(`${this.baseUrl}/apply/request/${requestId}/rule/${ruleId}`, {}, { headers: this.getAuthHeaders() });
  }

  
  updateLoanStatus(loanId: number, status: string): Observable<any> {
    console.log('🔍 LoanApplicationService - Updating loan status with headers:', this.getAuthHeaders());
    return this.http.put(`${this.baseUrl}/update-status/${loanId}?status=${status}`, {}, { headers: this.getAuthHeaders() });
  }

  
  getLenderApplications(): Observable<LoanApplication[]> {
    console.log('🔍 LoanApplicationService - Getting lender applications with headers:', this.getAuthHeaders());
    return this.http.get<LoanApplication[]>(`${this.baseUrl}/borrower-applications`, { headers: this.getAuthHeaders() });
  }

  
  getBorrowerApplications(): Observable<MyApplication[]> {
    console.log('🔍 LoanApplicationService - Getting borrower applications with headers:', this.getAuthHeaders());
    return this.http.get<MyApplication[]>(`${this.baseUrl}/borrower/my-applications`, { headers: this.getAuthHeaders() });
  }
}