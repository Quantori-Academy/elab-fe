import { ChartOptions } from '../models/chart.model';

export const chartOptions = (
  data: number[],
  categories: string[],
  titleText: string
): Partial<ChartOptions> => ({
  series: [
    {
      name: titleText,
      data,
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
    text: titleText,
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
    categories,
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
});
