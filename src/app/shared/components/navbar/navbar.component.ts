import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuLink } from '../../../auth/models/menu-link.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  // private authService = inject(AuthService);

  readonly menuLinks: MenuLink[] = [
    {
      label: 'Users management',
      link: '',
      adminOnly: true,
    },
    {
      label: 'Link1',
      link: '',
    },
    {
      label: 'Link2',
      link: '',
    },
    {
      label: 'Link3',
      link: '',
    },
    {
      label: 'Link4',
      link: '',
    },
  ];

//Delete this and next line after add logic
// eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get isAdmin(): boolean {
    // return this.authService.getUserRole();
    return true;
  }

  isLinkVisible(link: MenuLink): boolean {
    return !link.adminOnly || this.isAdmin;
  }
}
