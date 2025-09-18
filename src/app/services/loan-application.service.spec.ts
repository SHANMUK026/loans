import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoanApplicationService } from './loan-application.service';
import { EligibleLender, LoanApplication, MyApplication } from '../models/loan-application.dto';

describe('LoanApplicationService', () => {
  let service: LoanApplicationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoanApplicationService]
    });
    service = TestBed.inject(LoanApplicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create application successfully', () => {
    const mockApplicationData = { ruleIds: [1, 2] };
    const mockResponse = { id: 1, message: 'Application created successfully' };
    localStorage.setItem('token', 'test-token');

    service.createApplication(mockApplicationData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/loans/apply');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockApplicationData);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should get eligible lenders successfully', () => {
    const mockLenders: EligibleLender[] = [
      { id: 1, interestRate: 10, minimumLoanAmount: 5000 },
      { id: 2, interestRate: 12, minimumLoanAmount: 10000 }
    ];
    localStorage.setItem('token', 'test-token');

    service.getEligibleLenders(1, 50000).subscribe(lenders => {
      expect(lenders).toEqual(mockLenders);
    });

    const req = httpMock.expectOne('http://localhost:8080/loans/1/eligible-lenders');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockLenders);
  });

  it('should throw error for invalid request ID', () => {
    expect(() => service.getEligibleLenders(0, 50000)).toThrowError('Invalid request ID');
    expect(() => service.getEligibleLenders(-1, 50000)).toThrowError('Invalid request ID');
    expect(() => service.getEligibleLenders(NaN, 50000)).toThrowError('Invalid request ID');
  });

  it('should apply for loan successfully', () => {
    const mockResponse = { id: 1, message: 'Loan application submitted' };
    localStorage.setItem('token', 'test-token');

    service.applyForLoan(1, 2).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/loans/apply/request/1/rule/2');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should update loan status successfully', () => {
    const mockResponse = { message: 'Status updated successfully' };
    localStorage.setItem('token', 'test-token');

    service.updateLoanStatus(1, 'APPROVED').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/loans/update-status/1?status=APPROVED');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should get lender applications successfully', () => {
    const mockApplications: LoanApplication[] = [
      { id: 1, loanAmount: 10000, status: 'PENDING' },
      { id: 2, loanAmount: 20000, status: 'APPROVED' }
    ];
    localStorage.setItem('token', 'test-token');

    service.getLenderApplications().subscribe(applications => {
      expect(applications).toEqual(mockApplications);
    });

    const req = httpMock.expectOne('http://localhost:8080/loans/borrower-applications');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockApplications);
  });

  it('should get borrower applications successfully', () => {
    const mockApplications: MyApplication[] = [
      { id: 1, loanAmount: 10000, status: 'PENDING' },
      { id: 2, loanAmount: 20000, status: 'APPROVED' }
    ];
    localStorage.setItem('token', 'test-token');

    service.getBorrowerApplications().subscribe(applications => {
      expect(applications).toEqual(mockApplications);
    });

    const req = httpMock.expectOne('http://localhost:8080/loans/borrower/my-applications');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockApplications);
  });

  it('should handle requests without token', () => {
    const mockApplicationData = { ruleIds: [1, 2] };

    service.createApplication(mockApplicationData).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/loans/apply');
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({});
  });
});
