import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRule, RuleResponse } from '../models/lender-rule.dto';

@Injectable({
  providedIn: 'root'
})
export class LenderRulesService {
  private baseUrl = 'http://localhost:8080/lender_rules';

  constructor(private http: HttpClient) {}

 
  createRule(ruleData: CreateRule): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, ruleData);
  }


  updateRule(id: number, ruleData: CreateRule): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, ruleData);
  }

 
  getMyRules(): Observable<RuleResponse[]> {
    return this.http.get<RuleResponse[]>(`${this.baseUrl}/my-rules`);
  }

 
  deleteRule(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}