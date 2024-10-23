import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Observable, of, throwError, Subject } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { RbacService } from './rbac.service';
import LoginResponse from '../../auth.interface';
import { User } from '../../roles/types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private logoutSubject = new Subject<void>();
  public logout$ = this.logoutSubject.asObservable();

  constructor(public rbacService: RbacService) {}

  private authUrl = environment.apiUrl + '/api/v1/auth/login';
  private userUrl = environment.apiUrl + '/api/v1/users/current';
  private refreshUrl = environment.apiUrl + '/api/v1/auth/refreshAccessToken';
  private access_token = signal<string | undefined>(undefined);
  private error = signal('');
  private isFetching = signal(false);
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  onLoginUser(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.isFetching.set(true);

    return this.httpClient
      .post<LoginResponse>(this.authUrl, body, {
        headers,
        withCredentials: true,
      })
      .pipe(
        tap((data) => {
          localStorage.setItem('access_token', data.access_token);
          this.access_token.set(data.access_token);
        }),
        switchMap((loginResponse) =>
          this.getCurrentUser().pipe(
            tap((user) => {
              if (user.isPasswordResetRequired) {
                this.router.navigate(['/first-password-change']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            }),
            map(() => loginResponse)
          )
        ),
        finalize(() => this.isFetching.set(false))
      );
  }

  getCurrentUser(): Observable<User> {
    const cachedUser = this.rbacService.getAuthenticatedUser();
    if (cachedUser) {
      return of(cachedUser);
    }

    const token = this.getAccessToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.httpClient
        .get<User>(this.userUrl, { headers, withCredentials: true })
        .pipe(
          tap((user) => this.rbacService.setAuthenticatedUser(user)),
          catchError((err) => {
            console.error('Error fetching user:', err);
            return throwError(() => err);
          })
        );
    } else {
      return throwError(() => new Error('No token found'));
    }
  }

  getUserRole(): string | undefined {
    const user = this.rbacService.getAuthenticatedUser();
    return user ? user.role : undefined;
  }

  getAccessToken(): string | undefined {
    return (
      this.access_token() || localStorage.getItem('access_token') || undefined
    );
  }

  setAccessToken(token: string) {
    this.access_token.set(token);
    localStorage.setItem('access_token', token);
  }

  clearState() {
    this.error.set('');
    localStorage.removeItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logout() {
    this.clearState();
    this.logoutSubject.next();
    location.href = '/login';
  }

  setError(message: string) {
    this.error.set(message);
  }

  getError(): string | null {
    return this.error();
  }

  refreshToken(): Observable<string> {
    const token = this.getAccessToken();

    if (!token) {
      this.logout();
      return throwError(() => new Error('No access token available'));
    }

    return this.httpClient
      .request<{ access_token: string }>('GET', this.refreshUrl, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.access_token),
        tap((newToken: string) => {
          this.setAccessToken(newToken);
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        })
      );
  }
}
