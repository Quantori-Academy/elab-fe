import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '../authentication/authstate.service';

@Injectable({ providedIn: 'root' })
export class LogoutService {
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private authStateService: AuthStateService
  ) {}

  private logOutUrl = environment.apiUrl + '/api/v1/auth/logout';

  onLogoutUser(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.httpClient
      .delete(this.logOutUrl, { headers })
      .pipe(
        catchError(() => {
          return throwError(() => new Error());
        })
      )
      .subscribe({
        next: () => {
          localStorage.removeItem('access_token');
          this.authStateService.logoutEvent.next();
          this.router.createUrlTree(['/login']);
        },
        error: (error) => {
          console.error('Logout Failed: ', error);
        },
      });
  }
}
