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
import { MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { StatusLabelColorDirective } from '../../../../shared/directives/status-label-color/status-label-color.directive';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-po-dashboard',
  standalone: true,
  imports: [MaterialModule, ChartComponent, DatePipe, RouterLink, AsyncPipe, StatusLabelColorDirective, ReactiveFormsModule],
  providers: [provideNativeDateAdapter(MY_FORMATS)],
  templateUrl: './po-dashboard.component.html',
  styleUrl: './po-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoDashboardComponent implements OnInit {
  readonly date = new FormControl(new Date());
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


  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.date.value;
    ctrlValue?.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue?.setFullYear(normalizedMonthAndYear.getFullYear());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
}
