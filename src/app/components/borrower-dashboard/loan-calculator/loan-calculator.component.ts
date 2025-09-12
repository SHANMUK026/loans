import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.css']
})
export class LoanCalculatorComponent implements OnInit {
  loanAmount: number = 0;
  interestRate: number = 0;
  loanYears: number = 0;
  loanMonths: number = 0;
  monthlyPayment: number = 0;
  totalInterest: number = 0;
  totalAmount: number = 0;
  showResults: boolean = false;
  calculationHistory: any[] = [];
  selectedCalculation: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  calculateLoan() {
    const totalMonths = (this.loanYears * 12) + this.loanMonths;
    
    if (this.loanAmount > 0 && this.interestRate > 0 && totalMonths > 0) {
      const monthlyRate = this.interestRate / 100 / 12;
      const numberOfPayments = totalMonths;
      
      this.monthlyPayment = (this.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      this.totalAmount = this.monthlyPayment * numberOfPayments;
      this.totalInterest = this.totalAmount - this.loanAmount;
      this.showResults = true;

      // Save calculation to history
      const calculation = {
        id: Date.now(),
        loanAmount: this.loanAmount,
        interestRate: this.interestRate,
        loanYears: this.loanYears,
        loanMonths: this.loanMonths,
        totalMonths: totalMonths,
        monthlyPayment: this.monthlyPayment,
        totalInterest: this.totalInterest,
        totalAmount: this.totalAmount,
        numberOfPayments: numberOfPayments,
        calculatedAt: new Date()
      };
      
      this.calculationHistory.unshift(calculation);
      this.selectedCalculation = calculation;
      
      // Keep only last 10 calculations
      if (this.calculationHistory.length > 10) {
        this.calculationHistory = this.calculationHistory.slice(0, 10);
      }
    }
  }

  resetCalculator() {
    this.loanAmount = 0;
    this.interestRate = 0;
    this.loanYears = 0;
    this.loanMonths = 0;
    this.monthlyPayment = 0;
    this.totalInterest = 0;
    this.totalAmount = 0;
    this.showResults = false;
    this.selectedCalculation = null;
  }

  loadCalculation(calculation: any) {
    this.loanAmount = calculation.loanAmount;
    this.interestRate = calculation.interestRate;
    this.loanYears = calculation.loanYears;
    this.loanMonths = calculation.loanMonths;
    this.monthlyPayment = calculation.monthlyPayment;
    this.totalInterest = calculation.totalInterest;
    this.totalAmount = calculation.totalAmount;
    this.showResults = true;
    this.selectedCalculation = calculation;
  }

  deleteCalculation(id: number) {
    this.calculationHistory = this.calculationHistory.filter(calc => calc.id !== id);
    if (this.selectedCalculation && this.selectedCalculation.id === id) {
      this.selectedCalculation = null;
    }
  }

  downloadCalculation() {
    if (!this.selectedCalculation) {
      alert('No calculation to download');
      return;
    }

    const calc = this.selectedCalculation;
    const content = `
LOAN CALCULATION REPORT
Generated on: ${calc.calculatedAt.toLocaleString()}

LOAN DETAILS:
- Loan Amount: ${this.formatCurrency(calc.loanAmount)}
- Interest Rate: ${calc.interestRate}% per annum
- Loan Term: ${calc.loanYears} years ${calc.loanMonths} months
- Total Payments: ${calc.numberOfPayments} months

CALCULATION RESULTS:
- Monthly Payment: ${this.formatCurrency(calc.monthlyPayment)}
- Total Interest: ${this.formatCurrency(calc.totalInterest)}
- Total Amount: ${this.formatCurrency(calc.totalAmount)}

BREAKDOWN:
- Principal Amount: ${this.formatCurrency(calc.loanAmount)}
- Interest Amount: ${this.formatCurrency(calc.totalInterest)}
- Total to Pay: ${this.formatCurrency(calc.totalAmount)}

This calculation is for estimation purposes only.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `loan-calculation-${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getTotalMonths(): number {
    return (this.loanYears * 12) + this.loanMonths;
  }

  getTermDisplay(): string {
    const parts = [];
    if (this.loanYears > 0) {
      parts.push(`${this.loanYears} year${this.loanYears > 1 ? 's' : ''}`);
    }
    if (this.loanMonths > 0) {
      parts.push(`${this.loanMonths} month${this.loanMonths > 1 ? 's' : ''}`);
    }
    return parts.join(' ');
  }

  getAmortizationSchedule() {
    if (!this.selectedCalculation) return [];

    const schedule = [];
    const monthlyRate = this.selectedCalculation.interestRate / 100 / 12;
    let balance = this.selectedCalculation.loanAmount;
    const monthlyPayment = this.selectedCalculation.monthlyPayment;

    for (let month = 1; month <= this.selectedCalculation.numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    return schedule;
  }

  goBack() {
    this.router.navigate(['/borrower']);
  }
}
