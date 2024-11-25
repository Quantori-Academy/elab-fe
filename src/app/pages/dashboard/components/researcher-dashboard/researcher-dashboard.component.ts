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
  ],
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
    expiredList: Reagent[];
    emptyList: Reagent[];
  }>;

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
      'Reagent vs Sample'
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
      'Expired: Reagent vs Sample'
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
      'Expired: Reagent vs Sample'
    );

    return {
      reagentSampleChartOption,
      expiredReagentSampleChartOption,
      emptyReagentSampleChartOption,
      expiredList: data.expiredList,
      emptyList: data.emptyList,
    };
  }

  public displayedColumnsExpired: ReagentListColumn[] = [
    ReagentListColumn.NAME,
    ReagentListColumn.CATEGORY,
    ReagentListColumn.EXPIREDDATE,
  ];
  public displayedColumnsEmpty: ReagentListColumn[] = [
    ReagentListColumn.NAME,
    ReagentListColumn.CATEGORY,
    ReagentListColumn.QUANTITYLEFT,
  ];

  public quantityTooltip(quantity: number, quantityLeft: number): string {
    return quantityLeft && quantity / 2 > quantityLeft ? 'Less than half' : '';
  }
}
