import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BorrowerRequestService } from '../../../services/borrower-request.service';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-loan.component.html',
  styleUrls: ['./apply-loan.component.css']
})
export class ApplyLoanComponent implements OnInit {
  loanAmount: number = 0;
  loanPurpose: string = '';
  employmentStatus: string = 'SALARIED';
  creditScore: number = 0;
  age: number = 0;
  salary: number = 0;
  loading: boolean = false;
  error: string = '';

  constructor(
    private borrowerRequestService: BorrowerRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createRequest() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    const requestData = {
      loanAmount: this.loanAmount,
      loanPurpose: this.loanPurpose,
      employmentStatus: this.employmentStatus,
      creditScore: this.creditScore,
      age: this.age,
      salary: this.salary
    };

    this.borrowerRequestService.createRequest(requestData).subscribe({
      next: (response) => {
        this.loading = false;
        this.error = 'Loan request created successfully!';
        setTimeout(() => {
          this.router.navigate(['/borrower']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = this.getLoanRequestErrorMessage(error);
      }
    });
  }

  private validateForm(): boolean {
    if (!this.loanAmount || this.loanAmount <= 0) {
      this.error = 'Please enter a valid loan amount';
      return false;
    }
    if (!this.loanPurpose) {
      this.error = 'Please select a loan purpose';
      return false;
    }
    if (!this.employmentStatus) {
      this.error = 'Please select employment status';
      return false;
    }
    if (!this.creditScore || this.creditScore < 300 || this.creditScore > 850) {
      this.error = 'Please enter a valid credit score (300-850)';
      return false;
    }
    if (!this.age || this.age < 18 || this.age > 65) {
      this.error = 'Please enter a valid age (18-65)';
      return false;
    }
    if (!this.salary || this.salary <= 0) {
      this.error = 'Please enter a valid salary';
      return false;
    }
    return true;
  }

  private getLoanRequestErrorMessage(error: any): string {
    const status = error.status;
    const errorMessage = error.error?.message || error.message || '';

    switch (status) {
      case 400:
        if (errorMessage.toLowerCase().includes('validation')) {
          return 'Please check all fields and ensure they are valid.';
        }
        if (errorMessage.toLowerCase().includes('duplicate')) {
          return 'You already have a similar loan request. Please check your existing requests.';
        }
        return 'Invalid loan request data. Please check your information.';
      
      case 401:
        return 'Authentication required. Please log in again.';
      
      case 403:
        return 'You do not have permission to create loan requests.';
      
      case 409:
        return 'You already have a similar loan request. Please check your existing requests.';
      
      case 422:
        return 'Loan request data is invalid. Please check all fields.';
      
      case 500:
        return 'Server error. Please try again later.';
      
      default:
        if (errorMessage.toLowerCase().includes('duplicate')) {
          return 'You already have a similar loan request.';
        }
        if (errorMessage.toLowerCase().includes('invalid')) {
          return 'Invalid loan request data provided.';
        }
        return errorMessage || 'Failed to create loan request. Please try again.';
    }
  }

  goBack() {
    this.router.navigate(['/borrower']);
  }
}
