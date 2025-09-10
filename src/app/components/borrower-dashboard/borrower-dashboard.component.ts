import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BorrowerRequestService } from '../../services/borrower-request.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { CreateRequest, RequestResponse } from '../../models/borrower-req.dto';
import { EligibleLender, MyApplication } from '../../models/loan-application.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-borrower-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './borrower-dashboard.component.html',
  styleUrls: ['./borrower-dashboard.component.css']
})
export class BorrowerDashboardComponent implements OnInit {
  loanAmount: number = 0;
  loanPurpose: string = '';
  employmentStatus: string = 'SALARIED';
  creditScore: number = 0;
  age: number = 0;
  salary: number = 0;

  // Data arrays
  myRequests: RequestResponse[] = [];
  myApplications: MyApplication[] = [];
  eligibleLenders: EligibleLender[] = [];
  selectedLenders: number[] = [];

  // UI state
  error: string = '';
  loading: boolean = false;
  showLenders: boolean = false;
  currentRequestId: number = 0;

  constructor(
    private authService: AuthService,
    private borrowerService: BorrowerRequestService,
    private loanService: LoanApplicationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadMyRequests();
    this.loadMyApplications();
  }
  createRequest() {
    if (!this.loanAmount || !this.loanPurpose || !this.creditScore || !this.age || !this.salary) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    const requestData: CreateRequest = {
      loanAmount: this.loanAmount,
      loanPurpose: this.loanPurpose,
      employmentStatus: this.employmentStatus,
      creditScore: this.creditScore,
      age: this.age
    };

    this.borrowerService.createRequest(requestData).subscribe({
      next: (response) => {
        this.loading = false;
        this.loadMyRequests();
        this.clearForm();
      },
      error: (error) => {
        this.error = 'Failed to create request';
        this.loading = false;
      }
    });
  }
  findLenders(requestId: number) {
    this.currentRequestId = requestId;
    this.loading = true;
    this.error = '';

    this.loanService.getEligibleLenders(requestId, this.salary).subscribe({
      next: (lenders) => {
        this.eligibleLenders = lenders;
        this.showLenders = true;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to find lenders';
        this.loading = false;
      }
    });
  }
  toggleLender(ruleId: number) {
    const index = this.selectedLenders.indexOf(ruleId);
    if (index > -1) {
      this.selectedLenders.splice(index, 1);
    } else {
      this.selectedLenders.push(ruleId);
    }
  }
  
  applyToLenders() {
    if (this.selectedLenders.length === 0) {
      this.error = 'Please select at least one lender';
      return;
    }

    this.loading = true;
    this.error = '';

    let completed = 0;
    this.selectedLenders.forEach(ruleId => {
      this.loanService.applyForLoan(this.currentRequestId, ruleId).subscribe({
        next: () => {
          completed++;
          if (completed === this.selectedLenders.length) {
            this.loading = false;
            this.showLenders = false;
            this.selectedLenders = [];
            this.loadMyApplications();
          }
        },
        error: () => {
          this.error = 'Failed to apply to some lenders';
          this.loading = false;
        }
      });
    });
  }

  // Load my requests
  loadMyRequests() {
    this.borrowerService.getMyRequests().subscribe({
      next: (requests) => {
        this.myRequests = requests;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
      }
    });
  }

  // Load my applications
  loadMyApplications() {
    this.loanService.getBorrowerApplications().subscribe({
      next: (applications) => {
        this.myApplications = applications;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      }
    });
  }

  // Clear form
  clearForm() {
    this.loanAmount = 0;
    this.loanPurpose = '';
    this.employmentStatus = 'SALARIED';
    this.creditScore = 0;
    this.age = 0;
    this.salary = 0;
  }

  // Get status class for styling
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'approved':
        return 'approved';
      case 'rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  }

  // Logout
  logout() {
    this.authService.removeToken();
    this.router.navigate(['/']);
  }
}