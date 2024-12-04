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
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';

@Component({
  selector: 'app-po-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    ChartComponent,
    DatePipe,
    RouterLink,
    AsyncPipe,
    StatusLabelColorDirective,
    ReactiveFormsModule,
    NoDataComponent
  ],
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
  public filteredDate = new FormControl(this.dashboardService.filteredDate.value);

  ngOnInit(): void {
    this.procurementOfficerDashboardData$ = this.dashboardService
      .getProcurementOfficerDashboardData$()
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
      'Order status',
      '200px'
    );

    return { requestList: data.requestList, statusChartOption };
  }

  formatMonthYear(): string {
    if (!this.filteredDate) return '';
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(this.filteredDate.value as Date);
  }


  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.filteredDate.value as Date;
    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
    this.dashboardService.filteredDate.next(ctrlValue);
    datepicker.close();
  }
}
