import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { of, switchMap } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [AsyncPipe, MaterialModule, DatePipe, MoleculeStructureComponent,TableLoaderSpinnerComponent],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPageComponent {
  private OrdersService = inject(OrdersService);
  private activatedRoutes = inject(ActivatedRoute);
  displayedColumns = [
    'name',
    'casNumber',
    'desiredQuantity',
    // 'package',
    // 'quantityLeft',
    'structureSmiles',
    'userComments',
    'actions'
  ];

  order$ = this.activatedRoutes.paramMap.pipe(
    switchMap((paramMap) => {
      const id = Number(paramMap.get('id'));
      if (id) {
        return this.OrdersService.getOrderFromMockDataById(id);
      }
      return of(null);
    })
  );
}
