import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartOptions } from '../../models/chart.model';
import { chartOptions as donutChartOptions } from '../../charts/donut.chart';
import { ChartComponent } from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-researcher-dashboard',
  standalone: true,
  imports: [MaterialModule, ChartComponent],
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
}
