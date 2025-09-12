import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BorrowerDashboardComponent } from './components/borrower-dashboard/borrower-dashboard.component';
import { LenderDashboardComponent } from './components/lender-dashboard/lender-dashboard.component';
import { ApplyLoanComponent } from './components/borrower-dashboard/apply-loan/apply-loan.component';
import { EligibleLendersComponent } from './components/borrower-dashboard/eligible-lenders/eligible-lenders.component';
import { MyApplicationsComponent } from './components/borrower-dashboard/my-applications/my-applications.component';
import { CreateRuleComponent } from './components/lender-dashboard/create-rule/create-rule.component';
import { MyRulesComponent } from './components/lender-dashboard/my-rules/my-rules.component';
import { IncomingApplicationsComponent } from './components/lender-dashboard/incoming-applications/incoming-applications.component';
import { LoanCalculatorComponent } from './components/borrower-dashboard/loan-calculator/loan-calculator.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'borrower', component: BorrowerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'borrower/apply-loan', component: ApplyLoanComponent, canActivate: [AuthGuard] },
  { path: 'borrower/eligible-lenders', component: EligibleLendersComponent, canActivate: [AuthGuard] },
  { path: 'borrower/my-applications', component: MyApplicationsComponent, canActivate: [AuthGuard] },
  { path: 'borrower/loan-calculator', component: LoanCalculatorComponent, canActivate: [AuthGuard] },
  { path: 'lender', component: LenderDashboardComponent, canActivate: [AuthGuard] },
  { path: 'lender/create-rule', component: CreateRuleComponent, canActivate: [AuthGuard] },
  { path: 'lender/my-rules', component: MyRulesComponent, canActivate: [AuthGuard] },
  { path: 'lender/incoming-applications', component: IncomingApplicationsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];