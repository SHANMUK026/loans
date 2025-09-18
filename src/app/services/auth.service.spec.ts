import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth-dto';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockLoginData: LoginRequest = {
      userName: 'testuser',
      password: 'testpass'
    };
    const mockResponse: LoginResponse = {
      token: 'test-token',
      role: 'BORROWER'
    };

    service.login(mockLoginData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginData);
    req.flush(mockResponse);
  });

  it('should register successfully', () => {
    const mockRegisterData: RegisterRequest = {
      userName: 'testuser',
      email: 'test@example.com',
      password: 'testpass',
      role: 'BORROWER'
    };
    const mockResponse = { message: 'Registration successful' };

    service.register(mockRegisterData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterData);
    req.flush(mockResponse);
  });

  it('should get token from localStorage', () => {
    localStorage.setItem('token', 'test-token');
    expect(service.getToken()).toBe('test-token');
  });

  it('should return null when no token in localStorage', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should set token in localStorage', () => {
    service.setToken('new-token');
    expect(localStorage.getItem('token')).toBe('new-token');
  });

  it('should remove token from localStorage', () => {
    localStorage.setItem('token', 'test-token');
    service.removeToken();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should return true when user is logged in', () => {
    localStorage.setItem('token', 'test-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false when user is not logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should logout by removing token', () => {
    localStorage.setItem('token', 'test-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should handle localStorage when window is undefined', () => {
    // Mock window as undefined
    const originalWindow = window;
    (global as any).window = undefined;

    expect(service.getToken()).toBeNull();
    service.setToken('test-token'); // Should not throw error
    service.removeToken(); // Should not throw error

    // Restore window
    (global as any).window = originalWindow;
  });
});
