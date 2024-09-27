import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import {
  catchError,
  finalize,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  private isRefreshing = false;

  intercept(
    req: HttpRequest<unknown>,
    handler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('accessToken');
    if (token) {
      req = req.clone({
        method: 'GET',
        url: 'https://dummyjson.com/auth/me',
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return handler.handle(req).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.log('I am here');
          return this.refresh(req, handler);
        }
        this.router.navigate(['/login']);
        console.log('No, there');
        return throwError(error);
      })
    );
  }

  private refresh(req: HttpRequest<unknown>, handler: HttpHandler) {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      req = req.clone({
        method: 'POST',
        url: 'https://dummyjson.com/auth/refresh',
        setHeaders: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
          expiresInMins: 1,
        }),
      });
    }
    return handler.handle(req).pipe(
      switchMap((event) => {
        if (event instanceof HttpResponse) {
          const newTokens = event.body;
          if (newTokens) {
            localStorage.setItem('accessToken', newTokens.accessToken);
            localStorage.setItem('refreshToken', newTokens.refreshToken);
          }
        }
        return of(event);
      }),
      catchError((error) => {
        this.isRefreshing = false;

        if (error.status === 403) {
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }
}
