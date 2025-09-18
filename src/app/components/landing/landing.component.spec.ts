import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LandingComponent } from './landing.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LandingComponent, CommonModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with welcome message', () => {
    expect(component.message).toBe('Welcome to Loan Eligibility Checker');
  });

  it('should navigate to login page', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to register page', () => {
    component.goToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });
});
