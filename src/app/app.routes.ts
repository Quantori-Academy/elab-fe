import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then((routes) => routes.AuthRoutes),
    pathMatch: 'prefix',
  },
];

/** 
// Uncomment to use

// You can use guard like this
// {
//   path: 'admin',
//   component: AdminComponent,
//   canActivate: [authGuard, roleGuard],
//   data: { role: 'Admin' },
// },

// Uncomment to use

// import { LoginComponent } from './auth/pages/login/login.component';
// import { authGuard } from './auth/auth.guard';
// import { roleGuard } from './auth/role.guard';
// import { AdminComponent } from './admin-test/admin-test.component';
*/
