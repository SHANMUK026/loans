import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LenderDashboardComponent } from './lender-dashboard.component';
import { AuthService } from '../../services/auth.service';
import { LenderRulesService } from '../../services/lender-rules.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { CommonModule } from '@angular/common';

describe('LenderDashboardComponent', () => {
  let component: LenderDashboardComponent;
  let fixture: ComponentFixture<LenderDashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockLenderService: jasmine.SpyObj<LenderRulesService>;
  let mockLoanService: jasmine.SpyObj<LoanApplicationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);
    const lenderServiceSpy = jasmine.createSpyObj('LenderRulesService', ['getMyRules']);
    const loanServiceSpy = jasmine.createSpyObj('LoanApplicationService', ['getLenderApplications']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LenderDashboardComponent, CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LenderRulesService, useValue: lenderServiceSpy },
        { provide: LoanApplicationService, useValue: loanServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LenderDashboardComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockLenderService = TestBed.inject(LenderRulesService) as jasmine.SpyObj<LenderRulesService>;
    mockLoanService = TestBed.inject(LoanApplicationService) as jasmine.SpyObj<LoanApplicationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty data', () => {
    expect(component.myRules).toEqual([]);
    expect(component.incomingApplications).toEqual([]);
    expect(component.error).toBe('');
  });

  it('should redirect to login if not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    
    component.ngOnInit();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load data if logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockLenderService.getMyRules.and.returnValue(of([]));
    mockLoanService.getLenderApplications.and.returnValue(of([]));
    
    component.ngOnInit();
    
    expect(mockLenderService.getMyRules).toHaveBeenCalled();
    expect(mockLoanService.getLenderApplications).toHaveBeenCalled();
  });

  it('should load my rules successfully', () => {
    const mockRules = [{ id: 1, interestRate: 10 }];
    mockLenderService.getMyRules.and.returnValue(of(mockRules));
    
    component.loadMyRules();
    
    expect(component.myRules).toEqual(mockRules);
    expect(component.error).toBe('');
  });

  it('should handle error when loading rules fails', () => {
    mockLenderService.getMyRules.and.returnValue(throwError(() => new Error('Request failed')));
    
    component.loadMyRules();
    
    expect(component.error).toBe('Failed to load rules. Please try again.');
  });

  it('should load incoming applications successfully', () => {
    const mockApplications = [{ id: 1, loanAmount: 10000 }];
    mockLoanService.getLenderApplications.and.returnValue(of(mockApplications));
    
    component.loadIncomingApplications();
    
    expect(component.incomingApplications).toEqual(mockApplications);
    expect(component.error).toBe('');
  });

  it('should handle error when loading applications fails', () => {
    mockLoanService.getLenderApplications.and.returnValue(throwError(() => new Error('Request failed')));
    
    component.loadIncomingApplications();
    
    expect(component.error).toBe('Failed to load applications. Please try again.');
  });

  it('should navigate to create rule page', () => {
    component.navigateToCard('create');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lender/create-rule']);
  });

  it('should navigate to my rules page', () => {
    component.navigateToCard('rules');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lender/my-rules']);
  });

  it('should navigate to incoming applications page', () => {
    component.navigateToCard('applications');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lender/incoming-applications']);
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
