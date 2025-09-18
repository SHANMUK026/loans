import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'setToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, CommonModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.userName).toBe('');
    expect(component.password).toBe('');
    expect(component.error).toBe('');
    expect(component.loading).toBeFalse();
  });

  it('should show error when form fields are empty', () => {
    component.onLogin();
    expect(component.error).toBe('Please fill in all fields');
  });

  it('should show error when only username is provided', () => {
    component.userName = 'testuser';
    component.onLogin();
    expect(component.error).toBe('Please fill in all fields');
  });

  it('should show error when only password is provided', () => {
    component.password = 'testpass';
    component.onLogin();
    expect(component.error).toBe('Please fill in all fields');
  });

  it('should call authService.login with correct data', () => {
    component.userName = 'testuser';
    component.password = 'testpass';
    mockAuthService.login.and.returnValue(of({ token: 'test-token', role: 'BORROWER' }));

    component.onLogin();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      userName: 'testuser',
      password: 'testpass'
    });
  });

  it('should navigate to borrower dashboard on successful login with BORROWER role', () => {
    component.userName = 'testuser';
    component.password = 'testpass';
    mockAuthService.login.and.returnValue(of({ token: 'test-token', role: 'BORROWER' }));

    component.onLogin();

    expect(mockAuthService.setToken).toHaveBeenCalledWith('test-token');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/borrower']);
    expect(component.loading).toBeFalse();
  });

  it('should navigate to lender dashboard on successful login with LENDER role', () => {
    component.userName = 'testuser';
    component.password = 'testpass';
    mockAuthService.login.and.returnValue(of({ token: 'test-token', role: 'LENDER' }));

    component.onLogin();

    expect(mockAuthService.setToken).toHaveBeenCalledWith('test-token');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lender']);
    expect(component.loading).toBeFalse();
  });

  it('should handle login error and show appropriate message', () => {
    component.userName = 'testuser';
    component.password = 'testpass';
    const error = { status: 401, error: { message: 'Invalid credentials' } };
    mockAuthService.login.and.returnValue(throwError(() => error));

    component.onLogin();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Incorrect username or password. Please try again.');
  });

  it('should navigate to register page', () => {
    component.goToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to home page', () => {
    component.goToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
