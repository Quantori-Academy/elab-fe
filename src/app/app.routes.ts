import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile-page',
    pathMatch: 'full',
    loadComponent: () =>
      import('./shared/components/profile-management/profile-management.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
];
