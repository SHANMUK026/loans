import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest, BorrowerDetails, LenderDetails } from '../../../models/auth-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Basic user info
  userName: string = '';
  email: string = '';
  password: string = '';
  role: string = 'BORROWER';

  // Borrower specific fields
  borrowerFirstName: string = '';
  borrowerLastName: string = '';
  borrowerPhoneNumber: string = '';
  borrowerAddress: string = '';

  // Lender specific fields
  lenderFirstName: string = '';
  lenderLastName: string = '';
  companyName: string = '';
  licenseNumber: string = '';
  lenderPhoneNumber: string = '';
  lenderAddress: string = '';

  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Simple register method
  onRegister() {
    if (!this.userName || !this.email || !this.password) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';

    const registerData: RegisterRequest = {
      userName: this.userName,
      email: this.email,
      password: this.password,
      role: this.role
    };

    // Add role-specific details
    if (this.role === 'BORROWER') {
      registerData.borrower = {
        firstName: this.borrowerFirstName,
        lastName: this.borrowerLastName,
        phoneNumber: this.borrowerPhoneNumber,
        address: this.borrowerAddress
      };
    } else if (this.role === 'LENDER') {
      registerData.lender = {
        firstName: this.lenderFirstName,
        lastName: this.lenderLastName,
        companyName: this.companyName,
        licenseNumber: this.licenseNumber,
        phoneNumber: this.lenderPhoneNumber,
        address: this.lenderAddress
      };
    }

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.loading = false;
        this.error = 'Registration successful! Please log in with your credentials.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Navigate after showing success message
      },
      error: (error) => {
        this.loading = false;
        this.error = this.getRegistrationErrorMessage(error);
      }
    });
  }

  private getRegistrationErrorMessage(error: any): string {
    const status = error.status;
    const errorMessage = error.error?.message || error.message || '';

    switch (status) {
      case 400:
        if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('taken')) {
          return 'Username is already taken. Please choose a different username.';
        }
        if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('taken')) {
          return 'Email is already registered. Please use a different email or try logging in.';
        }
        if (errorMessage.toLowerCase().includes('validation')) {
          return 'Please check all fields and ensure they are valid.';
        }
        if (errorMessage.toLowerCase().includes('password')) {
          return 'Password does not meet requirements. Please use a stronger password.';
        }
        return 'Invalid registration data. Please check your information.';
      
      case 409:
        if (errorMessage.toLowerCase().includes('username')) {
          return 'Username already exists. Please choose a different username.';
        }
        if (errorMessage.toLowerCase().includes('email')) {
          return 'Email already registered. Please use a different email.';
        }
        return 'Account already exists. Please try logging in instead.';
      
      case 422:
        return 'Invalid data provided. Please check all fields and try again.';
      
      case 500:
        return 'Server error during registration. Please try again later.';
      
      default:
        if (errorMessage.toLowerCase().includes('username taken')) {
          return 'Username is already taken. Please choose another.';
        }
        if (errorMessage.toLowerCase().includes('email exists')) {
          return 'Email is already registered. Please use a different email.';
        }
        if (errorMessage.toLowerCase().includes('duplicate')) {
          return 'Account with this information already exists.';
        }
        return errorMessage || 'Registration failed. Please try again.';
    }
  }

  // Simple navigation methods
  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}