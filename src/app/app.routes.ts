import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/pages/forgot-password/forgot-password.component').then(
        (comp) => comp.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/pages/reset-password/reset-password.component').then(
        (comp) => comp.ResetPasswordComponent
      ),
  },
];
