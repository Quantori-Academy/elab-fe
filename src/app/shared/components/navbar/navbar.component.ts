import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { MenuLink } from '../../models/menu-link.interface';
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
      label: 'Storage Locations',
      route: '/storage-locations',
    },
    {
      label: 'Reagents',
      route: '/reagents',
    },
    {
      label: 'Users Management',
      route: '/users',
      adminOnly: true,
    },
  ]);

  navbarWidth = computed(() => (collapsed() ? '0' : '250px'));

  isLinkVisible(link: MenuLink): boolean {
    return !link.adminOnly || this.rbacService.isAdmin();
  }
}
