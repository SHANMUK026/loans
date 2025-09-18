import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login when user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
