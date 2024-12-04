import { ChartOptions } from '../models/chart.model';

const pieColors: Record<string, string> = {
  Admin: 'var(--neutral-color-dark2)',
  Researcher: 'var(--neutral-color-dark1)',
  ProcurementOfficer: 'var(--neutral-color-light1)',
};

export const chartOptions = (series: number[], labels: string[]): Partial<ChartOptions> => ({
  series,
  chart: {
    width: '100%',
    height: '300px',
    type: 'pie',
  },
  labels,
  colors: labels.map((label) => pieColors[label]),
  title: {
    text: 'Number of Users',
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
