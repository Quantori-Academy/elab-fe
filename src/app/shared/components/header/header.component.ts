

import { Profile } from '../../../auth/roles/types';
import { RbacService } from '../../../auth/services/authentication/rbac.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LogoutService } from '../../../auth/services/logout/logout.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/services/authentication/auth.service';

export const collapsed = signal(false);

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private logoutService = inject(LogoutService);
  private rbacService = inject(RbacService);
  private router = inject(Router);
  public collapsed = collapsed;

  public get currentUser(): Profile | null {
    return this.rbacService.getAuthenticatedUser() ?? null;
  }
  ngOnInit(): void {
    this.loadCurrentUser();
  }
  loadCurrentUser() {
    this.authService
      .getCurrentUser()
      .catch((error) => {
        console.error('Error loading user:', error);
      });
  }

  navigateToProfile() {
    if (this.currentUser) {
      this.router.navigate([`/profile`]);
    }
  }

  logout() {
    this.logoutService.onLogoutUser();
  }
}
