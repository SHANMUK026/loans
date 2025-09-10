import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginData);
  }

  
  register(registerData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, registerData);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      console.log('🔍 AuthService - getToken called, returning:', token);
      return token;
    }
    console.log('🔍 AuthService - getToken called, window or localStorage undefined');
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      console.log('🔍 AuthService - setToken called with:', token);
      localStorage.setItem('token', token);
      console.log('🔍 AuthService - Token stored, verifying:', localStorage.getItem('token'));
    } else {
      console.log('🔍 AuthService - setToken called, window or localStorage undefined');
    }
  }

  removeToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      console.log('🔍 AuthService - removeToken called');
      localStorage.removeItem('token');
    } else {
      console.log('🔍 AuthService - removeToken called, window or localStorage undefined');
    }
  }

  isLoggedIn(): boolean {
    const loggedIn = !!this.getToken();
    console.log('🔍 AuthService - isLoggedIn called, returning:', loggedIn);
    return loggedIn;
  }

  logout(): void {
    this.removeToken();
  }
}