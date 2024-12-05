import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';
import { ChartOptions } from '../../models/chart.model';
import { chartOptions as roomChartOptions } from '../../charts/room-storage.chart';
import { chartOptions as userChartOptions } from '../../charts/user-role.chart';
import {
  AdminDashboardDataResponse,
  AdminKpiCard,
} from '../../models/dashboard.model';
import { map, Observable, combineLatest, startWith } from 'rxjs';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { AsyncPipe } from '@angular/common';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    ChartComponent,
    AsyncPipe,
    NoDataComponent,
    TranslateModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private translate = inject(TranslateService);

  public adminDashboardData$!: Observable<{
    roomChartOption: Partial<ChartOptions>;
    userChartOption: Partial<ChartOptions>;
    kpiCards: AdminKpiCard[];
  }>;

  ngOnInit(): void {
    const data$ = this.dashboardService.getAdminDashboardData$();
    const langChange$ = this.translate.onLangChange.pipe(startWith(null));

    this.adminDashboardData$ = combineLatest([data$, langChange$]).pipe(
      map(([data]) => this.setChartOptions(data))
    );
  }

  private setChartOptions(data: AdminDashboardDataResponse) {
    const storageCounts = data.storageCountWithRoomNames.map(
      (room) => room.storageCount
    );
    const rooms = data.storageCountWithRoomNames.map((room) => room.roomName);

    const roomChartTitle = this.translate.instant(
      'ADMIN_DASHBOARD.NUMBER_OF_STORAGES'
    );
    const roomChartOption = roomChartOptions(
      storageCounts,
      rooms,
      roomChartTitle
    );

    const userCounts = data.userNumberInRoles.map((user) => user._count.id);
    const roles = data.userNumberInRoles.map((user) => user.role);

    const translatedRoles = roles.map((role) =>
      this.translate.instant('ROLES.' + role.toUpperCase())
    );
    const userChartTitle = this.translate.instant(
      'ADMIN_DASHBOARD.NUMBER_OF_USERS'
    );
    const userChartOption = userChartOptions(
      userCounts,
      translatedRoles,
      userChartTitle,
      roles
    );

    const kpiCards = [
      {
        title: this.translate.instant('ADMIN_DASHBOARD.NUMBER_OF_ROOMS'),
        icon: 'assets/icons/room.svg',
        ind: data.roomNumber,
      },
      {
        title: this.translate.instant('ADMIN_DASHBOARD.NUMBER_OF_STORAGES'),
        icon: 'assets/icons/storage.svg',
        ind: data.storageNumber,
      },
      {
        title: this.translate.instant('ADMIN_DASHBOARD.NUMBER_OF_USERS'),
        icon: 'assets/icons/lab-user.svg',
        ind: data.userNumber,
      },
    ];
    return {
      roomChartOption,
      userChartOption,
      kpiCards,
    };
  }
}
