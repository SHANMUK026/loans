import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApplyLoanComponent } from './apply-loan.component';
import { BorrowerRequestService } from '../../../services/borrower-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('ApplyLoanComponent', () => {
  let component: ApplyLoanComponent;
  let fixture: ComponentFixture<ApplyLoanComponent>;
  let mockBorrowerService: jasmine.SpyObj<BorrowerRequestService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const borrowerServiceSpy = jasmine.createSpyObj('BorrowerRequestService', ['createRequest']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ApplyLoanComponent, CommonModule, FormsModule],
      providers: [
        { provide: BorrowerRequestService, useValue: borrowerServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyLoanComponent);
    component = fixture.componentInstance;
    mockBorrowerService = TestBed.inject(BorrowerRequestService) as jasmine.SpyObj<BorrowerRequestService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.loanAmount).toBe(0);
    expect(component.loanPurpose).toBe('');
    expect(component.employmentStatus).toBe('SALARIED');
    expect(component.creditScore).toBe(0);
    expect(component.age).toBe(0);
    expect(component.salary).toBe(0);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should validate form and show error for invalid loan amount', () => {
    component.loanAmount = 0;
    component.loanPurpose = 'Personal';
    component.employmentStatus = 'SALARIED';
    component.creditScore = 700;
    component.age = 30;
    component.salary = 50000;

    component.createRequest();

    expect(component.error).toBe('Please enter a valid loan amount');
  });

  it('should validate form and show error for missing loan purpose', () => {
    component.loanAmount = 10000;
    component.loanPurpose = '';
    component.employmentStatus = 'SALARIED';
    component.creditScore = 700;
    component.age = 30;
    component.salary = 50000;

    component.createRequest();

    expect(component.error).toBe('Please select a loan purpose');
  });

  it('should validate form and show error for invalid credit score', () => {
    component.loanAmount = 10000;
    component.loanPurpose = 'Personal';
    component.employmentStatus = 'SALARIED';
    component.creditScore = 200;
    component.age = 30;
    component.salary = 50000;

    component.createRequest();

    expect(component.error).toBe('Please enter a valid credit score (300-850)');
  });

  it('should validate form and show error for invalid age', () => {
    component.loanAmount = 10000;
    component.loanPurpose = 'Personal';
    component.employmentStatus = 'SALARIED';
    component.creditScore = 700;
    component.age = 15;
    component.salary = 50000;

    component.createRequest();

    expect(component.error).toBe('Please enter a valid age (18-65)');
  });

  it('should validate form and show error for invalid salary', () => {
    component.loanAmount = 10000;
    component.loanPurpose = 'Personal';
    component.employmentStatus = 'SALARIED';
    component.creditScore = 700;
    component.age = 30;
    component.salary = 0;

    component.createRequest();

    expect(component.error).toBe('Please enter a valid salary');
  });

  it('should create request successfully with valid data', () => {
    component.loanAmount = 10000;
    component.loanPurpose = 'Personal';
    component.employmentStatus = 'SALARIED';
    component.creditScore = 700;
    component.age = 30;
    component.salary = 50000;
    mockBorrowerService.createRequest.and.returnValue(of({}));

    component.createRequest();

    expect(mockBorrowerService.createRequest).toHaveBeenCalledWith({
      loanAmount: 10000,
      loanPurpose: 'Personal',
      employmentStatus: 'SALARIED',
      creditScore: 700,
      age: 30,
      salary: 50000
    });
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Loan request created successfully!');
  });

  it('should handle request creation error', () => {
    component.loanAmount = 10000;
    component.loanPurpose = 'Personal';
    component.employmentStatus = 'SALARIED';
    component.creditScore = 700;
    component.age = 30;
    component.salary = 50000;
    const error = { status: 400, error: { message: 'Validation failed' } };
    mockBorrowerService.createRequest.and.returnValue(throwError(() => error));

    component.createRequest();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Please check all fields and ensure they are valid.');
  });

  it('should navigate back to borrower dashboard', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/borrower']);
  });
});
