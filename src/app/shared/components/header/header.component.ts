import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, Subscription, catchError, filter, of } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { Profile } from '../../../auth/roles/types';
import { RbacService } from '../../../auth/services/authentication/rbac.service';
import { LogoutService } from '../../../auth/services/logout/logout.service';
import { AuthService } from '../../../auth/services/authentication/auth.service';

export const collapsed = signal(false);

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, AsyncPipe, MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private logoutService = inject(LogoutService);
  private rbacService = inject(RbacService);
  private router = inject(Router);
  public collapsed = collapsed;
  public currentUser$: Observable<Profile | null> =
    this.rbacService.authenticatedUser$;
  private excludedRoutes: string[] = [
    '/login',
    '/forgot-password',
    '/reset-password',
  ];
  private routerSubscription!: Subscription;

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;
        const isExcluded = this.excludedRoutes.some((route) =>
          currentUrl.includes(route)
        );
        if (!isExcluded) {
          this.loadCurrentUser();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadCurrentUser() {
    this.authService
      .getCurrentUser()
      .pipe(
        catchError((error) => {
          console.error('Error loading user:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  navigateToProfile() {
    this.router.navigate([`/profile`]);
  }

  logout() {
    this.logoutService.onLogoutUser();
  }
}
