import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../roles/types';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserRolesService {
  constructor(private http: HttpClient) {}
  private meUrl = environment.apiUrl + 'api/v1/users';

  getAuthenticatedUser(): Observable<User> {
    return this.http.get<User>(this.meUrl).pipe(
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
