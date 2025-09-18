import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BorrowerDashboardComponent } from './borrower-dashboard.component';
import { AuthService } from '../../services/auth.service';
import { BorrowerRequestService } from '../../services/borrower-request.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { CommonModule } from '@angular/common';

describe('BorrowerDashboardComponent', () => {
  let component: BorrowerDashboardComponent;
  let fixture: ComponentFixture<BorrowerDashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockBorrowerService: jasmine.SpyObj<BorrowerRequestService>;
  let mockLoanService: jasmine.SpyObj<LoanApplicationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);
    const borrowerServiceSpy = jasmine.createSpyObj('BorrowerRequestService', ['getMyRequests']);
    const loanServiceSpy = jasmine.createSpyObj('LoanApplicationService', ['getBorrowerApplications']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BorrowerDashboardComponent, CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: BorrowerRequestService, useValue: borrowerServiceSpy },
        { provide: LoanApplicationService, useValue: loanServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BorrowerDashboardComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockBorrowerService = TestBed.inject(BorrowerRequestService) as jasmine.SpyObj<BorrowerRequestService>;
    mockLoanService = TestBed.inject(LoanApplicationService) as jasmine.SpyObj<LoanApplicationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data', () => {
    expect(component.myRequests).toEqual([]);
    expect(component.myApplications).toEqual([]);
    expect(component.eligibleLenders).toEqual([]);
    expect(component.error).toBe('');
  });

  it('should redirect to login if not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    
    component.ngOnInit();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load data if logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockBorrowerService.getMyRequests.and.returnValue(of([]));
    mockLoanService.getBorrowerApplications.and.returnValue(of([]));
    
    component.ngOnInit();
    
    expect(mockBorrowerService.getMyRequests).toHaveBeenCalled();
    expect(mockLoanService.getBorrowerApplications).toHaveBeenCalled();
  });

  it('should load my requests successfully', () => {
    const mockRequests = [{ 
      id: 1, 
      loanAmount: 1000, 
      loanPurpose: 'Personal', 
      employmentStatus: 'SALARIED', 
      creditScore: 700, 
      age: 30, 
      salary: 50000 
    }];
    mockBorrowerService.getMyRequests.and.returnValue(of(mockRequests));
    
    component.loadMyRequests();
    
    expect(component.myRequests).toEqual(mockRequests);
    expect(component.error).toBe('');
  });

  it('should handle error when loading requests fails', () => {
    mockBorrowerService.getMyRequests.and.returnValue(throwError(() => new Error('Request failed')));
    
    component.loadMyRequests();
    
    expect(component.error).toBe('Failed to load requests. Please try again.');
  });

  it('should load my applications successfully', () => {
    const mockApplications = [{ 
      loanApplicationId: 1, 
      loanAmount: 1000, 
      loanPurpose: 'Personal', 
      borrowerName: 'John Doe', 
      status: 'PENDING', 
      creditScore: 700, 
      age: 30,
      lenderCompanyName: 'Test Bank',
      interestRate: 10
    }];
    mockLoanService.getBorrowerApplications.and.returnValue(of(mockApplications));
    
    component.loadMyApplications();
    
    expect(component.myApplications).toEqual(mockApplications);
    expect(component.error).toBe('');
  });

  it('should handle error when loading applications fails', () => {
    mockLoanService.getBorrowerApplications.and.returnValue(throwError(() => new Error('Request failed')));
    
    component.loadMyApplications();
    
    expect(component.error).toBe('Failed to load applications. Please try again.');
  });

  it('should navigate to apply loan page', () => {
    component.navigateToCard('apply');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/borrower/apply-loan']);
  });

  it('should navigate to eligible lenders page', () => {
    component.navigateToCard('lenders');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/borrower/eligible-lenders']);
  });

  it('should navigate to my applications page', () => {
    component.navigateToCard('applications');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/borrower/my-applications']);
  });

  it('should navigate to loan calculator page', () => {
    component.navigateToCard('calculator');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/borrower/loan-calculator']);
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
