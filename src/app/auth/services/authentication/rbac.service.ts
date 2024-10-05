import { Injectable } from '@angular/core';
import { User } from '../../roles/types';

@Injectable({
  providedIn: 'root',
})
export class RbacService {
  private _authenticatedUser!: User;

  setAuthenticatedUser(user: User) {
    this._authenticatedUser = user;
  }

  isGranted(requiredRole: string, user?: User): boolean {
    if (!user) {
      user = this._authenticatedUser;
    }
    if (!user) {
      return false;
    }
    return user.role === requiredRole;
  }
}
