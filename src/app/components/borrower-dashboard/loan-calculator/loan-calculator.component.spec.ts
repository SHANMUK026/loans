import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoanCalculatorComponent } from './loan-calculator.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('LoanCalculatorComponent', () => {
  let component: LoanCalculatorComponent;
  let fixture: ComponentFixture<LoanCalculatorComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoanCalculatorComponent, CommonModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanCalculatorComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.loanAmount).toBe(0);
    expect(component.interestRate).toBe(0);
    expect(component.loanYears).toBe(0);
    expect(component.loanMonths).toBe(0);
    expect(component.monthlyPayment).toBe(0);
    expect(component.totalInterest).toBe(0);
    expect(component.totalAmount).toBe(0);
    expect(component.showResults).toBeFalse();
    expect(component.calculationHistory).toEqual([]);
    expect(component.selectedCalculation).toBeNull();
  });

  it('should calculate loan with valid data', () => {
    component.loanAmount = 100000;
    component.interestRate = 10;
    component.loanYears = 5;
    component.loanMonths = 0;

    component.calculateLoan();

    expect(component.showResults).toBeTrue();
    expect(component.monthlyPayment).toBeGreaterThan(0);
    expect(component.totalAmount).toBeGreaterThan(component.loanAmount);
    expect(component.totalInterest).toBeGreaterThan(0);
    expect(component.calculationHistory.length).toBe(1);
    expect(component.selectedCalculation).toBeTruthy();
  });

  it('should not calculate with invalid data', () => {
    component.loanAmount = 0;
    component.interestRate = 10;
    component.loanYears = 5;

    component.calculateLoan();

    expect(component.showResults).toBeFalse();
    expect(component.calculationHistory.length).toBe(0);
  });

  it('should not calculate with zero interest rate', () => {
    component.loanAmount = 100000;
    component.interestRate = 0;
    component.loanYears = 5;

    component.calculateLoan();

    expect(component.showResults).toBeFalse();
  });

  it('should not calculate with zero loan term', () => {
    component.loanAmount = 100000;
    component.interestRate = 10;
    component.loanYears = 0;
    component.loanMonths = 0;

    component.calculateLoan();

    expect(component.showResults).toBeFalse();
  });

  it('should reset calculator', () => {
    component.loanAmount = 100000;
    component.interestRate = 10;
    component.loanYears = 5;
    component.showResults = true;

    component.resetCalculator();

    expect(component.loanAmount).toBe(0);
    expect(component.interestRate).toBe(0);
    expect(component.loanYears).toBe(0);
    expect(component.loanMonths).toBe(0);
    expect(component.monthlyPayment).toBe(0);
    expect(component.totalInterest).toBe(0);
    expect(component.totalAmount).toBe(0);
    expect(component.showResults).toBeFalse();
    expect(component.selectedCalculation).toBeNull();
  });

  it('should load calculation from history', () => {
    const mockCalculation = {
      id: 1,
      loanAmount: 100000,
      interestRate: 10,
      loanYears: 5,
      loanMonths: 0,
      monthlyPayment: 2124.7,
      totalInterest: 27482,
      totalAmount: 127482
    };
    component.calculationHistory = [mockCalculation];

    component.loadCalculation(mockCalculation);

    expect(component.loanAmount).toBe(100000);
    expect(component.interestRate).toBe(10);
    expect(component.loanYears).toBe(5);
    expect(component.loanMonths).toBe(0);
    expect(component.monthlyPayment).toBe(2124.7);
    expect(component.totalInterest).toBe(27482);
    expect(component.totalAmount).toBe(127482);
    expect(component.showResults).toBeTrue();
    expect(component.selectedCalculation).toBe(mockCalculation);
  });

  it('should delete calculation from history', () => {
    const mockCalculation = { id: 1, loanAmount: 100000 };
    component.calculationHistory = [mockCalculation];
    component.selectedCalculation = mockCalculation;

    component.deleteCalculation(1);

    expect(component.calculationHistory.length).toBe(0);
    expect(component.selectedCalculation).toBeNull();
  });

  it('should keep only last 10 calculations', () => {
    // Add 12 calculations
    for (let i = 0; i < 12; i++) {
      component.loanAmount = 100000 + i;
      component.interestRate = 10;
      component.loanYears = 5;
      component.calculateLoan();
    }

    expect(component.calculationHistory.length).toBe(10);
  });

  it('should get total months correctly', () => {
    component.loanYears = 2;
    component.loanMonths = 6;
    expect(component.getTotalMonths()).toBe(30);
  });

  it('should get term display correctly', () => {
    component.loanYears = 2;
    component.loanMonths = 6;
    expect(component.getTermDisplay()).toBe('2 years 6 months');

    component.loanYears = 1;
    component.loanMonths = 0;
    expect(component.getTermDisplay()).toBe('1 year');

    component.loanYears = 0;
    component.loanMonths = 6;
    expect(component.getTermDisplay()).toBe('6 months');
  });

  it('should generate amortization schedule', () => {
    component.selectedCalculation = {
      loanAmount: 100000,
      interestRate: 10,
      numberOfPayments: 12,
      monthlyPayment: 8791.6
    };

    const schedule = component.getAmortizationSchedule();
    expect(schedule.length).toBe(12);
    expect(schedule[0].month).toBe(1);
    expect(schedule[0].balance).toBeGreaterThan(0);
  });

  it('should navigate back to borrower dashboard', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/borrower']);
  });
});
