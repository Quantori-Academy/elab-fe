import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../roles/types';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UdpateUserRolesService {
  constructor(private http: HttpClient) {}

  private rolesUrl = environment.apiUrl + '/api/v1/users';

  updateUserRole(userId: number, newRole: string): Observable<User> {
    return this.http
      .patch<User>(
        `${this.rolesUrl}/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      )
      .pipe(
        map((response: User) => {
          return {
            id: response.id,
            email: response.email,
            role: response.role as string,
          } as User;
        })
      );
  }
}

/**
 * You can use this component and update it in a future if necessary
 *
 */
