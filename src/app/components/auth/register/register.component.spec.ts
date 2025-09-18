import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, CommonModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.userName).toBe('');
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
    expect(component.role).toBe('BORROWER');
    expect(component.error).toBe('');
    expect(component.loading).toBeFalse();
  });

  it('should show error when form fields are empty', () => {
    component.onRegister();
    expect(component.error).toBe('Please fill in all fields');
  });

  it('should show error when passwords do not match', () => {
    component.userName = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'different123';
    component.onRegister();
    expect(component.error).toBe('Passwords do not match');
  });

  it('should show error for invalid email format', () => {
    component.userName = 'testuser';
    component.email = 'invalid-email';
    component.password = 'password123';
    component.confirmPassword = 'password123';
    component.onRegister();
    expect(component.error).toBe('Please enter a valid email address');
  });

  it('should call authService.register with correct data', () => {
    component.userName = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';
    component.role = 'BORROWER';
    mockAuthService.register.and.returnValue(of({ message: 'Registration successful' }));

    component.onRegister();

    expect(mockAuthService.register).toHaveBeenCalledWith({
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'BORROWER'
    });
  });

  it('should navigate to login page on successful registration', () => {
    component.userName = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';
    mockAuthService.register.and.returnValue(of({ message: 'Registration successful' }));

    component.onRegister();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.loading).toBeFalse();
  });

  it('should handle registration error and show appropriate message', () => {
    component.userName = 'testuser';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.confirmPassword = 'password123';
    const error = { status: 400, error: { message: 'Username already exists' } };
    mockAuthService.register.and.returnValue(throwError(() => error));

    component.onRegister();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Username already exists');
  });

  it('should navigate to login page', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to home page', () => {
    component.goToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
