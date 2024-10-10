import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from '../shared/components/dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { noAuthGuard } from './noauth.guard';
import { UsersListComponent } from '../shared/components/grids/users-list/users-list.component';

export const AuthRoutes: Routes = [
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
    canActivate: [noAuthGuard],
  },

  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UsersListComponent },
      // {path: 'profile'}
    ],
  },

  { path: '**', redirectTo: 'login' },
];
