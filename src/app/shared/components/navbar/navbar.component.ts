import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { MenuLink } from '../../../auth/models/menu-link.interface';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { collapsed } from '../header/header.component';
import { AuthService } from '../../../auth/services/authentication/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    RouterOutlet,
    MatListModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  menuLinks = signal<MenuLink[]>([
    {
      label: 'Users management',
      route: '/',
      adminOnly: true,
    },
    {
      label: 'Page1',
      route: '/',
    },
    {
      label: 'Page2',
      route: '/',
    },
    {
      label: 'Page3',
      route: '/',
    },
  ]);

  navbarWidth = computed(() => (collapsed() ? '0' : '250px'));

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'Admin';
  }

  isLinkVisible(link: MenuLink): boolean {
    return !link.adminOnly || this.isAdmin;
  }
}
