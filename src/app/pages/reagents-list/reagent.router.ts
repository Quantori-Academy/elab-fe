import { Routes } from '@angular/router';
import { roleGuard } from '../../auth/guards/role.guard';
import { UserRoles } from '../../shared/models/user-models';

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
    canActivate: [roleGuard],
    data: { role: UserRoles.Researcher },
  },
  {
    path: 'create-sample',
    loadComponent: () =>
      import('./components/create-reagent/create-reagent.component').then(
        (c) => c.CreateReagentComponent
      ),
    data: { role: UserRoles.Researcher, isSample: true },
    canActivate: [roleGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/reagent-detailed-page/reagent-detailed-page.component').then(
        (c) => c.ReagentDetailedPageComponent
      ),
    // data: { role: UserRoles.Researcher, isSample: true },
    // canActivate: [roleGuard],
  },
];
