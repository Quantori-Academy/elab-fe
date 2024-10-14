import { Injectable } from '@angular/core';
import { User } from '../../roles/types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RbacService {
  private _authenticatedUserSubject$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private _authenticatedUser!: User;

  public authenticatedUser$: Observable<User | null> = this._authenticatedUserSubject$.asObservable();

  setAuthenticatedUser(user: User) {
    this._authenticatedUser = user;
    this._authenticatedUserSubject$.next(user);
  }

  getAuthenticatedUser(): User | undefined {
    return this._authenticatedUser;
  }

  isGranted(requiredRole: string): boolean {
    if (!this._authenticatedUser) {
      return false;
    }
    return this._authenticatedUser.role === requiredRole;
  }

  isAdmin(): boolean {
    return this.isGranted('Admin');
  }

  isResearcher(): boolean {
    return this.isGranted('Researcher');
  }

  isProcurementOfficer(): boolean {
    return this.isGranted('ProcurementOfficer');
  }
}

/**
 * Inject into component and use like that in a template
 * @if (rbacService.isAdmin()) {
 * <div>Admin works</div>
 *  }
 *
 * Also inject like this:
 * readonly rbacService = inject(RbacService);
 *
 * You can you this to check in component
 *
 * this.checkUserRoles(); => in ngOnInit
 * checkUserRoles(): void {
 * if (this.rbacService.isAdmin()) {
 * console.log('User is Admin');
 * } else if (this.rbacService.isResearcher()) {
 * console.log('User is Researcher');
 * } else if (this.rbacService.isProcurementOfficer()) {
 * console.log('User is Procurement Officer');
 * } else {
 * console.log('User has no specific role');
 *  }
 * }
 */
