import { Routes } from '@angular/router';

// Uncomment to use

import { LoginComponent } from './auth/pages/login/login.component';
import { authGuard } from './auth/auth.guard';
// import { roleGuard } from './auth/role.guard';
// import { AdminComponent } from './admin-test/admin-test.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then((routes) => routes.AuthRoutes),
    pathMatch: 'prefix',
  }, {
    path: 'profile',
    pathMatch: 'full',
    loadComponent: () =>
      import('./shared/components/profile-management/profile-management.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
  {
    path: 'storage-location',
    loadComponent: () =>
      import('./main/pages/storage-location/storage-location.component').then(
        (comp) => comp.StorageLocationComponent
      ),
  },

  // Uncomment to use

  {
    path: 'dashboard',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  // You can use guard like this
  // {
  //   path: 'admin',
  //   component: AdminComponent,
  //   canActivate: [authGuard, roleGuard],
  //   data: { role: 'Admin' },
  // },
];
