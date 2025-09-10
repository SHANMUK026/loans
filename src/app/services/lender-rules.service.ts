import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRule, RuleResponse } from '../models/lender-rule.dto';

@Injectable({
  providedIn: 'root'
})
export class LenderRulesService {
  private baseUrl = 'http://localhost:8080/lender_rules';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔍 LenderRulesService - Getting token:', token);
    
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

 
  createRule(ruleData: CreateRule): Observable<any> {
    console.log('🔍 LenderRulesService - Creating rule with headers:', this.getAuthHeaders());
    return this.http.post(`${this.baseUrl}/create`, ruleData, { headers: this.getAuthHeaders() });
  }


  updateRule(id: number, ruleData: CreateRule): Observable<any> {
    console.log('🔍 LenderRulesService - Updating rule with headers:', this.getAuthHeaders());
    return this.http.put(`${this.baseUrl}/update/${id}`, ruleData, { headers: this.getAuthHeaders() });
  }

 
  getMyRules(): Observable<RuleResponse[]> {
    console.log('🔍 LenderRulesService - Getting rules with headers:', this.getAuthHeaders());
    return this.http.get<RuleResponse[]>(`${this.baseUrl}/my-rules`, { headers: this.getAuthHeaders() });
  }

 
  deleteRule(id: number): Observable<any> {
    console.log('🔍 LenderRulesService - Deleting rule with headers:', this.getAuthHeaders());
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
  }
}