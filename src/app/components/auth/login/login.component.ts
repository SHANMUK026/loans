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
  // Simple form data
  userName: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Simple login method
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
        this.error = 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }

  // Simple navigation methods
  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}