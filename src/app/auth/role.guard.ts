import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RbacService } from './services/authentication/rbac.service';
import { Router } from '@angular/router';
import { AuthService } from './services/authentication/auth.service';

export const roleGuard: CanActivateFn = async (route) => {
  const rbacService = inject(RbacService);
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiredRole = route.data['role'] as string;

  try {
    await authService.getCurrentUser();
  } catch (error) {
    console.error('Error fetching user:', error);
    return router.createUrlTree(['/dashboard']);
  }

  const user = rbacService.getAuthenticatedUser();

  if (!user) {
    console.error('User is not set in RBAC service.');
    return router.createUrlTree(['/dashboard']);
  }

  if (rbacService.isGranted(requiredRole)) {
    return true;
  } else {
    return router.createUrlTree(['/dashboard']);
  }
};
