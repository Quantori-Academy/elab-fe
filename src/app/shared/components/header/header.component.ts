import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, catchError, filter, of } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
export class HeaderComponent implements OnInit {
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

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.loadCurrentUser();
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

  navigateToDashboard() {
    this.router.navigate([`/`]);
  }

  logout() {
    this.logoutService.onLogoutUser();
  }
}
