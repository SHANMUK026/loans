import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MyRulesComponent } from './my-rules.component';
import { LenderRulesService } from '../../../services/lender-rules.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('MyRulesComponent', () => {
  let component: MyRulesComponent;
  let fixture: ComponentFixture<MyRulesComponent>;
  let mockLenderService: jasmine.SpyObj<LenderRulesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const lenderServiceSpy = jasmine.createSpyObj('LenderRulesService', ['getMyRules', 'createRule', 'updateRule', 'deleteRule']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MyRulesComponent, CommonModule, FormsModule],
      providers: [
        { provide: LenderRulesService, useValue: lenderServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyRulesComponent);
    component = fixture.componentInstance;
    mockLenderService = TestBed.inject(LenderRulesService) as jasmine.SpyObj<LenderRulesService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.myRules).toEqual([]);
    expect(component.isCreatingRule).toBeFalse();
    expect(component.editingRuleId).toBeNull();
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
    expect(component.ruleData.minimumLoanAmount).toBe(0);
    expect(component.ruleData.maximumLoanAmount).toBe(0);
    expect(component.ruleData.interestRate).toBe(0);
    expect(component.ruleData.minimumCreditScore).toBe(0);
    expect(component.ruleData.minimumAge).toBe(0);
    expect(component.ruleData.maximumAge).toBe(0);
    expect(component.ruleData.minimumSalary).toBe(0);
    expect(component.ruleData.employmentTypes).toBe('SALARIED');
    expect(component.ruleData.ruleStatus).toBe('ACTIVE');
  });

  it('should load rules on init', () => {
    const mockRules = [{ id: 1, interestRate: 10 }];
    mockLenderService.getMyRules.and.returnValue(of(mockRules));

    component.ngOnInit();

    expect(mockLenderService.getMyRules).toHaveBeenCalled();
    expect(component.myRules).toEqual(mockRules);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading rules fails', () => {
    const error = { error: { message: 'Failed to load rules' } };
    mockLenderService.getMyRules.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(component.error).toBe('Failed to load rules');
    expect(component.loading).toBeFalse();
  });

  it('should start creating rule', () => {
    component.startCreatingRule();

    expect(component.isCreatingRule).toBeTrue();
    expect(component.editingRuleId).toBeNull();
    expect(component.ruleData.minimumLoanAmount).toBe(0);
  });

  it('should start editing rule', () => {
    const mockRule = { id: 1, interestRate: 10, minimumLoanAmount: 10000 };
    component.startEditingRule(mockRule);

    expect(component.editingRuleId).toBe(1);
    expect(component.isCreatingRule).toBeFalse();
    expect(component.ruleData).toEqual(mockRule);
  });

  it('should cancel form', () => {
    component.isCreatingRule = true;
    component.editingRuleId = 1;

    component.cancelForm();

    expect(component.isCreatingRule).toBeFalse();
    expect(component.editingRuleId).toBeNull();
    expect(component.ruleData.minimumLoanAmount).toBe(0);
  });

  it('should reset form', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.interestRate = 15;

    component.resetForm();

    expect(component.ruleData.minimumLoanAmount).toBe(0);
    expect(component.ruleData.interestRate).toBe(0);
    expect(component.ruleData.employmentTypes).toBe('SALARIED');
    expect(component.ruleData.ruleStatus).toBe('ACTIVE');
  });

  it('should create rule successfully', () => {
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;
    mockLenderService.createRule.and.returnValue(of({}));
    mockLenderService.getMyRules.and.returnValue(of([]));

    component.createRule();

    expect(mockLenderService.createRule).toHaveBeenCalledWith(component.ruleData);
    expect(component.loading).toBeFalse();
    expect(component.isCreatingRule).toBeFalse();
    expect(component.error).toBe('Rule created successfully!');
  });

  it('should update rule successfully', () => {
    component.editingRuleId = 1;
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;
    mockLenderService.updateRule.and.returnValue(of({}));
    mockLenderService.getMyRules.and.returnValue(of([]));

    component.updateRule();

    expect(mockLenderService.updateRule).toHaveBeenCalledWith(1, component.ruleData);
    expect(component.loading).toBeFalse();
    expect(component.editingRuleId).toBeNull();
    expect(component.error).toBe('Rule updated successfully!');
  });

  it('should not update rule when editingRuleId is null', () => {
    component.editingRuleId = null;
    component.updateRule();

    expect(mockLenderService.updateRule).not.toHaveBeenCalled();
  });

  it('should delete rule successfully', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockLenderService.deleteRule.and.returnValue(of({}));
    mockLenderService.getMyRules.and.returnValue(of([]));

    component.deleteRule(1);

    expect(mockLenderService.deleteRule).toHaveBeenCalledWith(1);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Rule deleted successfully!');
  });

  it('should not delete rule when user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteRule(1);

    expect(mockLenderService.deleteRule).not.toHaveBeenCalled();
  });

  it('should validate form and show error for invalid minimum loan amount', () => {
    component.ruleData.minimumLoanAmount = 0;
    component.ruleData.maximumLoanAmount = 10000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;

    component.saveRule();

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

    component.saveRule();

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

    component.saveRule();

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

    component.saveRule();

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

    component.saveRule();

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

    component.saveRule();

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

    component.saveRule();

    expect(component.error).toBe('Please enter a valid minimum salary');
  });

  it('should handle create rule error', () => {
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

  it('should handle update rule error', () => {
    component.editingRuleId = 1;
    component.ruleData.minimumLoanAmount = 10000;
    component.ruleData.maximumLoanAmount = 50000;
    component.ruleData.interestRate = 10;
    component.ruleData.minimumCreditScore = 700;
    component.ruleData.minimumAge = 25;
    component.ruleData.maximumAge = 60;
    component.ruleData.minimumSalary = 50000;
    const error = { status: 404, error: { message: 'Rule not found' } };
    mockLenderService.updateRule.and.returnValue(throwError(() => error));

    component.updateRule();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Rule not found. It may have been deleted by another user.');
  });

  it('should handle delete rule error', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const error = { status: 404, error: { message: 'Rule not found' } };
    mockLenderService.deleteRule.and.returnValue(throwError(() => error));

    component.deleteRule(1);

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Rule not found. It may have been deleted by another user.');
  });

  it('should navigate back to lender dashboard', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lender']);
  });
});
