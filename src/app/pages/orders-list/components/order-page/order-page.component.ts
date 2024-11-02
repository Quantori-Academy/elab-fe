import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { of, switchMap } from 'rxjs';
import { MaterialModule } from '../../../../material.module';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [AsyncPipe, MaterialModule, DatePipe, MoleculeStructureComponent],
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
    'structure',
    'userComments',
  ];

  order$ = this.activatedRoutes.paramMap.pipe(
    switchMap((paramMap) => {
      const id = Number(paramMap.get('id'));
      if (id) {
        console.log(id);
        return this.OrdersService.getOrderFromMockDataById(id);
      }
      return of(null);
    })
  );
}
