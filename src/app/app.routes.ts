import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BorrowerDashboardComponent } from './components/borrower-dashboard/borrower-dashboard.component';
import { LenderDashboardComponent } from './components/lender-dashboard/lender-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'borrower', component: BorrowerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'lender', component: LenderDashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];