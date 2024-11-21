import {
  Component,
  computed,
  inject,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MenuLink } from '../../models/menu-link.interface';
import { RbacService } from '../../../auth/services/authentication/rbac.service';
import { collapsed } from '../header/header.component';
import { MaterialModule } from '../../../material.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MaterialModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  readonly rbacService = inject(RbacService);
  private breakpointObserver = inject(BreakpointObserver);
  public isMobile = signal(false);
  private destroy$ = new Subject<void>();

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
      procurementOnly: true,
      researcherOnly: true,
    },
    {
      icon: 'storefront',
      label: 'Orders Management',
      route: 'orders',
      procurementOnly: true,
    },
    {
      icon: 'science',
      label: 'Reagent Request',
      route: 'reagent-request-page',
      procurementOnly: true,
      researcherOnly: true,
    },
    {
      icon: 'person_add',
      label: 'Users Management',
      route: 'users',
      adminOnly: true,
    },
  ]);

  public navbarWidth = computed(() => {
    if (this.isMobile()) {
      return 'unset'
    } else {
      return collapsed() ? '250px' : '60px'
    }
  });
  public sideNavMode = computed(() => this.isMobile() ? 'over' : 'side')

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 426px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((breakpoint) => this.isMobile.set(breakpoint.matches));
  }

  isOpenedSideNav() {
    return this.isMobile() ? collapsed() : true;
  }

  closeSideNav() {
    if (this.isMobile()) {
      collapsed.set(false)
    }
  }

  isLinkVisible(link: MenuLink): boolean {
    return (
      (link.adminOnly && this.rbacService.isAdmin()) ||
      (link.procurementOnly && this.rbacService.isProcurementOfficer()) ||
      (link.researcherOnly && this.rbacService.isResearcher()) ||
      (!link.adminOnly && !link.procurementOnly && !link.researcherOnly)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
