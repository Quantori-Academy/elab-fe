import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from '../../../auth/services/forgot-password/auth.service'; //this.router.navigate(['/login']) after denis's merge;
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/authentication/auth.service';
import { Profile } from '../../../auth/roles/types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  // currentUser: IUser; //WHEN IUser will be implement

  currentUser: Profile | null = null;

  private router = inject(Router);
  ngOnInit(): void {
    this.loadCurrentUser();
  }
  loadCurrentUser() {
    this.authService
      .getCurrentUser()
      .then((user) => {
        this.currentUser = user as unknown as Profile;
      })
      .catch((error) => {
        console.error('Error loading user:', error);
      });
  }

  get fullName(): string {
    return this.currentUser
      ? `${this.currentUser.firstName} ${this.currentUser.lastName}`
      : 'User';
  }

  navigateToProfile() {
    if (this.currentUser) {
      const fullNameSlug =
        `${this.currentUser.firstName}-${this.currentUser.lastName}`.toLowerCase();
      this.router.navigate([`/profile/${fullNameSlug}`]);
    }
  }

  // private authService = inject(AuthService);
  // private logoutService = inject(LogoutService);

  // ngOnInit() {
  //   this.getCurrentUser();
  // }

  // navigateToProfile() {
  //   this.router.createUrlTree(['']); //this.router.navigate(['/profile-page']) after Lela's merge;
  // }

  logout() {
    // this.logoutService.onLogoutUser(); //WAITING for the Denis merge
  }
}
