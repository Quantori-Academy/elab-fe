import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Injectable({ providedIn: 'root' })
export class LogoutService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  private logOutUrl = environment.apiUrl + '/api/v1/auth/logout';

  onLogoutUser(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.httpClient
      .delete(this.logOutUrl, { headers, withCredentials: true })
      .pipe(
        catchError(() => {
          return throwError(() => new Error());
        })
      )
      .subscribe({
        next: () => {
          location.href = '/login';
          this.authService.logout();
        },
        error: (error) => {
          console.error('Logout Failed: ', error);
        },
      });
  }
}
