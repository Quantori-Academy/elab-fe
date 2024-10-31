import { InjectionToken, Provider } from '@angular/core';

export const PAGE_SIZE_OPTIONS = new InjectionToken<number[]>(
  'PageSizeOptions'
);

export const provideVariables: Provider[] = [
  { provide: PAGE_SIZE_OPTIONS, useValue: [5, 10, 20] },
];
