import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BorrowerRequestService } from './borrower-request.service';
import { CreateRequest, RequestResponse } from '../models/borrower-req.dto';

describe('BorrowerRequestService', () => {
  let service: BorrowerRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BorrowerRequestService]
    });
    service = TestBed.inject(BorrowerRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create request successfully', () => {
    const mockRequestData: CreateRequest = {
      loanAmount: 10000,
      loanPurpose: 'Personal',
      employmentStatus: 'SALARIED',
      creditScore: 700,
      age: 30,
      salary: 50000
    };
    const mockResponse = { id: 1, message: 'Request created successfully' };
    localStorage.setItem('token', 'test-token');

    service.createRequest(mockRequestData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/borrower_request');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequestData);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should create request without token', () => {
    const mockRequestData: CreateRequest = {
      loanAmount: 10000,
      loanPurpose: 'Personal',
      employmentStatus: 'SALARIED',
      creditScore: 700,
      age: 30,
      salary: 50000
    };
    const mockResponse = { id: 1, message: 'Request created successfully' };

    service.createRequest(mockRequestData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/borrower_request');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequestData);
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should get my requests successfully', () => {
    const mockRequests: RequestResponse[] = [
      { id: 1, loanAmount: 10000, status: 'PENDING' },
      { id: 2, loanAmount: 20000, status: 'APPROVED' }
    ];
    localStorage.setItem('token', 'test-token');

    service.getMyRequests().subscribe(requests => {
      expect(requests).toEqual(mockRequests);
    });

    const req = httpMock.expectOne('http://localhost:8080/borrower_request');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockRequests);
  });

  it('should get my requests without token', () => {
    const mockRequests: RequestResponse[] = [
      { id: 1, loanAmount: 10000, status: 'PENDING' }
    ];

    service.getMyRequests().subscribe(requests => {
      expect(requests).toEqual(mockRequests);
    });

    const req = httpMock.expectOne('http://localhost:8080/borrower_request');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockRequests);
  });
});
