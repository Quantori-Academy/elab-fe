import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  catchError,
  finalize,
  Observable,
  BehaviorSubject,
  throwError,
  switchMap,
  filter,
  take,
} from 'rxjs';
import { AuthService } from '../../auth/services/authentication/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  private refreshUrl = environment.apiUrl + '/api/v1/auth/refreshAccessToken';

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    handler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const isRefreshRequest = req.url === this.refreshUrl;
    const token = this.authService.getAccessToken();

    let authReq = req;
    if (token && req.url.startsWith(environment.apiUrl) && !isRefreshRequest) {
      authReq = this.addToken(req, token);
    }

    return handler.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 401 &&
          !isRefreshRequest &&
          !authReq.url.includes('/api/v1/auth/login')
        ) {
          return this.handle401Error(authReq, handler);
        }
        this.authService.isAuthenticated();
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    handler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.tokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((newToken: string) => {
          if (newToken) {
            this.tokenSubject.next(newToken);
            return handler.handle(this.addToken(request, newToken));
          }
          this.authService.logout();
          return throwError(() => new Error('Failed to refresh token'));
        }),
        catchError((err) => {
          this.authService.logout();
          return throwError(() => err);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      return this.tokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          if (token) {
            return handler.handle(this.addToken(request, token));
          }
          this.authService.logout();
          return throwError(() => new Error('No token avalable'));
        })
      );
    }
  }
}
