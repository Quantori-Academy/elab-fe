import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then((routes) => routes.AuthRoutes),
    pathMatch: 'prefix',
  },
  {
    path: 'dashboard',
    component: LoginComponent,
    canActivate: [authGuard],
  },
];
