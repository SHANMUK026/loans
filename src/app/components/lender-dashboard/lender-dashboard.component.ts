import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LenderRulesService } from '../../services/lender-rules.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { CreateRule, RuleResponse } from '../../models/lender-rule.dto';
import { LoanApplication } from '../../models/loan-application.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lender-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lender-dashboard.component.html',
  styleUrls: ['./lender-dashboard.component.css']
})
export class LenderDashboardComponent implements OnInit {
  // Form data for creating rule
  newRule: CreateRule = {
    minimumSalary: 0,
    minimumLoanAmount: 0,
    maximumLoanAmount: 0,
    interestRate: 0,
    minimumCreditScore: 0,
    minimumAge: 0,
    maximumAge: 0,
    employmentTypes: 'FULL_TIME',
    ruleStatus: 'ACTIVE'
  };

 
  myRules: RuleResponse[] = [];
  incomingApplications: LoanApplication[] = [];


  error: string = '';
  loading: boolean = false;
  isCreatingRule: boolean = false;
  editingRuleId: number = 0;

  constructor(
    private authService: AuthService,
    private rulesService: LenderRulesService,
    private loanService: LoanApplicationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadMyRules();
    this.loadIncomingApplications();
  }

  
  createRule() {
    if (!this.newRule.minimumSalary || !this.newRule.minimumLoanAmount || !this.newRule.maximumLoanAmount || !this.newRule.interestRate) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.isCreatingRule = true;
    this.error = '';

    this.rulesService.createRule(this.newRule).subscribe({
      next: (response) => {
        this.isCreatingRule = false;
        this.loadMyRules();
        this.resetRuleForm();
      },
      error: (error) => {
        this.error = 'Failed to create rule';
        this.isCreatingRule = false;
      }
    });
  }

  
  resetRuleForm() {
    this.newRule = {
      minimumSalary: 0,
      minimumLoanAmount: 0,
      maximumLoanAmount: 0,
      interestRate: 0,
      minimumCreditScore: 0,
      minimumAge: 0,
      maximumAge: 0,
      employmentTypes: 'FULL_TIME',
      ruleStatus: 'ACTIVE'
    };
  }

  editRule(rule: RuleResponse) {
    this.editingRuleId = rule.id;
    this.newRule = {
      minimumSalary: rule.minimumSalary,
      minimumLoanAmount: rule.minimumLoanAmount,
      maximumLoanAmount: rule.maximumLoanAmount,
      interestRate: rule.interestRate,
      minimumCreditScore: rule.minimumCreditScore,
      minimumAge: rule.minimumAge,
      maximumAge: rule.maximumAge,
      employmentTypes: rule.employmentTypes,
      ruleStatus: rule.ruleStatus
    };
  }


  deleteRule(ruleId: number) {
    if (confirm('Are you sure you want to delete this rule?')) {
      this.rulesService.deleteRule(ruleId).subscribe({
        next: (response) => {
          this.loadMyRules();
        },
        error: (error) => {
          this.error = 'Failed to delete rule';
        }
      });
    }
  }


  approveApplication(applicationId: number) {
    this.loading = true;
    this.error = '';

    this.loanService.updateLoanStatus(applicationId, 'APPROVED').subscribe({
      next: (response) => {
        this.loading = false;
        this.loadIncomingApplications();
      },
      error: (error) => {
        this.error = 'Failed to approve application';
        this.loading = false;
      }
    });
  }

 
  rejectApplication(applicationId: number) {
    this.loading = true;
    this.error = '';

    this.loanService.updateLoanStatus(applicationId, 'REJECTED').subscribe({
      next: (response) => {
        this.loading = false;
        this.loadIncomingApplications();
      },
      error: (error) => {
        this.error = 'Failed to reject application';
        this.loading = false;
      }
    });
  }


  loadMyRules() {
    this.rulesService.getMyRules().subscribe({
      next: (rules) => {
        this.myRules = rules;
      },
      error: (error) => {
        console.error('Error loading rules:', error);
      }
    });
  }


  loadIncomingApplications() {
    this.loanService.getLenderApplications().subscribe({
      next: (applications) => {
        this.incomingApplications = applications;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      }
    });
  }

 
  clearForm() {
    this.resetRuleForm();
    this.editingRuleId = 0;
  }


  logout() {
    this.authService.removeToken();
    this.router.navigate(['/']);
  }
}