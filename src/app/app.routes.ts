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
        loadChildren: () =>
          import('./pages/reagents-list/reagent.router').then((r) => r.routes),
        canActivate: [authGuard],
      },
      {
        path: 'reagent-request-page',
        loadComponent: () =>
          import(
            './pages/reagent-request/reagent-request-page/reagent-request-page.component'
          ).then((c) => c.ReagentsRequestPageComponent),
        canActivate: [authGuard],
      },
      {
        path: 'reagent-request-page/create-reagent-request',
        loadComponent: () =>
          import(
            './pages/reagent-request/create-reagent-request/create-reagent-request.component'
          ).then((c) => c.CreateReagentRequestComponent),
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders-list/orders-list.component').then(
            (c) => c.OrdersListComponent
          ),
        canActivate: [authGuard, roleGuard],
        data: { role: UserRoles.ProcurementOfficer },
      },
      {
        path: 'orders/create-order',
        loadComponent: () =>
          import(
            './pages/orders-list/components/order-form/order-form.component'
          ).then((c) => c.OrderFormComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: UserRoles.ProcurementOfficer },
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import(
            './pages/orders-list/components/order-page/order-page.component'
          ).then((c) => c.OrderPageComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: UserRoles.ProcurementOfficer },
      },
      {
        path: 'reagent-request-page/details/:id',
        loadComponent: () =>
          import(
            './pages/reagent-request/reagent-request-detail/reagent-request-detail.component'
          ).then((c) => c.ReagentRequestDetailComponent),
        canActivate: [authGuard],
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
