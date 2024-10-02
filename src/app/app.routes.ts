import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then((routes) => routes.AuthRoutes),
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
];
