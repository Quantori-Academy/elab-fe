import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthStateService } from './authstate.service';
import { Router } from '@angular/router';
import LoginResponse from '../../auth.interface';
import { RbacService } from './rbac.service';
import { User } from '../../roles/types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private authStateService: AuthStateService,
    private rbacService: RbacService
  ) {
    this.authStateService.logoutEvent.subscribe(() => {
      this.clearState();
    });
  }

  private authUrl = environment.apiUrl + '/api/v1/auth/login';
  private userUrl = environment.apiUrl + '/api/v1/users';
  private access_token = signal<string | undefined>(undefined);
  private error = signal('');
  private isFetching = signal(false);
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  onLoginUser(email: string, password: string) {
    const body = JSON.stringify({ email, password });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const subscription = this.httpClient
      .post<LoginResponse>(this.authUrl, body, {
        headers,
        withCredentials: true,
      })
      .pipe(
        map((resData) => resData.access_token),
        catchError(() => throwError(() => new Error('Login failed')))
      )
      .subscribe({
        next: (access_token) => {
          localStorage.setItem('access_token', access_token);
          this.access_token.set(access_token);

          this.getCurrentUser()
            .then(() => {
              this.router.navigate(['dashboard']);
            })
            .catch((error) => {
              console.error('Error fetching user after login:', error);
            });
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  getCurrentUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = this.getAccessToken();
      if (token) {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        this.httpClient.get<User>(this.userUrl, { headers }).subscribe({
          next: (user) => {
            this.rbacService.setAuthenticatedUser(user);
            resolve();
          },
          error: (err) => {
            console.error('Error fetching user:', err);
            reject(err);
          },
        });
      } else {
        reject('No token found');
      }
    });
  }

  // Temporary method (if you'll need to test the first one while user api is unavailable)

  // getCurrentUser(): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const token = this.getAccessToken();
  //     if (token) {
  //       const parts = token.split('.');
  //       if (parts.length === 3) {
  //         try {
  //           const payload = atob(parts[1]);
  //           const decodedPayload = JSON.parse(payload);

  //           const user: User = {
  //             id: decodedPayload.id,
  //             email: decodedPayload.email,
  //             role: decodedPayload.role,
  //           };
  //           this.rbacService.setAuthenticatedUser(user);
  //           resolve();
  //         } catch (e) {
  //           console.error('Error decoding JWT:', e);
  //           reject(e);
  //         }
  //       } else {
  //         reject('Invalid token format');
  //       }
  //     } else {
  //       reject('No token found');
  //     }
  //   });
  // }

  getUserRole(): string | undefined {
    const user = this.rbacService.getAuthenticatedUser();
    return user ? user.role : undefined;
  }

  getAccessToken(): string | undefined {
    return (
      this.access_token() || localStorage.getItem('access_token') || undefined
    );
  }

  clearState() {
    this.access_token.set(undefined);
    this.error.set('');
    localStorage.removeItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
