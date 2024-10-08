import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        (comp) => comp.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
        (comp) => comp.ResetPasswordComponent
      ),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
