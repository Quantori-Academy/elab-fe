import { Injectable } from '@angular/core';
import { IUser, UserRoles } from '../../shared/types/IUser';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockProfileService {
  private mockUser: IUser = {
    id: 12,
    email: 'johndoe@example.com',
    password: 'John123!',
    role: UserRoles.Researcher,
    firstName: 'John',
    lastName: 'Doe',
  };
  getUserProfile(): Observable<IUser> {
    return of(this.mockUser);
  }
  updatePassword(newPassword: string): Observable<boolean> {
    this.mockUser.password = newPassword;
    console.log(`Password changed to: ${newPassword}, user's new password is ${this.mockUser.password}`);
    return of(true);
  }
}
