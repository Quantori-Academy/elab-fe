import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./reagents-list.component').then((c) => c.ReagentsListComponent),
    pathMatch: 'full',
  },
  {
    path: 'create-reagent',
    loadComponent: () =>
      import('./components/create-reagent/create-reagent.component').then(
        (c) => c.CreateReagentComponent
      ),
  },
  {
    path: 'create-sample',
    loadComponent: () =>
      import('./components/create-reagent/create-reagent.component').then(
        (c) => c.CreateReagentComponent
      ),
    data: { isSample: true },
  },
];
