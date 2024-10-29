import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order, OrderRequest } from '../../model/order-model';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from '../../service/order.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReagentRequestService } from '../../service/reagent-request.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ReagentRequest } from '../../model/reagent-request-model';
import { mockOrders } from '../../../../../../MockData';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent implements OnInit, OnDestroy {
  private notificationPopupService = inject(NotificationPopupService);
  private dialogRef = inject(MatDialogRef<Order>);
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private reagentRequestService = inject(ReagentRequestService);
  private destroyed$ = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public editionData: Order | null) {}

  displayedColumns: string[] = [
    'name',
    'desiredQuantity',
    'userComments',
    'casNumber',
    'id',
  ];
  reagentsSelectionError = false;

  dataSource$ = new BehaviorSubject<ReagentRequest[]>([]);
  sellerOptions$ = new BehaviorSubject<string[]>([]);
  selectedReagents = new Set<number>();

  orderForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    seller: [''],
    reagents: [[], Validators.required],
  });

  ngOnInit(): void {
    this.reagentRequestService
      .getReagentRequests()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.dataSource$.next(data);
      });

    const uniqueSellers = [...new Set(mockOrders.map((order) => order.seller))];
    this.sellerOptions$.next(uniqueSellers);
  }

  onSelect(id: number) {
    if (this.selectedReagents.has(id)) {
      this.selectedReagents.delete(id);
    } else {
      this.selectedReagents.add(id);
    }
    this.updateReagentsFormControl();
  }

  updateReagentsFormControl() {
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
      this.orderService.createOrder(orderData).subscribe({
        next: (data) => {
          this.dialogRef.close();
          console.log(data);
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Order created successfully!',
            duration: 3000,
          });
        },
        error: (err) => this.notificationPopupService.error(err),
      });
    } else {
      this.reagentsSelectionError = true;
      this.orderForm.markAllAsTouched();
    }
  }

  onClose() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
