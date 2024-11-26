import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';
import { ChartOptions } from '../../models/chart.model';
import { chartOptions as statusChartOptions } from '../../charts/donut.chart';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { map, Observable } from 'rxjs';
import { ReagentRequestList } from '../../../reagent-request/reagent-request-page/reagent-request-page.interface';
import { ProcurementOfficerDashboardDataResponse } from '../../models/dashboard.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { StatusLabelColorDirective } from '../../../../shared/directives/status-label-color/status-label-color.directive';

@Component({
  selector: 'app-po-dashboard',
  standalone: true,
  imports: [MaterialModule, ChartComponent, DatePipe, RouterLink, AsyncPipe, StatusLabelColorDirective],
  providers: [provideNativeDateAdapter()],
  templateUrl: './po-dashboard.component.html',
  styleUrl: './po-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoDashboardComponent implements OnInit {
  public displayedColumns: string[] = [
    'reagent',
    'desiredQuantity',
    'status',
    'date',
  ];
  private dashboardService = inject(DashboardService);
  public procurementOfficerDashboardData$!: Observable<{
    requestList: ReagentRequestList[];
    statusChartOption: Partial<ChartOptions>;
  }>;
  public year = new Date().getFullYear();
  public month = new Date().getMonth() + 1;

  ngOnInit(): void {
    this.procurementOfficerDashboardData$ = this.dashboardService
      .getProcurementOfficerDashboardData({
        year: this.year,
        month: this.month,
      })
      .pipe(map(this.setChartOptions));
  }

  setChartOptions(data: ProcurementOfficerDashboardDataResponse) {
    const orderStatusSeries = data.requestByStatuses.map(
      (order) => order._count.id
    );
    const orderStatusLabels = data.requestByStatuses.map(
      (order) => order.status
    );
    const statusChartOption = statusChartOptions(
      orderStatusSeries,
      orderStatusLabels,
      'Order status'
    );

    return { requestList: data.requestList, statusChartOption };
  }
}
