import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '../authentication/authstate.service';

@Injectable({ providedIn: 'root' })
export class LogoutService {
  constructor(
    private httpClient: HttpClient,
    private authStateService: AuthStateService
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
          localStorage.removeItem('access_token');
          this.authStateService.logoutEvent.next();
        },
        error: (error) => {
          console.error('Logout Failed: ', error);
        },
      });
  }
}
