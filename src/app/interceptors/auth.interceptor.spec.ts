import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    mockHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when token exists', () => {
    localStorage.setItem('token', 'test-token');
    const mockRequest = new HttpRequest('GET', '/test');
    const mockResponse = { status: 200 };
    mockHandler.handle.and.returnValue(of(mockResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(mockHandler.handle).toHaveBeenCalled();
    const interceptedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(interceptedRequest.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should not add Authorization header when no token exists', () => {
    localStorage.removeItem('token');
    const mockRequest = new HttpRequest('GET', '/test');
    const mockResponse = { status: 200 };
    mockHandler.handle.and.returnValue(of(mockResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(mockHandler.handle).toHaveBeenCalled();
    const interceptedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(interceptedRequest.headers.get('Authorization')).toBeNull();
  });

  it('should handle request without modification when window is undefined', () => {
    // Mock window as undefined
    const originalWindow = window;
    (global as any).window = undefined;

    const mockRequest = new HttpRequest('GET', '/test');
    const mockResponse = { status: 200 };
    mockHandler.handle.and.returnValue(of(mockResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(mockHandler.handle).toHaveBeenCalled();
    const interceptedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(interceptedRequest.headers.get('Authorization')).toBeNull();

    // Restore window
    (global as any).window = originalWindow;
  });

  it('should preserve existing headers when adding Authorization', () => {
    localStorage.setItem('token', 'test-token');
    const mockRequest = new HttpRequest('GET', '/test', null, {
      headers: { 'Content-Type': 'application/json' }
    });
    const mockResponse = { status: 200 };
    mockHandler.handle.and.returnValue(of(mockResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(mockHandler.handle).toHaveBeenCalled();
    const interceptedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(interceptedRequest.headers.get('Authorization')).toBe('Bearer test-token');
    expect(interceptedRequest.headers.get('Content-Type')).toBe('application/json');
  });

  it('should handle empty token', () => {
    localStorage.setItem('token', '');
    const mockRequest = new HttpRequest('GET', '/test');
    const mockResponse = { status: 200 };
    mockHandler.handle.and.returnValue(of(mockResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(mockHandler.handle).toHaveBeenCalled();
    const interceptedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(interceptedRequest.headers.get('Authorization')).toBeNull();
  });
});
