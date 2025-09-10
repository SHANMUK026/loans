import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('🔍 AuthGuard - Checking authentication...');
    console.log('🔍 AuthGuard - Is logged in:', this.authService.isLoggedIn());
    console.log('🔍 AuthGuard - Token:', this.authService.getToken());
    
    if (this.authService.isLoggedIn()) {
      console.log('🔍 AuthGuard - Access granted');
      return true;
    } else {
      console.log('🔍 AuthGuard - Access denied, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
