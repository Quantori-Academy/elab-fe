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
import { Observable, Subject, takeUntil } from 'rxjs';
import { Display } from '../../models/display.interface';
import { DISPLAY_EXTENSION } from '../../units/display.units';
import { Profile } from '../../../auth/roles/types';
import { AsyncPipe } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MaterialModule,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  readonly rbacService = inject(RbacService);
  public currentUser$: Observable<Profile | null> =
    this.rbacService.authenticatedUser$;
  private displayExtension: Observable<Display> = inject(DISPLAY_EXTENSION);
  public isMobile = signal(false);
  private destroy$ = new Subject<void>();
  private translate = inject(TranslateService);

  menuLinks = signal<MenuLink[]>([
    {
      icon: 'home',
      label: 'LAYOUT.MENU.DASHBOARD',
      route: 'dashboard',
    },
    {
      icon: 'storage',
      label: 'LAYOUT.MENU.STORAGE_LOCATIONS',
      route: 'storage-locations',
    },
    {
      icon: 'science',
      label: 'LAYOUT.MENU.REAGENTS',
      route: 'reagents',
      procurementOnly: true,
      researcherOnly: true,
    },
    {
      icon: 'storefront',
      label: 'LAYOUT.MENU.ORDERS_MANAGEMENT',
      route: 'orders',
      procurementOnly: true,
    },
    {
      icon: 'note_add',
      label: 'LAYOUT.MENU.REAGENT_REQUEST',
      route: 'reagent-request-page',
      procurementOnly: true,
      researcherOnly: true,
    },
    {
      icon: 'person_add',
      label: 'LAYOUT.MENU.USERS_MANAGEMENT',
      route: 'users',
      adminOnly: true,
    },
  ]);

  public navbarWidth = computed(() => {
    if (this.isMobile()) {
      return 'unset';
    } else {
      return collapsed() ? '250px' : '60px';
    }
  });
  public sideNavMode = computed(() => (this.isMobile() ? 'over' : 'side'));

  ngOnInit(): void {
    this.displayExtension
      .pipe(takeUntil(this.destroy$))
      .subscribe((display) => this.isMobile.set(display.isMobile));
  }

  isOpenedSideNav() {
    return this.isMobile() ? collapsed() : true;
  }

  closeSideNav() {
    if (this.isMobile()) {
      collapsed.set(false);
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
