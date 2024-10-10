import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { MenuLink } from '../../../auth/models/menu-link.interface';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { collapsed } from '../header/header.component';
import { RbacService } from '../../../auth/services/authentication/rbac.service';

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
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly rbacService = inject(RbacService);
  menuLinks = signal<MenuLink[]>([
    {
      label: 'Users Management',
      route: '/users',
      adminOnly: true,
    },
    {
      label: 'Profile',
      route: '/profile',
    },
    {
      label: 'Storage Locations',
      route: '/storage-locations',
    },
    {
      label: 'Reagents',
      route: '/reagents',
    },
  ]);

  navbarWidth = computed(() => (collapsed() ? '0' : '250px'));

  isLinkVisible(link: MenuLink): boolean {
    return !link.adminOnly || this.rbacService.isAdmin();
  }
}
