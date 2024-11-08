import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    AsyncPipe,
    MaterialModule,
    DatePipe,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPageComponent {
  private orderService = inject(OrdersService);
  private activatedRoutes = inject(ActivatedRoute);
  displayedColumns = [
    'name',
    'casNumber',
    'desiredQuantity',
    'package',
    'structureSmiles',
    'status',
    'userComments',
    'actions',
  ];
  order$ = this.activatedRoutes.paramMap.pipe(
    switchMap((paramMap) => {
      const id = Number(paramMap.get('id'));
      return this.orderService.getReagentById(id);
    })
  );
}
