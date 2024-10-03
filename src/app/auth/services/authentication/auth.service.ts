import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthStateService } from './authstate.service';
import { Router } from '@angular/router';
import LoginResponse from '../../auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private authStateService: AuthStateService) {
    this.authStateService.logoutEvent.subscribe(() => {
      this.clearState();
    });
  }

  private authUrl = environment.apiUrl + '/api/v1/auth/login';
  private access_token = signal<string | undefined>(undefined);
  private error = signal('');
  private isFetching = signal(false);
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  onLoginUser(email: string, password: string) {
    const body = JSON.stringify({
      email,
      password,
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Login-Request': 'true',
    });
    const subscription = this.httpClient
      .post<LoginResponse>(this.authUrl, body, {
        headers,
        withCredentials: true,
      })
      .pipe(
        map((resData) => {
          return {
            access_token: resData.access_token,
          };
        }),
        catchError((error) => {
          console.log(error);
          return throwError(
            () => new Error('Something went wrong, try again later')
          );
        })
      )
      .subscribe({
        next: ({ access_token }) => {
          localStorage.setItem('access_token', access_token);
          this.access_token.set(access_token);
          this.router.navigate(['dashboard']);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
          this.isAuthenticated();
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (token) {
      return true;
    }
    return false;
  }

  clearState() {
    this.access_token.set(undefined);
    this.error.set('');
  }
}
