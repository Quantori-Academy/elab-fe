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
import { map, Observable, combineLatest, startWith } from 'rxjs';
import { ResearcherDashboardDataResponse } from '../../models/dashboard.model';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NoDataComponent } from '../../../../shared/components/no-data/no-data.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';

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
    ReactiveFormsModule,
    NoDataComponent,
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './researcher-dashboard.component.html',
  styleUrl: './researcher-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearcherDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private translate = inject(TranslateService);
  private dateAdapter = inject(DateAdapter);

  public researcherDashboardData$!: Observable<{
    reagentSampleChartOption: Partial<ChartOptions>;
    expiredReagentSampleChartOption: Partial<ChartOptions>;
    emptyReagentSampleChartOption: Partial<ChartOptions>;
    emptyOrExpiredList: Reagent[];
  }>;
  public filteredDate = new FormControl(
    this.dashboardService.filteredDate.value
  );

  ngOnInit(): void {
    const data$ = this.dashboardService.getResearcherDashboardData$();
    const langChange$ = this.translate.onLangChange.pipe(startWith(null));

    this.researcherDashboardData$ = combineLatest([data$, langChange$]).pipe(
      map(([data]) => this.setChartOptions(data))
    );

    this.dateAdapter.setLocale(this.translate.currentLang);

    this.translate.onLangChange.subscribe((event) => {
      this.dateAdapter.setLocale(event.lang);
    });
  }

  private setChartOptions(data: ResearcherDashboardDataResponse) {
    const reagentSampleSeries = data.reagentsVsSampleNumber.map(
      (reagent) => reagent._count.id
    );
    const reagentSampleLabels = data.reagentsVsSampleNumber.map((reagent) =>
      this.translate.instant('CATEGORIES.' + reagent.category.toUpperCase())
    );
    const reagentSampleChartTitle = this.translate.instant(
      'RESEARCHER_DASHBOARD.REAGENT_VS_SAMPLE'
    );
    const reagentSampleChartOption = donutChartOptions(
      reagentSampleSeries,
      reagentSampleLabels,
      reagentSampleChartTitle,
      '100%',
      data.reagentsVsSampleNumber.map((reagent) => reagent.category)
    );

    const expiredReagentSampleSeries = data.reagentsVsSampleExpiredNumber.map(
      (reagent) => reagent._count.id
    );
    const expiredReagentSampleLabels = data.reagentsVsSampleExpiredNumber.map(
      (reagent) =>
        this.translate.instant('CATEGORIES.' + reagent.category.toUpperCase())
    );
    const expiredReagentSampleChartTitle = this.translate.instant(
      'RESEARCHER_DASHBOARD.EXPIRED_REAGENT_VS_SAMPLE'
    );
    const expiredReagentSampleChartOption = donutChartOptions(
      expiredReagentSampleSeries,
      expiredReagentSampleLabels,
      expiredReagentSampleChartTitle,
      '100%',
      data.reagentsVsSampleExpiredNumber.map((reagent) => reagent.category)
    );

    const emptyReagentSampleSeries = data.reagentsVsSampleEmptyNumber.map(
      (reagent) => reagent._count.id
    );
    const emptyReagentSampleLabels = data.reagentsVsSampleEmptyNumber.map(
      (reagent) =>
        this.translate.instant('CATEGORIES.' + reagent.category.toUpperCase())
    );
    const emptyReagentSampleChartTitle = this.translate.instant(
      'RESEARCHER_DASHBOARD.EMPTY_REAGENT_VS_SAMPLE'
    );
    const emptyReagentSampleChartOption = donutChartOptions(
      emptyReagentSampleSeries,
      emptyReagentSampleLabels,
      emptyReagentSampleChartTitle,
      '100%',
      data.reagentsVsSampleEmptyNumber.map((reagent) => reagent.category)
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
    return quantityLeft && quantity / 2 > quantityLeft
      ? this.translate.instant('RESEARCHER_DASHBOARD.LESS_THAN_HALF')
      : '';
  }

  formatMonthYear(): string {
    if (!this.filteredDate) return '';
    const locale = this.translate.currentLang || 'en-US';
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format(this.filteredDate.value as Date);
  }

  setMonthAndYear(
    normalizedMonthAndYear: Date,
    datepicker: MatDatepicker<Date>
  ) {
    const ctrlValue = this.filteredDate.value as Date;
    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
    this.dashboardService.filteredDate.next(ctrlValue);
    datepicker.close();
  }
}
