import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ChartOptions } from '../../models/chart.model';
import { chartOptions as donutChartOptions } from '../../charts/donut.chart';
import { ChartComponent } from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';
import {
  Reagent,
  ReagentListColumn,
} from '../../../../shared/models/reagent-model';
import { QuantityLeftDirective } from '../../../../shared/directives/quantityLeft/quantity-left.directive';
import { ExpiredDateDirective } from '../../../../shared/directives/expired-date/expired-date.directive';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { map, Observable } from 'rxjs';
import { ResearcherDashboardDataResponse } from '../../models/dashboard.model';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-researcher-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    ChartComponent,
    QuantityLeftDirective,
    ExpiredDateDirective,
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './researcher-dashboard.component.html',
  styleUrl: './researcher-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearcherDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  public researcherDashboardData$!: Observable<{
    reagentSampleChartOption: Partial<ChartOptions>;
    expiredReagentSampleChartOption: Partial<ChartOptions>;
    emptyReagentSampleChartOption: Partial<ChartOptions>;
    emptyOrExpiredList: Reagent[];
  }>;
  public filteredDate = new FormControl(this.dashboardService.filteredDate.value);

  ngOnInit(): void {
    this.researcherDashboardData$ = this.dashboardService
      .getResearcherDashboardData()
      .pipe(map(this.setChartOptions));
  }

  private setChartOptions(data: ResearcherDashboardDataResponse) {
    const reagentSampleSeries = data.reagentsVsSampleNumber.map(
      (reagent) => reagent._count.id
    );
    const reagentSampleLabels = data.reagentsVsSampleNumber.map(
      (reagent) => reagent.category
    );
    const reagentSampleChartOption = donutChartOptions(
      reagentSampleSeries,
      reagentSampleLabels,
      'Reagent vs Sample',
      '100%'
    );

    const expiredReagentSampleSeries = data.reagentsVsSampleExpiredNumber.map(
      (reagent) => reagent._count.id
    );
    const expiredReagentSampleLabels = data.reagentsVsSampleExpiredNumber.map(
      (reagent) => reagent.category
    );
    const expiredReagentSampleChartOption = donutChartOptions(
      expiredReagentSampleSeries,
      expiredReagentSampleLabels,
      'Expired: Reagent vs Sample',
      '100%'
    );

    const emptyReagentSampleSeries = data.reagentsVsSampleEmptyNumber.map(
      (reagent) => reagent._count.id
    );
    const emptyReagentSampleLabels = data.reagentsVsSampleEmptyNumber.map(
      (reagent) => reagent.category
    );
    const emptyReagentSampleChartOption = donutChartOptions(
      emptyReagentSampleSeries,
      emptyReagentSampleLabels,
      'Expired: Reagent vs Sample',
      '100%'
    );

    return {
      reagentSampleChartOption,
      expiredReagentSampleChartOption,
      emptyReagentSampleChartOption,
      emptyOrExpiredList: data.emptyOrExpiredList,
    };
  }

  public displayedColumnsExpiredEmpty: ReagentListColumn[] = [
    ReagentListColumn.NAME,
    ReagentListColumn.CATEGORY,
    ReagentListColumn.EXPIREDDATE,
    ReagentListColumn.QUANTITYLEFT,
  ];

  public quantityTooltip(quantity: number, quantityLeft: number): string {
    return quantityLeft && quantity / 2 > quantityLeft ? 'Less than half' : '';
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
