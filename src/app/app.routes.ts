import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile-page',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
];
