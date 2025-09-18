import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LenderRulesService } from './lender-rules.service';
import { CreateRule, RuleResponse } from '../models/lender-rule.dto';

describe('LenderRulesService', () => {
  let service: LenderRulesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LenderRulesService]
    });
    service = TestBed.inject(LenderRulesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get eligible lenders successfully', () => {
    const mockLenders = [
      { id: 1, interestRate: 10, minimumLoanAmount: 5000 },
      { id: 2, interestRate: 12, minimumLoanAmount: 10000 }
    ];
    localStorage.setItem('token', 'test-token');

    service.getEligibleLenders(1).subscribe(lenders => {
      expect(lenders).toEqual(mockLenders);
    });

    const req = httpMock.expectOne('http://localhost:8080/lender_rules/eligible-lenders/1');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockLenders);
  });

  it('should get eligible lenders without token', () => {
    const mockLenders = [{ id: 1, interestRate: 10 }];

    service.getEligibleLenders(1).subscribe(lenders => {
      expect(lenders).toEqual(mockLenders);
    });

    const req = httpMock.expectOne('http://localhost:8080/lender_rules/eligible-lenders/1');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockLenders);
  });

  it('should create rule successfully', () => {
    const mockRuleData: CreateRule = {
      minimumLoanAmount: 10000,
      maximumLoanAmount: 50000,
      interestRate: 10,
      minimumCreditScore: 700,
      minimumAge: 25,
      maximumAge: 60,
      minimumSalary: 50000,
      employmentTypes: 'SALARIED',
      ruleStatus: 'ACTIVE'
    };
    const mockResponse = { id: 1, message: 'Rule created successfully' };
    localStorage.setItem('token', 'test-token');

    service.createRule(mockRuleData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/lender_rules/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRuleData);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should update rule successfully', () => {
    const mockRuleData: CreateRule = {
      minimumLoanAmount: 15000,
      maximumLoanAmount: 60000,
      interestRate: 12,
      minimumCreditScore: 750,
      minimumAge: 25,
      maximumAge: 60,
      minimumSalary: 60000,
      employmentTypes: 'SALARIED',
      ruleStatus: 'ACTIVE'
    };
    const mockResponse = { id: 1, message: 'Rule updated successfully' };
    localStorage.setItem('token', 'test-token');

    service.updateRule(1, mockRuleData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/lender_rules/update/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockRuleData);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should get my rules successfully', () => {
    const mockRules: RuleResponse[] = [
      { id: 1, interestRate: 10, minimumLoanAmount: 10000 },
      { id: 2, interestRate: 12, minimumLoanAmount: 20000 }
    ];
    localStorage.setItem('token', 'test-token');

    service.getMyRules().subscribe(rules => {
      expect(rules).toEqual(mockRules);
    });

    const req = httpMock.expectOne('http://localhost:8080/lender_rules/my-rules');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockRules);
  });

  it('should delete rule successfully', () => {
    const mockResponse = { message: 'Rule deleted successfully' };
    localStorage.setItem('token', 'test-token');

    service.deleteRule(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/lender_rules/delete/1');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should handle requests without token', () => {
    const mockRuleData: CreateRule = {
      minimumLoanAmount: 10000,
      maximumLoanAmount: 50000,
      interestRate: 10,
      minimumCreditScore: 700,
      minimumAge: 25,
      maximumAge: 60,
      minimumSalary: 50000,
      employmentTypes: 'SALARIED',
      ruleStatus: 'ACTIVE'
    };

    service.createRule(mockRuleData).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/lender_rules/create');
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush({});
  });
});
