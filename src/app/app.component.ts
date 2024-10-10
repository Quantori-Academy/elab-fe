import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MockHealthCheckService } from './core/services/health-check/mock-health-check.service';
// import { HealthCheckService } from './core/services/health-check/health-check.service'; //it will need when backend will create endpoint HEALTHCHECK
import { ServerHealthStatus } from './core/services/health-check/server-health-status.interface';
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'E-LAB';

  healthStatus: ServerHealthStatus | null = null;
  errorMessage: string | null = null;

  constructor(private healthCheckService: MockHealthCheckService) {} // CHANGE TYPE TO HealthCheckService

  ngOnInit(): void {
    this.checkHealth();
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
}
