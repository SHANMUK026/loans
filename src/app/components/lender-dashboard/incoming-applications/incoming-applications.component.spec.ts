import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IncomingApplicationsComponent } from './incoming-applications.component';
import { LoanApplicationService } from '../../../services/loan-application.service';
import { CommonModule } from '@angular/common';

describe('IncomingApplicationsComponent', () => {
  let component: IncomingApplicationsComponent;
  let fixture: ComponentFixture<IncomingApplicationsComponent>;
  let mockLoanService: jasmine.SpyObj<LoanApplicationService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const loanServiceSpy = jasmine.createSpyObj('LoanApplicationService', ['getLenderApplications', 'updateLoanStatus']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [IncomingApplicationsComponent, CommonModule],
      providers: [
        { provide: LoanApplicationService, useValue: loanServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IncomingApplicationsComponent);
    component = fixture.componentInstance;
    mockLoanService = TestBed.inject(LoanApplicationService) as jasmine.SpyObj<LoanApplicationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.applications).toEqual([]);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
    expect(component.sortField).toBe('');
    expect(component.sortDirection).toBe('asc');
  });

  it('should load applications on init', () => {
    const mockApplications = [
      { id: 1, loanAmount: 10000, status: 'PENDING' },
      { id: 2, loanAmount: 20000, status: 'APPROVED' }
    ];
    mockLoanService.getLenderApplications.and.returnValue(of(mockApplications));

    component.ngOnInit();

    expect(mockLoanService.getLenderApplications).toHaveBeenCalled();
    expect(component.applications).toEqual(mockApplications);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading applications fails', () => {
    const error = { error: { message: 'Failed to load applications' } };
    mockLoanService.getLenderApplications.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(component.error).toBe('Failed to load applications');
    expect(component.loading).toBeFalse();
  });

  it('should update application status successfully', () => {
    const mockApplications = [{ id: 1, status: 'PENDING' }];
    mockLoanService.updateLoanStatus.and.returnValue(of({}));
    mockLoanService.getLenderApplications.and.returnValue(of(mockApplications));

    component.updateApplicationStatus(1, 'APPROVED');

    expect(mockLoanService.updateLoanStatus).toHaveBeenCalledWith(1, 'APPROVED');
    expect(component.loading).toBeFalse();
    expect(mockLoanService.getLenderApplications).toHaveBeenCalledTimes(2); // Once in ngOnInit, once after update
  });

  it('should handle error when updating application status fails', () => {
    const error = { error: { message: 'Update failed' } };
    mockLoanService.updateLoanStatus.and.returnValue(throwError(() => error));

    component.updateApplicationStatus(1, 'APPROVED');

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Update failed');
  });

  it('should get correct status class for different statuses', () => {
    expect(component.getStatusClass('APPROVED')).toBe('status-approved');
    expect(component.getStatusClass('REJECTED')).toBe('status-rejected');
    expect(component.getStatusClass('PENDING')).toBe('status-pending');
    expect(component.getStatusClass('UNDER_REVIEW')).toBe('status-under-review');
    expect(component.getStatusClass('UNKNOWN')).toBe('status-pending');
  });

  it('should navigate back to lender dashboard', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lender']);
  });

  it('should sort applications by field', () => {
    component.applications = [
      { id: 1, loanAmount: 20000, creditScore: 700 },
      { id: 2, loanAmount: 10000, creditScore: 800 }
    ];

    component.sortApplications('loanAmount');

    expect(component.sortField).toBe('loanAmount');
    expect(component.sortDirection).toBe('asc');
    expect(component.applications[0].loanAmount).toBe(10000);
    expect(component.applications[1].loanAmount).toBe(20000);
  });

  it('should toggle sort direction when sorting same field', () => {
    component.applications = [
      { id: 1, loanAmount: 20000 },
      { id: 2, loanAmount: 10000 }
    ];
    component.sortField = 'loanAmount';
    component.sortDirection = 'asc';

    component.sortApplications('loanAmount');

    expect(component.sortDirection).toBe('desc');
    expect(component.applications[0].loanAmount).toBe(20000);
    expect(component.applications[1].loanAmount).toBe(10000);
  });

  it('should sort by credit score numerically', () => {
    component.applications = [
      { id: 1, creditScore: '800' },
      { id: 2, creditScore: '700' }
    ];

    component.sortApplications('creditScore');

    expect(component.applications[0].creditScore).toBe('700');
    expect(component.applications[1].creditScore).toBe('800');
  });

  it('should sort by application date', () => {
    component.applications = [
      { id: 1, applicationDate: '2023-12-01' },
      { id: 2, applicationDate: '2023-11-01' }
    ];

    component.sortApplications('applicationDate');

    expect(component.applications[0].applicationDate).toBe('2023-11-01');
    expect(component.applications[1].applicationDate).toBe('2023-12-01');
  });

  it('should export to CSV when applications exist', () => {
    component.applications = [
      {
        loanApplicationId: 1,
        borrowerName: 'John Doe',
        loanAmount: 10000,
        loanPurpose: 'Personal',
        status: 'PENDING',
        creditScore: 700,
        age: 30,
        employmentStatus: 'SALARIED',
        applicationDate: '2023-12-01'
      }
    ];

    spyOn(document, 'createElement').and.callThrough();
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');

    component.exportToCSV();

    expect(document.createElement).toHaveBeenCalledWith('a');
  });

  it('should show alert when no applications to export to CSV', () => {
    component.applications = [];
    spyOn(window, 'alert');

    component.exportToCSV();

    expect(window.alert).toHaveBeenCalledWith('No applications to export');
  });

  it('should export to PDF when applications exist', () => {
    component.applications = [
      {
        loanApplicationId: 1,
        borrowerName: 'John Doe',
        loanAmount: 10000,
        loanPurpose: 'Personal',
        status: 'PENDING',
        creditScore: 700,
        age: 30,
        employmentStatus: 'SALARIED',
        applicationDate: '2023-12-01'
      }
    ];

    spyOn(window, 'open').and.returnValue({
      document: {
        write: jasmine.createSpy('write'),
        close: jasmine.createSpy('close')
      },
      print: jasmine.createSpy('print')
    } as any);

    component.exportToPDF();

    expect(window.open).toHaveBeenCalledWith('', '_blank');
  });

  it('should show alert when no applications to export to PDF', () => {
    component.applications = [];
    spyOn(window, 'alert');

    component.exportToPDF();

    expect(window.alert).toHaveBeenCalledWith('No applications to export');
  });
});
