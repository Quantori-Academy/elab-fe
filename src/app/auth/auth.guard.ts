import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './services/authentication/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};

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
