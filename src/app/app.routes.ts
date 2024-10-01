import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then((routes) => routes.AuthRoutes),
    pathMatch: 'full',
  }, {
    path: 'profile-page',
    pathMatch: 'full',
    loadComponent: () =>
      import('./shared/components/profile-management/profile-management.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
];
