import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';
import { UserRoles } from './shared/models/user-models';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import(
            './pages/profile-management/profile-management.component'
          ).then((c) => c.ProfilePageComponent),
      },
      {
        path: 'storage-locations',
        loadComponent: () =>
          import('./pages/storage-location/storage-location.component').then(
            (c) => c.StorageLocationComponent
          ),
        canActivate: [authGuard],
        pathMatch: 'full',
      },
      {
        path: 'storage-locations/:id',
        loadComponent: () =>
          import(
            './pages/storage-location-detail/storage-location-detail.component'
          ).then((c) => c.StorageLocationDetailComponent),
        canActivate: [authGuard],
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users-list/users-list.component').then(
            (c) => c.UsersListComponent
          ),
        canActivate: [roleGuard],
        data: { role: UserRoles.Admin },
      },
      {
        path: 'reagents',
        loadComponent: () =>
          import('./pages/reagents-list/reagents-list.component').then(
            (c) => c.ReagentsListComponent
          ),
        canActivate: [authGuard, roleGuard],
        data: { role: UserRoles.Admin },
      },
      {
        path: 'reagent-request-page',
        loadComponent: () =>
          import(
            './pages/reagent-request-page/reagent-request-page.component'
          ).then((c) => c.ReagentsRequestPageComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: UserRoles.ProcurementOfficer },
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        (c) => c.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
        (c) => c.ResetPasswordComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-management/profile-management.component').then(
        (c) => c.ProfilePageComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users-list/users-list.component').then(
        (c) => c.UsersListComponent
      ),
    canActivate: [authGuard, roleGuard],
    data: { role: UserRoles.Admin },
  },
  {
    path: 'first-password-change',
    loadComponent: () =>
      import(
        './pages/first-password-change/first-password-change.component'
      ).then((c) => c.FirstPasswordChangeComponent),
  },
];
