import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartOptions } from '../../models/chart.model';
import { chartOptions as donutChartOptions } from '../../charts/donut.chart';
import { ChartComponent } from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';
import { ReagentListColumn } from '../../../../shared/models/reagent-model';
import { QuantityLeftDirective } from '../../../../shared/directives/quantityLeft/quantity-left.directive';
import { ExpiredDateDirective } from '../../../../shared/directives/expired-date/expired-date.directive';

@Component({
  selector: 'app-researcher-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    ChartComponent,
    QuantityLeftDirective,
    ExpiredDateDirective,
  ],
  templateUrl: './researcher-dashboard.component.html',
  styleUrl: './researcher-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearcherDashboardComponent {
  public reagentSampleChartOptions: Partial<ChartOptions> = donutChartOptions(
    [30, 40],
    ['Reagent', 'Sample'],
    'Reagent vs Sample'
  );
  public expiredReagentSampleChartOptions: Partial<ChartOptions> =
    donutChartOptions(
      [34, 41],
      ['Reagent', 'Sample'],
      'Expired: Reagent vs Sample'
    );
  public emptyReagentSampleChartOptions: Partial<ChartOptions> =
    donutChartOptions(
      [24, 35],
      ['Reagent', 'Sample'],
      'Empty: Reagent vs Sample'
    );

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

  public reagentsResponse = {
    reagents: [
      {
        id: 31,
        name: 'Name',
        category: 'Sample',
        expiredDate: '11.12.2024',
        quantityLeft: 0,
      },
      {
        id: 33,
        name: 'Azulene',
        category: 'Reagent',
        expiredDate: '11.22.2024',
        quantityLeft: 4,
        quantity: 10,
      },
      {
        id: 14,
        name: 'string',
        category: 'Sample',
        expiredDate: '11.29.2024',
        quantityLeft: 6,
        quantity: 10,
      },
      {
        id: 31,
        name: 'Name',
        category: 'Sample',
        expiredDate: '11.12.2024',
        quantityLeft: 0,
      },
      {
        id: 33,
        name: 'Azulene',
        category: 'Reagent',
        expiredDate: '11.12.2024',
        quantityLeft: 0,
      },
      {
        id: 14,
        name: 'string',
        category: 'Sample',
        expiredDate: '11.12.2024',
        quantityLeft: 0,
      },
    ],
    size: '1',
  };
}
