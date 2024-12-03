import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { inject, InjectionToken, Provider } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Display } from '../models/display.interface';

export const DISPLAY_EXTENSION = new InjectionToken<Observable<Display>>(
  'DisplayExtension'
);

function displayExtension(): Observable<Display> {
  const breakpointObserver = inject(BreakpointObserver);


  return breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(
        map((state: BreakpointState) => ({
          isMobile: state.breakpoints[Breakpoints.HandsetPortrait] || state.breakpoints[Breakpoints.HandsetLandscape],
          isTablet: state.breakpoints[Breakpoints.TabletPortrait] || state.breakpoints[Breakpoints.TabletLandscape]
        })),
      );
}

export const provideDisplayExtension: Provider = { provide: DISPLAY_EXTENSION, useFactory: displayExtension};
