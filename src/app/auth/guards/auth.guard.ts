import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/authentication/auth.service';
import { map, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return of(router.createUrlTree(['/login']));
  } else {
    return authService.getCurrentUser().pipe(
      map((user) => {
        if (user.isPasswordResetRequired) {
          return router.createUrlTree(['/first-password-change']);
        } else {
          return true;
        }
      }),
      catchError(() => {
        return of(router.createUrlTree(['/login']));
      })
    );
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
