import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from '../../../auth/services/forgot-password/auth.service'; //this.router.navigate(['/login']) after denis's merge;
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  // currentUser: IUser; //WHEN IUser will be implement
  currentUser = {
    name: 'John Doe',
    avatarUrl: 'path-to-avatar-image'
  };
  private router = inject(Router);
  // private authService = inject(AuthService);
  // private logoutService = inject(LogoutService);

  // ngOnInit() {
  //   this.getCurrentUser();
  // }

  // getCurrentUser() {
  //   this.currentUser = this.authService.getCurrentUser();
  // }

  navigateToProfile() {
    this.router.createUrlTree(['']); //this.router.navigate(['/profile-page']) after Lela's merge;
  }

  logout() {
    // this.logoutService.onLogoutUser(); //WAITING for the Denis merge
  }
}
