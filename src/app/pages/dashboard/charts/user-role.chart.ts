import { ChartOptions } from '../models/chart.model';

// const pieColors: Record<string, string> = {
//   Admin: 'var(--neutral-color-dark2)',
//   Researcher: 'var(--neutral-color-dark1)',
//   'Procurement Officer': 'var(--neutral-color-light1)',
// };

export const chartOptions: Partial<ChartOptions> = {
  series: [2, 3, 6],
  chart: {
    width: '100%',
    height: '300px',
    type: 'pie',
  },
  labels: ['Admin', 'Researcher', 'Procurement Officer'],
  colors: [
    'var(--neutral-color-dark2)',
    'var(--neutral-color-dark1)',
    'var(--neutral-color-light1)',
  ],
  title: {
    text: 'Number of Users',
    style: {
      color: 'var(--neutral-color-light1)',
      fontWeight: 500,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
};
