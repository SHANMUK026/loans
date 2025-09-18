import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EligibleLendersComponent } from './eligible-lenders.component';
import { BorrowerRequestService } from '../../../services/borrower-request.service';
import { LenderRulesService } from '../../../services/lender-rules.service';
import { LoanApplicationService } from '../../../services/loan-application.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('EligibleLendersComponent', () => {
  let component: EligibleLendersComponent;
  let fixture: ComponentFixture<EligibleLendersComponent>;
  let mockBorrowerService: jasmine.SpyObj<BorrowerRequestService>;
  let mockLenderService: jasmine.SpyObj<LenderRulesService>;
  let mockLoanService: jasmine.SpyObj<LoanApplicationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const borrowerServiceSpy = jasmine.createSpyObj('BorrowerRequestService', ['getMyRequests']);
    const lenderServiceSpy = jasmine.createSpyObj('LenderRulesService', []);
    const loanServiceSpy = jasmine.createSpyObj('LoanApplicationService', ['getEligibleLenders', 'createApplication']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EligibleLendersComponent, CommonModule, FormsModule],
      providers: [
        { provide: BorrowerRequestService, useValue: borrowerServiceSpy },
        { provide: LenderRulesService, useValue: lenderServiceSpy },
        { provide: LoanApplicationService, useValue: loanServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EligibleLendersComponent);
    component = fixture.componentInstance;
    mockBorrowerService = TestBed.inject(BorrowerRequestService) as jasmine.SpyObj<BorrowerRequestService>;
    mockLenderService = TestBed.inject(LenderRulesService) as jasmine.SpyObj<LenderRulesService>;
    mockLoanService = TestBed.inject(LoanApplicationService) as jasmine.SpyObj<LoanApplicationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.myRequests).toEqual([]);
    expect(component.eligibleLenders).toEqual([]);
    expect(component.selectedLenders).toEqual([]);
    expect(component.showLenders).toBeFalse();
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should load my requests on init', () => {
    const mockRequests = [{ id: 1, amount: 10000 }];
    mockBorrowerService.getMyRequests.and.returnValue(of(mockRequests));

    component.ngOnInit();

    expect(mockBorrowerService.getMyRequests).toHaveBeenCalled();
    expect(component.myRequests).toEqual(mockRequests);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading requests fails', () => {
    const error = { error: { message: 'Failed to load' } };
    mockBorrowerService.getMyRequests.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(component.error).toBe('Failed to load');
    expect(component.loading).toBeFalse();
  });

  it('should find eligible lenders successfully', () => {
    const mockLenders = [{ id: 1, name: 'Lender 1' }];
    mockLoanService.getEligibleLenders.and.returnValue(of(mockLenders));

    component.findLenders(1);

    expect(mockLoanService.getEligibleLenders).toHaveBeenCalledWith(1, 0);
    expect(component.eligibleLenders).toEqual(mockLenders);
    expect(component.selectedLenders).toEqual([]);
    expect(component.showLenders).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should handle error when finding lenders fails', () => {
    const error = { error: { message: 'No lenders found' } };
    mockLoanService.getEligibleLenders.and.returnValue(throwError(() => error));

    component.findLenders(1);

    expect(component.error).toBe('No lenders found');
    expect(component.loading).toBeFalse();
  });

  it('should toggle lender selection', () => {
    component.selectedLenders = [];
    component.toggleLender(1);
    expect(component.selectedLenders).toEqual([1]);

    component.toggleLender(1);
    expect(component.selectedLenders).toEqual([]);
  });

  it('should show error when no lenders are selected for application', () => {
    component.selectedLenders = [];
    component.applyToLenders();
    expect(component.error).toBe('Please select at least one lender');
  });

  it('should apply to selected lenders successfully', () => {
    component.selectedLenders = [1, 2];
    mockLoanService.createApplication.and.returnValue(of({}));
    mockBorrowerService.getMyRequests.and.returnValue(of([]));

    component.applyToLenders();

    expect(mockLoanService.createApplication).toHaveBeenCalledWith({
      ruleIds: [1, 2]
    });
    expect(component.loading).toBeFalse();
    expect(component.showLenders).toBeFalse();
    expect(component.selectedLenders).toEqual([]);
    expect(component.error).toBe('Successfully applied to selected lenders!');
  });

  it('should handle error when applying to lenders fails', () => {
    component.selectedLenders = [1, 2];
    const error = { status: 400, error: { message: 'Already applied' } };
    mockLoanService.createApplication.and.returnValue(throwError(() => error));

    component.applyToLenders();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('You have already applied to one or more of these lenders. Please select different lenders.');
  });

  it('should navigate back to borrower dashboard', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/borrower']);
  });
});
