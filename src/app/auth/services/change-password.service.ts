import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChangedPassword } from '../models/changePassword.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  private apiUrl = `${environment.apiUrl}/api/v1/users/change-password`;

  constructor(private http: HttpClient) {}

  changePassword(newPasswordObj: ChangedPassword): Observable<ChangedPassword> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return throwError('No access token found');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ChangedPassword>(this.apiUrl, newPasswordObj, {
      headers,
    }).pipe(
      catchError((error) => {
        console.error('Password change failed:', error);
        return throwError(error);
      })
    );
  }
}