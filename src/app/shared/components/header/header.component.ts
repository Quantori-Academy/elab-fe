import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LogoutService } from '../../../auth/services/logout/logout.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../auth/services/authentication/auth.service';
import { User } from '../../../auth/roles/types';

export const collapsed = signal(false);

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private logoutService = inject(LogoutService);
  collapsed = collapsed;
  currentUser: User | undefined;

  ngOnInit() {
    this.getCurrentUser();
  }

  async getCurrentUser() {
    await this.authService.getCurrentUser();
    this.currentUser = this.authService.rbacService.getAuthenticatedUser();
  }

  navigateToProfile() {
    this.router.createUrlTree(['/']); //check with page
  }

  logout() {
    this.logoutService.onLogoutUser();
  }
}
