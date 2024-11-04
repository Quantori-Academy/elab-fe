import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { OrderRequest } from '../../model/order-model';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReagentRequestService } from '../../service/reagent-request.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReagentRequest } from '../../model/reagent-request-model';
import { AsyncPipe } from '@angular/common';
import { OrdersService } from '../../service/orders.service';
import { ReagentsService } from '../../../../shared/services/reagents.service';
import { Router, RouterLink } from '@angular/router';
import { ReagentPageComponent } from '../../../reagents-list/components/reagent-page/reagent-page.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormComponent implements OnInit {
  private notificationPopupService = inject(NotificationPopupService);
  private fb = inject(FormBuilder);
  private ordersService = inject(OrdersService);
  private reagentRequestService = inject(ReagentRequestService);
  private reagentService = inject(ReagentsService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  displayedColumns: string[] = [
    'name',
    'desiredQuantity',
    'userComments',
    'casNumber',
    'actions',
    'id',
  ];
  reagentsSelectionError = false;

  dataSource$!: Observable<ReagentRequest[]>;
  sellerOptions$ = new BehaviorSubject<string[]>([]);
  selectedReagents = new Set<number>();

  orderForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    seller: ['', Validators.required],
    reagents: [[], Validators.required],
  });

  ngOnInit(): void {
    this.dataSource$ = this.reagentRequestService.getReagentRequests();
    this.reagentService
      .getAllUniqueSellers()
      .subscribe((sellers) => this.sellerOptions$.next(sellers));
  }
  openReagentDialog(id: string): void {
    this.dialog.open(ReagentPageComponent, {
      width: '600px',
      data: { id },
    });
  }
  onSelect(id: number) {
    if (this.selectedReagents.has(id)) {
      this.selectedReagents.delete(id);
    } else {
      this.selectedReagents.add(id);
    }
    this.updateOrdersFormControl();
  }

  updateOrdersFormControl() {
    const selectedReagentArray = Array.from(this.selectedReagents).map(
      (id) => ({ id })
    );
    this.orderForm.patchValue({ reagents: selectedReagentArray });
    this.reagentsSelectionError = this.selectedReagents.size === 0;
  }

  onSubmit() {
    if (this.orderForm.valid && this.selectedReagents.size > 0) {
      this.reagentsSelectionError = false;

      const orderData: OrderRequest = this.orderForm.value;
      this.ordersService.createOrder(orderData).subscribe({
        next: () => {
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Order created successfully!',
            duration: 3000,
          });
          this.redirectToReagentList();
        },
        error: (err) => this.notificationPopupService.error(err),
      });
    } else {
      this.reagentsSelectionError = true;
      this.orderForm.markAllAsTouched();
    }
  }
  public redirectToReagentList() {
    return this.router.navigate(['orders']);
  }
}
