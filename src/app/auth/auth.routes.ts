import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    redirectTo: 'forgot-password',
    pathMatch: 'full',
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
];
