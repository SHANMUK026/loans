import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateRuleComponent } from './create-rule.component';
import { LenderRulesService } from '../../../services/lender-rules.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('CreateRuleComponent', () => {
  let component: CreateRuleComponent;
  let fixture: ComponentFixture<CreateRuleComponent>;
  let mockLenderService: jasmine.SpyObj<LenderRulesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const lenderServiceSpy = jasmine.createSpyObj('LenderRulesService', ['createRule']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateRuleComponent, CommonModule, FormsModule],
      providers: [
        { provide: LenderRulesService, useValue: lenderServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRuleComponent);
    component = fixture.componentInstance;
    mockLenderService = TestBed.inject(LenderRulesService) as jasmine.SpyObj<LenderRulesService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default rule data', () => {
    expect(component.ruleData.minimumLoanAmount).toBe(0);
    expect(component.ruleData.maximumLoanAmount).toBe(0);
    expect(component.ruleData.interestRate).toBe(0);
    expect(component.ruleData.minimumCreditScore).toBe(0);
    expect(component.ruleData.minimumAge).toBe(0);
    expect(component.ruleData.maximumAge).toBe(0);
    expect(component.ruleData.minimumSalary).toBe(0);
    expect(component.ruleData.employmentTypes).toBe('SALARIED');
    expect(component.ruleData.ruleStatus).toBe('ACTIVE');
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should validate form and show error for invalid minimum loan amount', () => {
    component.ruleData.minimumLoanAmount = 0;
    component.ruleData.maximumLoanAmount = 10000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;

    component.createRule();

    expect(component.error).toBe('Please enter a valid minimum loan amount');
  });

  it('should validate form and show error when maximum is not greater than minimum', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 5000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;

    component.createRule();

    expect(component.error).toBe('Maximum loan amount must be greater than minimum amount');
  });

  it('should validate form and show error for invalid interest rate', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 60;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;

    component.createRule();

    expect(component.error).toBe('Please enter a valid interest rate (0-50%)');
  });

  it('should validate form and show error for invalid credit score', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 200;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;

    component.createRule();

    expect(component.error).toBe('Please enter a valid minimum credit score (300-850)');
  });

  it('should validate form and show error for invalid minimum age', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 15;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;

    component.createRule();

    expect(component.error).toBe('Please enter a valid minimum age (18-65)');
  });

  it('should validate form and show error for invalid maximum age', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 70;
    component.ruleData.minimumSalary = 50000;

    component.createRule();

    expect(component.error).toBe('Maximum age must be greater than minimum age and not exceed 65');
  });

  it('should validate form and show error for invalid minimum salary', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 0;

    component.createRule();

    expect(component.error).toBe('Please enter a valid minimum salary');
  });

  it('should create rule successfully with valid data', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;
    mockLenderService.createRule.and.returnValue(of({}));

    component.createRule();

    expect(mockLenderService.createRule).toHaveBeenCalledWith(component.ruleData);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Lending rule created successfully!');
  });

  it('should handle rule creation error', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;
    const error = { status: 400, error: { message: 'Validation failed' } };
    mockLenderService.createRule.and.returnValue(throwError(() => error));

    component.createRule();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Please check all fields and ensure they are valid.');
  });

  it('should navigate back to lender dashboard', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lender']);
  });
});
