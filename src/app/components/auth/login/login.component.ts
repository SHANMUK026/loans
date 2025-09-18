import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  userName: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  
  onLogin() {
    if (!this.userName || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    const loginData: LoginRequest = {
      userName: this.userName,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.loading = false;
        
        if (response.role === 'BORROWER') {
          this.router.navigate(['/borrower']);
        } else if (response.role === 'LENDER') {
          this.router.navigate(['/lender']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = this.getLoginErrorMessage(error);
      }
    });
  }

  private getLoginErrorMessage(error: any): string {
    const status = error.status;
    const errorMessage = error.error?.message || error.message || '';

    switch (status) {
      case 400:
        if (errorMessage.toLowerCase().includes('invalid credentials') || 
            errorMessage.toLowerCase().includes('wrong password')) {
          return 'Incorrect username or password. Please try again.';
        }
        if (errorMessage.toLowerCase().includes('validation')) {
          return 'Please enter valid username and password.';
        }
        return 'Invalid login data. Please check your credentials.';
      
      case 401:
        return 'Incorrect username or password. Please try again.';
      
      case 404:
        return 'User not found. Please check your username or register for a new account.';
      
      case 403:
        return 'Account is disabled. Please contact support.';
      
      case 500:
        return 'Server error. Please try again later.';
      
      default:
        if (errorMessage.toLowerCase().includes('invalid credentials')) {
          return 'Incorrect username or password.';
        }
        if (errorMessage.toLowerCase().includes('user not found')) {
          return 'User not found. Please check your username.';
        }
        if (errorMessage.toLowerCase().includes('wrong password')) {
          return 'Incorrect password. Please try again.';
        }
        return errorMessage || 'Login failed. Please try again.';
    }
  }

  
  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}