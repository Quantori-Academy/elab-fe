import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { RbacService } from '../services/authentication/rbac.service';
import { AuthService } from '../services/authentication/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (
  route
): Observable<boolean | UrlTree> => {
  const rbacService = inject(RbacService);
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiredRole = route.data['role'] as string;

  const user = rbacService.getAuthenticatedUser();

  if (!user) {
    return authService.getCurrentUser().pipe(
      map(() => {
        const currentUser = rbacService.getAuthenticatedUser();

        if (!currentUser) {
          console.error('User is not set in RBAC service.');
          return router.createUrlTree(['/dashboard']);
        }

        if (rbacService.isGranted(requiredRole)) {
          return true;
        } else {
          return router.createUrlTree(['/dashboard']);
        }
      }),
      catchError((error) => {
        console.error('Error fetching user:', error);
        return of(router.createUrlTree(['/dashboard']));
      })
    );
  } else {
    if (rbacService.isGranted(requiredRole)) {
      return of(true);
    } else {
      return of(router.createUrlTree(['/dashboard']));
    }
  }
};
