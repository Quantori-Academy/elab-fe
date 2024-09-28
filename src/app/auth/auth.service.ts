import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  accessToken = signal<string | undefined>(undefined);
  refreshToken = signal<string | undefined>(undefined);
  error = signal('');
  isFetching = signal(false);
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);

  onLoginUser(email: string, password: string) {
    const body = JSON.stringify({
      username: email,
      password: password,
      expiresInMins: 1,
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const LoginURL = 'https://dummyjson.com/auth/login'; //MockAPI URL
    const subscription = this.httpClient
      .post<LoginResponse>(LoginURL, body, {
        headers,
        // withCredentials: true,
      })
      .pipe(
        map((resData) => {
          return {
            accessToken: resData.accessToken,
            refreshToken: resData.refreshToken,
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
        next: ({ accessToken, refreshToken }) => {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
          this.onAuthUser();
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onAuthUser(): boolean {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return true;
    }
    return false;
  }

  onLogoutUser(): void {
    localStorage.removeItem('accesToken');
    localStorage.removeItem('refreshToken');
  }
}
