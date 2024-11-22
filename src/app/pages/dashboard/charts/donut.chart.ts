import { ApexAxisChartSeries, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { ChartOptions } from '../models/chart.model';

const pieColors: Record<string, string> = {
  Reagent: 'var(--neutral-color-dark2)',
  Sample: 'var(--neutral-color-dark1)',
  Pending: '#e68d11',
  Ordered: '#4B0082',
  Fulfilled: '#098109',
  Declined: '#F44336',
};

export const chartOptions = (
  series: ApexNonAxisChartSeries | ApexAxisChartSeries,
  labels: string[] | undefined,
  titleText: string
): Partial<ChartOptions> => ({
  series,
  chart: {
    type: 'donut',
    height: '200px',
  },
  labels,
  colors: labels?.map((label) => pieColors[label]),
  title: {
    text: titleText,
    style: {
      color: 'var(--neutral-color-light1)',
      fontWeight: 500,
    },
  },
  responsive: [
    {
      breakpoint: 426,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
    {
      breakpoint: 350,
      options: {
        chart: {
          width: 240,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
});
