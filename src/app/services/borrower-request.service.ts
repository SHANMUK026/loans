import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRequest, RequestResponse } from '../models/borrower-req.dto';

@Injectable({
  providedIn: 'root'
})
export class BorrowerRequestService {
  private baseUrl = 'http://localhost:8080/borrower_request';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('🔍 BorrowerRequestService - Getting token:', token);
    
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


  createRequest(requestData: CreateRequest): Observable<any> {
    console.log('🔍 BorrowerRequestService - Creating request with headers:', this.getAuthHeaders());
    return this.http.post(this.baseUrl, requestData, { headers: this.getAuthHeaders() });
  }

  getMyRequests(): Observable<RequestResponse[]> {
    console.log('🔍 BorrowerRequestService - Getting requests with headers:', this.getAuthHeaders());
    return this.http.get<RequestResponse[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }
}