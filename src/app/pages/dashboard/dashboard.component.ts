import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/authentication/auth.service';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ResearcherDashboardComponent } from './components/researcher-dashboard/researcher-dashboard.component';
import { PoDashboardComponent } from './components/po-dashboard/po-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AdminDashboardComponent,
    ResearcherDashboardComponent,
    PoDashboardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private authService = inject(AuthService);
  public userRole = this.authService.getUserRole();
}
