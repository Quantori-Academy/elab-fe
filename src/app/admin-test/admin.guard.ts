import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { RbacService } from '../auth/services/authentication/rbac.service';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const rbacService = inject(RbacService);
  const router = inject(Router);

  if (rbacService.isGranted('Admin')) {
    return true;
  } else {
    return router.createUrlTree(['/access-denied']);
  }
};
