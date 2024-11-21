import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { inject, InjectionToken, Provider } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Display } from '../models/display.interface';

export const DISPLAY_EXTENSION = new InjectionToken<Observable<Display>>(
  'DisplayExtension'
);

function displayExtension(): Observable<Display> {
  const breakpointObserver = inject(BreakpointObserver);


  return breakpointObserver
      .observe(['(max-width: 426px)', '(max-width: 768px)'])
      .pipe(
        map((state: BreakpointState) => ({
          isMobile: state.breakpoints['(max-width: 426px)'] ?? false,
          isTablet: state.breakpoints['(max-width: 768px)'] && !state.breakpoints['(max-width: 426px)']
        }))
      );
}

export const provideDisplayExtension: Provider = { provide: DISPLAY_EXTENSION, useFactory: displayExtension};
