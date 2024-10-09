import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = environment.apiUrl + '/api/v1/users';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    alert('An error occurred!');

    return throwError(
      () => new Error(error.error.message || JSON.stringify(error.error))
    );
  }

  // CREATE User
  createUser(userData: unknown, headers?: HttpHeaders): Observable<unknown> {
    return this.http
      .post<unknown>(`${this.apiUrl}/create-user  `, userData, { headers })
      .pipe(
        tap(() => alert('User created successfully!')),
        catchError(this.handleError)
      );
  }

  // UPDATE User
  updateUser(
    userId: number,
    updatedData: unknown,
    headers?: HttpHeaders
  ): Observable<unknown> {
    return this.http
      .patch<unknown>(`${this.apiUrl}/${userId}/role`, updatedData, { headers })
      .pipe(catchError(this.handleError));
  }

  // DELETE User
  deleteUser(userId: number, headers?: HttpHeaders): Observable<unknown> {
    return this.http
      .delete<unknown>(`${this.apiUrl}/${userId}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
