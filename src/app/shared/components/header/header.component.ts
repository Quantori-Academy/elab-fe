import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Observable, catchError, of } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { Profile } from '../../../auth/roles/types';
import { RbacService } from '../../../auth/services/authentication/rbac.service';
import { LogoutService } from '../../../auth/services/logout/logout.service';
import { AuthService } from '../../../auth/services/authentication/auth.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

export const collapsed = signal(false);

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, MaterialModule, TranslateModule],
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

  public languages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
  ];

  constructor(public translate: TranslateService) {}

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

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}
