import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BorrowerRequestService } from '../../services/borrower-request.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { RequestResponse } from '../../models/borrower-req.dto';
import { MyApplication } from '../../models/loan-application.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-borrower-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrower-dashboard.component.html',
  styleUrls: ['./borrower-dashboard.component.css']
})
export class BorrowerDashboardComponent implements OnInit {
  myRequests: RequestResponse[] = [];
  myApplications: MyApplication[] = [];
  eligibleLenders: any[] = [];
  error: string = '';

  constructor(
    private authService: AuthService,
    private borrowerService: BorrowerRequestService,
    private loanService: LoanApplicationService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadMyRequests();
    this.loadMyApplications();
  }

  loadMyRequests() {
    this.borrowerService.getMyRequests().subscribe({
      next: (requests) => {
        this.myRequests = requests;
      },
      error: (error) => {
        this.error = 'Failed to load requests. Please try again.';
      }
    });
  }

  loadMyApplications() {
    this.loanService.getBorrowerApplications().subscribe({
      next: (applications) => {
        this.myApplications = applications;
      },
      error: (error) => {
        this.error = 'Failed to load applications. Please try again.';
      }
    });
  }

  navigateToCard(cardType: string) {
    switch(cardType) {
      case 'apply':
        this.router.navigate(['/borrower/apply-loan']);
        break;
      case 'lenders':
        this.router.navigate(['/borrower/eligible-lenders']);
        break;
      case 'applications':
        this.router.navigate(['/borrower/my-applications']);
        break;
      case 'calculator':
        this.router.navigate(['/borrower/loan-calculator']);
        break;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}