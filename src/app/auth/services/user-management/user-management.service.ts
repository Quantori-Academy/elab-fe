import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { IUserInfo } from '../../../shared/models/user-models';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = environment.apiUrl + '/api/v1/users';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(
      () => new Error(error.error.message || JSON.stringify(error.error))
    );
  }

  // CREATE User
  createUser(
    userData: IUserInfo,
    headers?: HttpHeaders
  ): Observable<IUserInfo> {
    return this.http
      .post<IUserInfo>(`${this.apiUrl}/`, userData, { headers })
      .pipe(catchError(this.handleError));
  }

  // UPDATE User
  updateUser(
    userId: number,
    updatedData: IUserInfo,
    headers?: HttpHeaders
  ): Observable<IUserInfo> {
    return this.http
      .patch<IUserInfo>(`${this.apiUrl}/${userId}/role`, updatedData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  // DELETE User
  deleteUser(userId: number, headers?: HttpHeaders): Observable<string> {
    return this.http
      .delete<string>(`${this.apiUrl}/${userId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // GET All Users
  getAllUsers(headers?: HttpHeaders): Observable<IUserInfo[]> {
    return this.http
      .get<IUserInfo[]>(`${this.apiUrl}/`, { headers })
      .pipe(catchError(this.handleError));
  }

  // GET user
  getUser(userId: number, headers?: HttpHeaders): Observable<IUserInfo> {
    return this.http
      .get<IUserInfo>(`${this.apiUrl}/${userId}`, { headers })
      .pipe(catchError(this.handleError));
  }
}
