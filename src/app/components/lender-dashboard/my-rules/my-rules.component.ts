import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LenderRulesService } from '../../../services/lender-rules.service';

@Component({
  selector: 'app-my-rules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-rules.component.html',
  styleUrls: ['./my-rules.component.css']
})
export class MyRulesComponent implements OnInit {
  myRules: any[] = [];
  isCreatingRule: boolean = false;
  editingRuleId: number | null = null;
  loading: boolean = false;
  error: string = '';

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

  constructor(
    private lenderRulesService: LenderRulesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyRules();
  }

  loadMyRules() {
    this.loading = true;
    this.lenderRulesService.getMyRules().subscribe({
      next: (rules: any[]) => {
        this.myRules = rules;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to load rules';
        this.loading = false;
      }
    });
  }

  startCreatingRule() {
    this.isCreatingRule = true;
    this.editingRuleId = null;
    this.resetForm();
  }

  startEditingRule(rule: any) {
    this.editingRuleId = rule.id;
    this.isCreatingRule = false;
    this.ruleData = { ...rule };
  }

  cancelForm() {
    this.isCreatingRule = false;
    this.editingRuleId = null;
    this.resetForm();
  }

  resetForm() {
    this.ruleData = {
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
  }

  saveRule() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.editingRuleId) {
      this.updateRule();
    } else {
      this.createRule();
    }
  }

  createRule() {
    this.lenderRulesService.createRule(this.ruleData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.isCreatingRule = false;
        this.resetForm();
        this.loadMyRules();
        this.error = 'Rule created successfully!';
        setTimeout(() => this.error = '', 3000);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = this.getRuleErrorMessage(error, 'create');
      }
    });
  }

  updateRule() {
    if (!this.editingRuleId) return;

    this.lenderRulesService.updateRule(this.editingRuleId, this.ruleData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.editingRuleId = null;
        this.resetForm();
        this.loadMyRules();
        this.error = 'Rule updated successfully!';
        setTimeout(() => this.error = '', 3000);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = this.getRuleErrorMessage(error, 'update');
      }
    });
  }

  deleteRule(ruleId: number) {
    if (!confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    this.loading = true;
    this.lenderRulesService.deleteRule(ruleId).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.loadMyRules();
        this.error = 'Rule deleted successfully!';
        setTimeout(() => this.error = '', 3000);
      },
      error: (error: any) => {
        this.loading = false;
        this.error = this.getRuleErrorMessage(error, 'delete');
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

  private getRuleErrorMessage(error: any, operation: string): string {
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
        return `Invalid rule data for ${operation}. Please check your information.`;
      
      case 401:
        return 'Authentication required. Please log in again.';
      
      case 403:
        return `You do not have permission to ${operation} lending rules.`;
      
      case 404:
        if (operation === 'update' || operation === 'delete') {
          return 'Rule not found. It may have been deleted by another user.';
        }
        return 'Resource not found.';
      
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
        if (errorMessage.toLowerCase().includes('not found')) {
          return 'Rule not found.';
        }
        if (errorMessage.toLowerCase().includes('permission')) {
          return `You do not have permission to ${operation} this rule.`;
        }
        return errorMessage || `Failed to ${operation} rule. Please try again.`;
    }
  }

  goBack() {
    this.router.navigate(['/lender']);
  }
}
