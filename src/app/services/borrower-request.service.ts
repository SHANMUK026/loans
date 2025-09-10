import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRequest, RequestResponse } from '../models/borrower-req.dto';

@Injectable({
  providedIn: 'root'
})
export class BorrowerRequestService {
  private baseUrl = 'http://localhost:8080/borrower_request';

  constructor(private http: HttpClient) {}


  createRequest(requestData: CreateRequest): Observable<any> {
    return this.http.post(this.baseUrl, requestData);
  }

  getMyRequests(): Observable<RequestResponse[]> {
    return this.http.get<RequestResponse[]>(this.baseUrl);
  }
}