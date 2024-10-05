import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { authGuard } from './auth/auth.guard';
import { adminGuard } from './admin-test/admin.guard';
import { AdminTestComponent } from './admin-test/admin-test.component';

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
  {
    path: 'admin',
    component: AdminTestComponent,
    canActivate: [adminGuard, authGuard],
  },
  // {
  //   path: 'admin',
  //   component: AdminComponent,
  //   canActivate: [adminGuard]
  // }
];
