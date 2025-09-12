import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LenderRulesService } from '../../services/lender-rules.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { RuleResponse } from '../../models/lender-rule.dto';
import { LoanApplication } from '../../models/loan-application.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lender-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lender-dashboard.component.html',
  styleUrls: ['./lender-dashboard.component.css']
})
export class LenderDashboardComponent implements OnInit {
  myRules: RuleResponse[] = [];
  incomingApplications: LoanApplication[] = [];
  error: string = '';

  constructor(
    private authService: AuthService,
    private lenderRulesService: LenderRulesService,
    private loanService: LoanApplicationService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadMyRules();
    this.loadIncomingApplications();
  }

  loadMyRules() {
    this.lenderRulesService.getMyRules().subscribe({
      next: (rules) => {
        this.myRules = rules;
      },
      error: (error) => {
        this.error = 'Failed to load rules. Please try again.';
      }
    });
  }

  loadIncomingApplications() {
    this.loanService.getLenderApplications().subscribe({
      next: (applications) => {
        this.incomingApplications = applications;
      },
      error: (error) => {
        this.error = 'Failed to load applications. Please try again.';
      }
    });
  }

  navigateToCard(cardType: string) {
    switch(cardType) {
      case 'create':
        this.router.navigate(['/lender/create-rule']);
        break;
      case 'rules':
        this.router.navigate(['/lender/my-rules']);
        break;
      case 'applications':
        this.router.navigate(['/lender/incoming-applications']);
        break;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}