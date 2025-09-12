import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LenderRulesService } from '../../../services/lender-rules.service';

@Component({
  selector: 'app-create-rule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-rule.component.html',
  styleUrls: ['./create-rule.component.css']
})
export class CreateRuleComponent implements OnInit {
  ruleData = {
    minimumLoanAmount: 0,
    maximumLoanAmount: 0,
    interestRate: 0,
    minimumCreditScore: 0,
    minimumAge: 0,
    maximumAge: 0,
    minimumSalary: 0,
    employmentTypes: 'SALARIED',
    ruleStatus: 'ACTIVE'
  };

  loading: boolean = false;
  error: string = '';

  constructor(
    private lenderRulesService: LenderRulesService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createRule() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.lenderRulesService.createRule(this.ruleData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.error = 'Lending rule created successfully!';
        setTimeout(() => {
          this.router.navigate(['/lender']);
        }, 2000);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = this.getCreateRuleErrorMessage(error);
      }
    });
  }

  private validateForm(): boolean {
    if (this.ruleData.minimumLoanAmount <= 0) {
      this.error = 'Please enter a valid minimum loan amount';
      return false;
    }
    if (this.ruleData.maximumLoanAmount <= this.ruleData.minimumLoanAmount) {
      this.error = 'Maximum loan amount must be greater than minimum amount';
      return false;
    }
    if (this.ruleData.interestRate <= 0 || this.ruleData.interestRate > 50) {
      this.error = 'Please enter a valid interest rate (0-50%)';
      return false;
    }
    if (this.ruleData.minimumCreditScore < 300 || this.ruleData.minimumCreditScore > 850) {
      this.error = 'Please enter a valid minimum credit score (300-850)';
      return false;
    }
    if (this.ruleData.minimumAge < 18 || this.ruleData.minimumAge > 65) {
      this.error = 'Please enter a valid minimum age (18-65)';
      return false;
    }
    if (this.ruleData.maximumAge < this.ruleData.minimumAge || this.ruleData.maximumAge > 65) {
      this.error = 'Maximum age must be greater than minimum age and not exceed 65';
      return false;
    }
    if (this.ruleData.minimumSalary <= 0) {
      this.error = 'Please enter a valid minimum salary';
      return false;
    }
    return true;
  }

  private getCreateRuleErrorMessage(error: any): string {
    const status = error.status;
    const errorMessage = error.error?.message || error.message || '';

    switch (status) {
      case 400:
        if (errorMessage.toLowerCase().includes('validation')) {
          return 'Please check all fields and ensure they are valid.';
        }
        if (errorMessage.toLowerCase().includes('duplicate')) {
          return 'A similar lending rule already exists. Please modify your criteria.';
        }
        return 'Invalid rule data. Please check your information.';
      
      case 401:
        return 'Authentication required. Please log in again.';
      
      case 403:
        return 'You do not have permission to create lending rules.';
      
      case 409:
        return 'A similar lending rule already exists. Please modify your criteria.';
      
      case 422:
        return 'Rule data is invalid. Please check all fields.';
      
      case 500:
        return 'Server error. Please try again later.';
      
      default:
        if (errorMessage.toLowerCase().includes('duplicate')) {
          return 'A similar lending rule already exists.';
        }
        if (errorMessage.toLowerCase().includes('invalid')) {
          return 'Invalid rule data provided.';
        }
        return errorMessage || 'Failed to create lending rule. Please try again.';
    }
  }

  goBack() {
    this.router.navigate(['/lender']);
  }
}
