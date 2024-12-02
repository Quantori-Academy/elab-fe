import { ApexAxisChartSeries, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { ChartOptions } from '../models/chart.model';

const pieColors: Record<string, string> = {
  Reagent: 'var(--neutral-color-dark2)',
  Sample: 'var(--neutral-color-dark1)',
  Pending: 'var(--pending-color)',
  Ordered: 'var(--ordered-color)',
  Fulfilled: 'var(--fulfilled-color)',
  Declined: 'var(--declined-color)',
  Completed: 'var(--completed-color)',
};

export const chartOptions = (
  series: ApexNonAxisChartSeries | ApexAxisChartSeries,
  labels: string[] | undefined,
  titleText: string,
  height: string,
): Partial<ChartOptions> => ({
  series,
  chart: {
    type: 'donut',
    width: '400px',
    height
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
  dataLabels: {
    enabled: true,
    style: {
      colors: labels?.map((label) => pieColors[label]),
      fontSize: '14px',
    }
  },
  plotOptions: {
    pie: {
      customScale: 0.8,
      dataLabels: {
        offset: 30,
      },
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
