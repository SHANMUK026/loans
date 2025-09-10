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
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.error = 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  // Simple navigation methods
  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}