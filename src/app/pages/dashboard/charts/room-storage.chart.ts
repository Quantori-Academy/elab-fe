import { ChartOptions } from '../models/chart.model';

export const chartOptions: Partial<ChartOptions> = {
  series: [
    {
      name: 'Storage Quantity',
      data: [40, 43, 44, 47],
    },
  ],
  chart: {
    type: 'bar',
    toolbar: {
      tools: {
        download: false,
      },
    },
  },
  colors: ['var(--neutral-color-dark1)'],
  title: {
    text: 'Number of Storages',
    style: {
      color: 'var(--neutral-color-light1)',
      fontWeight: 500,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['Room1', 'Room2', 'Room3', 'Room4'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: 'var(--neutral-color-dark2)',
          colorTo: 'var(--neutral-color-dark1)',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    tooltip: {
      enabled: true,
      offsetY: -35,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.25,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [50, 0, 100, 100],
    },
  },
};
