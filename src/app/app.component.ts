import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MockHealthCheckService } from './core/services/health-check/mock-health-check.service';
// import { HealthCheckService } from './core/services/health-check/health-check.service'; //it will need when backend will create endpoint HEALTHCHECK
import { ServerHealthStatus } from './core/services/health-check/server-health-status.interface';
import { RbacService } from './auth/services/authentication/rbac.service';
import { User } from './auth/roles/types'; //
import { UserRolesService } from './auth/services/authentication/user-roles.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly rbacService = inject(RbacService);
  readonly userRolesService = inject(UserRolesService);

  title = 'E-LAB';

  healthStatus: ServerHealthStatus | null = null;
  errorMessage: string | null = null;
  authenticatedUser: User | null = null;

  constructor(private healthCheckService: MockHealthCheckService) {} //CHANGE TYPE TO HealthCheckService

  ngOnInit(): void {
    this.checkHealth();
    this.loadAuthenticatedUser();
  }

  checkHealth(): void {
    this.healthCheckService.checkHealth().subscribe({
      next: (response) => {
        console.log('Mock data:', response); // FOR CHECK MOCK DATA
        this.healthStatus = response;
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Failed to fetch health status';
      },
    });
  }

  loadAuthenticatedUser(): void {
    this.authenticatedUser = {
      id: 1,
      email: 'user1@elab.com',
      role: 'Admin',
    };

    this.rbacService.setAuthenticatedUser(this.authenticatedUser);
    // this.userRolesService.getAuthenticatedUser().subscribe({
    //   next: (user) => {
    //     this.authenticatedUser = user;
    //     this.rbacService.setAuthenticatedUser(user);
    //   },
    //   error: (err) => {
    //     console.error('Error fetching user:', err);
    //     this.errorMessage = 'Failed to fetch user data';
    //   },
    // });
  }
}
