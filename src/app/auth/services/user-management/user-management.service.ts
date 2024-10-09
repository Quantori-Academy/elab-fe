import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = 'http://vm5.quantori.academy:3001/api/v1/users';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    alert('An error occurred!');

    return throwError(
      () => new Error(error.error.message || JSON.stringify(error.error))
    );
  }

  private createHeaders(extendedHeaders?: HttpHeaders): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (extendedHeaders) {
      extendedHeaders.keys().forEach((key) => {
        headers = headers.append(key, extendedHeaders.get(key) || '');
      });
    }
    return headers;
  }

  // CREATE User
  createUser(userData: unknown, headers?: HttpHeaders): Observable<unknown> {
    return this.http
      .post<unknown>(`${this.apiUrl}/create-user  `, userData, {
        headers: this.createHeaders(headers),
      })
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
      .patch<unknown>(`${this.apiUrl}/${userId}/role`, updatedData, {
        headers: this.createHeaders(headers),
      })
      .pipe(
        tap(() => alert('User updated successfully!')),
        catchError(this.handleError)
      );
  }

  // DELETE User
  deleteUser(userId: number, headers?: HttpHeaders): Observable<unknown> {
    return this.http
      .delete<unknown>(`${this.apiUrl}/${userId}`, {
        headers: this.createHeaders(headers),
      })
      .pipe(
        tap(() => alert('User deleted successfully!')),
        catchError(this.handleError)
      );
  }
}
