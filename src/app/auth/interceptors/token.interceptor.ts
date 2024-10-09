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
  from,
  Observable,
  of,
  Subject,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/authentication/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  private isRefreshing = false;
  private refreshUrl = environment.apiUrl + '/api/v1/auth/refreshAccessToken';
  private access_token = localStorage.getItem('access_token');
  private tokenSubject: Subject<string> = new Subject<string>();
  private cachedRequests: HttpRequest<unknown>[] = [];

  intercept(
    req: HttpRequest<unknown>,
    handler: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token =
      localStorage.getItem('access_token') && this.authService.getAccessToken();
    if (req.url.startsWith(environment.apiUrl) && token) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }

    return handler.handle(req).pipe(
      catchError((error) => {
        const isLoginReq = req.headers.has('Login-Request');
        if (error.status === 401 && !isLoginReq) {
          this.cachedRequests.push(req);
          return this.refresh(req, handler);
        }
        this.authService.isAuthenticated();
        return throwError(error);
      })
    );
  }

  private refresh(req: HttpRequest<unknown>, handler: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      req = req.clone({
        method: 'GET',
        url: this.refreshUrl,
        setHeaders: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: this.access_token,
        }),
      });

      return handler.handle(req).pipe(
        switchMap((event) => {
          if (event instanceof HttpResponse) {
            const newTokens = event.body;
            if (newTokens) {
              localStorage.setItem('access_token', newTokens.access_token);

              return from(this.cachedRequests).pipe(
                switchMap((cachedReq) => {
                  cachedReq = cachedReq.clone({
                    headers: cachedReq.headers.set(
                      'Authorization',
                      `Bearer ${newTokens.access_token}`
                    ),
                  });
                  return handler.handle(cachedReq);
                }),
                finalize(() => {
                  this.cachedRequests = [];
                })
              );
            }
          }
          return of(event);
        }),
        catchError((error) => {
          this.isRefreshing = false;

          if (error.status === 403) {
            this.authService.isAuthenticated();
          }
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      return new Observable<HttpEvent<unknown>>((observer) => {
        this.tokenSubject.subscribe((newToken) => {
          req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${newToken}`),
          });
          handler.handle(req).subscribe(
            (event) => observer.next(event),
            (error) => observer.error(error),
            () => observer.complete()
          );
        });
      });
    }
  }
}
