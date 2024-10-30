import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MenuLink } from '../../models/menu-link.interface';
import { RbacService } from '../../../auth/services/authentication/rbac.service';
import { collapsed } from '../header/header.component';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MaterialModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  readonly rbacService = inject(RbacService);

  menuLinks = signal<MenuLink[]>([
    {
      icon: 'home',
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      icon: 'storage',
      label: 'Storage Locations',
      route: 'storage-locations',
    },
    {
      icon: 'school',
      label: 'Reagents',
      route: 'reagents',
    },
    {
      icon: 'science',
      label: 'Reagent Request',
      route: 'reagent-request-page',
    },
    {
      icon: 'person_add',
      label: 'Users Management',
      route: 'users',
      adminOnly: true,
    },
  ]);

  public navbarWidth = computed(() => (collapsed() ? '60px' : '250px'));

  isLinkVisible(link: MenuLink): boolean {
    return !link.adminOnly || this.rbacService.isAdmin();
  }
}
