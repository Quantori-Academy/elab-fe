import { Component } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';
import { ChartOptions } from '../../models/chart.model';
import { chartOptions as roomChartOptions } from '../../charts/room-storage.chart';
import { chartOptions as userChartOptions } from '../../charts/user-role.chart';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MaterialModule, ChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  public roomChartOptions: Partial<ChartOptions> = roomChartOptions;
  public userChartOptions: Partial<ChartOptions> = userChartOptions;
  public kpiCards = [
    {
      title: 'Number of Rooms',
      icon: 'assets/icons/room.svg',
      ind: 3,
    },
    {
      title: 'Number of Storages',
      icon: 'assets/icons/storage.svg',
      ind: 23,
    },
    {
      title: 'Number of Users',
      icon: 'assets/icons/lab-user.svg',
      ind: 7,
    },
  ];
}
