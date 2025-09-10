import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔍 Interceptor - INTERCEPTOR CALLED for URL:', req.url);
    console.log('🔍 Interceptor - This should appear for EVERY HTTP request');
    
    let token: string | null = null;
    
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('token');
    }
    
    console.log('🔍 Interceptor - Request URL:', req.url);
    console.log('🔍 Interceptor - Token found:', !!token);
    console.log('🔍 Interceptor - Token value:', token);
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('🔍 Interceptor - Authorization header set:', authReq.headers.get('Authorization'));
      return next.handle(authReq);
    }
    
    console.log('🔍 Interceptor - No token, proceeding without auth header');
    return next.handle(req);
  }
}
