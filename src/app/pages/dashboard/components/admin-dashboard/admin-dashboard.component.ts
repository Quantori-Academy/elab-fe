import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';
import { ChartOptions } from '../../models/chart.model';
import { chartOptions as roomChartOptions } from '../../charts/room-storage.chart';
import { chartOptions as userChartOptions } from '../../charts/user-role.chart';
import {
  AdminDashboardDataResponse,
  AdminKpiCard,
} from '../../model/dashboard.model';
import { map, Observable } from 'rxjs';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MaterialModule, ChartComponent, AsyncPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  public adminDashboardData$!: Observable<{
    roomChartOption: Partial<ChartOptions>;
    userChartOption: Partial<ChartOptions>;
    kpiCards: AdminKpiCard[];
  }>;

  ngOnInit(): void {
    this.adminDashboardData$ = this.dashboardService
      .getAdminDashboardData()
      .pipe(map(this.setChartOptions))
  }

  private setChartOptions(data: AdminDashboardDataResponse) {
    const storageCounts = data.storageNumberInRoom.map(
      (room) => room._count.id
    );
    const rooms = data.storageNumberInRoom.map((room) =>
      room.roomId.toString()
    );
    const roomChartOption = roomChartOptions(storageCounts, rooms);

    const userCounts = data.userNumberInRoles.map((user) => user._count.id);
    const roles = data.userNumberInRoles.map((user) => user.role);

    const userChartOption = userChartOptions(userCounts, roles);

    const kpiCards = [
      {
        title: 'Number of Rooms',
        icon: 'assets/icons/room.svg',
        ind: data.roomNumber,
      },
      {
        title: 'Number of Storages',
        icon: 'assets/icons/storage.svg',
        ind: data.storageNumber,
      },
      {
        title: 'Number of Users',
        icon: 'assets/icons/lab-user.svg',
        ind: data.userNumber,
      },
    ];
    return {
      roomChartOption,
      userChartOption,
      kpiCards
    }
  }
}
