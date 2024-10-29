import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { OrderService } from '../../service/order.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { of, switchMap } from 'rxjs';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [AsyncPipe, MaterialModule, DatePipe],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPageComponent {
  private orderService = inject(OrderService);
  private activatedRoutes = inject(ActivatedRoute);
  displayedColumns = [
    'name',
    'cas',
    'totalQuantity',
    'package',
    'quantityLeft',
    'structure',
    'room',
  ];
 
  order$ = this.activatedRoutes.paramMap.pipe(
    switchMap((paramMap) => {
      const id = Number(paramMap.get('id'));
      if (id) {
        console.log(id);
        return this.orderService.getOrderFromMockDataById(id);
      }
      return of(null);
    })
  );
}
