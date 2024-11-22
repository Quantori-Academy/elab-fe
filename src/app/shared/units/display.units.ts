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
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .pipe(
        map((state: BreakpointState) => ({
          isMobile: state.breakpoints[Breakpoints.HandsetPortrait],
          isTablet: state.breakpoints[Breakpoints.TabletPortrait] && !state.breakpoints[Breakpoints.HandsetPortrait]
        })),
      );
}

export const provideDisplayExtension: Provider = { provide: DISPLAY_EXTENSION, useFactory: displayExtension};
