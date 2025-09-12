import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BorrowerRequestService } from '../../../services/borrower-request.service';
import { LenderRulesService } from '../../../services/lender-rules.service';
import { LoanApplicationService } from '../../../services/loan-application.service';

@Component({
  selector: 'app-eligible-lenders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eligible-lenders.component.html',
  styleUrls: ['./eligible-lenders.component.css']
})
export class EligibleLendersComponent implements OnInit {
  myRequests: any[] = [];
  eligibleLenders: any[] = [];
  selectedLenders: number[] = [];
  showLenders: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(
    private borrowerRequestService: BorrowerRequestService,
    private lenderRulesService: LenderRulesService,
    private loanApplicationService: LoanApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyRequests();
  }

  loadMyRequests() {
    this.loading = true;
    this.borrowerRequestService.getMyRequests().subscribe({
      next: (requests) => {
        this.myRequests = requests;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load requests';
        this.loading = false;
      }
    });
  }

  findLenders(requestId: number) {
    this.loading = true;
    this.error = '';
    
    this.loanApplicationService.getEligibleLenders(requestId, 0).subscribe({
      next: (lenders: any[]) => {
        this.eligibleLenders = lenders;
        this.selectedLenders = [];
        this.showLenders = true;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to find eligible lenders';
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

    const applicationData = {
      ruleIds: this.selectedLenders
    };

    this.loanApplicationService.createApplication(applicationData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.showLenders = false;
        this.selectedLenders = [];
        this.loadMyRequests(); // Refresh requests
        this.error = 'Successfully applied to selected lenders!';
        setTimeout(() => this.error = '', 3000); // Clear success message after 3 seconds
      },
      error: (error: any) => {
        this.loading = false;
        this.error = this.getSpecificErrorMessage(error);
      }
    });
  }

  private getSpecificErrorMessage(error: any): string {
    const status = error.status;
    const errorMessage = error.error?.message || error.message || '';

    // Handle specific HTTP status codes
    switch (status) {
      case 400:
        if (errorMessage.toLowerCase().includes('already applied') || 
            errorMessage.toLowerCase().includes('duplicate')) {
          return 'You have already applied to one or more of these lenders. Please select different lenders.';
        }
        if (errorMessage.toLowerCase().includes('validation') || 
            errorMessage.toLowerCase().includes('invalid')) {
          return 'Invalid application data. Please check your information and try again.';
        }
        return 'Invalid request. Please check your selection and try again.';
      
      case 401:
        return 'Authentication failed. Please log in again.';
      
      case 403:
        return 'You do not have permission to apply to these lenders.';
      
      case 404:
        return 'Selected lenders not found. Please refresh and try again.';
      
      case 409:
        return 'You have already applied to one or more of these lenders.';
      
      case 422:
        return 'Application data is invalid. Please check your information.';
      
      case 500:
        return 'Server error. Please try again later.';
      
      default:
        if (errorMessage.toLowerCase().includes('already applied')) {
          return 'You have already applied to one or more of these lenders.';
        }
        if (errorMessage.toLowerCase().includes('duplicate')) {
          return 'Duplicate application detected. You have already applied to some of these lenders.';
        }
        if (errorMessage.toLowerCase().includes('not eligible')) {
          return 'You are not eligible for the selected lenders based on their criteria.';
        }
        return errorMessage || 'Failed to apply to lenders. Please try again.';
    }
  }

  goBack() {
    this.router.navigate(['/borrower']);
  }
}
