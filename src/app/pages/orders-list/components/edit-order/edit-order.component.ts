import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { OrdersService } from '../../service/orders.service';
import {
  Order,
  RequestedReagents,
  Status,
  UpdateOrder,
} from '../../model/order-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MaterialModule } from '../../../../material.module';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MoleculeStructureComponent } from '../../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { NotificationPopupService } from '../../../../shared/services/notification-popup/notification-popup.service';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    MaterialModule,
    ReactiveFormsModule,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOrderComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private orderService = inject(OrdersService);
  private notificationPopupService = inject(NotificationPopupService);
  statusOptions: Status[] = [
    Status.pending,
    Status.submitted,
    Status.fulfilled,
    Status.declined,
  ];

  displayedColumns = [
    'name',
    'casNumber',
    'desiredQuantity',
    'structureSmiles',
    'userComments',
    'actions',
  ];
  reagents$ = new BehaviorSubject<RequestedReagents[]>([]);
  excludeReagents: { id: number }[] = [];

  initialValues: Partial<Order> = {}; //initial values of order

  errorMessage = '';
  showRemoveConfirmation = false; // Flag to show/hide the confirmation section
  lastReagentToRemove: RequestedReagents | null = null; // Temporarily store the reagent to remove
  updateForm = this.fb.group({
    title: [''],
    seller: [''],
    status: ['Pending'],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private orderId: number,
    private dialogRef: MatDialogRef<EditOrderComponent>
  ) {}

  ngOnInit() {
    this.loadOrderDetails();
    this.updateForm.get('status')?.valueChanges.subscribe((status) => {
      if (status === 'Submitted') {
        this.updateForm.get('title')?.disable();
        this.updateForm.get('seller')?.disable();
      } else if (status === 'Pending') {
        this.updateForm.get('title')?.enable();
        this.updateForm.get('seller')?.enable();
      }
    });
  }

  loadOrderDetails() {
    this.orderService
      .getReagentById(this.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((order: Order) => {
        // Saves initial values for comparison
        this.initialValues = {
          title: order.title,
          seller: order.seller,
          status: order.status,
        };

        this.updateForm.patchValue(this.initialValues);
        this.setStatusOptions(order.status);

        // to reset form's dirty state after setting initial values
        this.updateForm.markAsPristine();
        this.reagents$.next(order.reagents);
      });
  }

  private setStatusOptions(status: string) {
    switch (status) {
      case Status.pending:
        this.statusOptions = [Status.pending, Status.submitted];
        break;
      case Status.submitted:
        this.statusOptions = [Status.declined, Status.fulfilled];
        break;
      default:
        this.statusOptions = [];
    }
  }

  onSubmit() {
    const modifiedValues: Partial<UpdateOrder> = {};

    //to compare current form values to initial values and collect changes
    Object.keys(this.updateForm.controls).forEach((key) => {
      const control = this.updateForm.get(
        key as keyof typeof this.updateForm.controls
      ) as FormControl;
      const initialValue = this.initialValues[key as keyof Order];

      //  add to modifiedValues if current value is different from initial value,
      if (control.value !== initialValue) {
        modifiedValues[key as keyof UpdateOrder] = control.value;
      }
    });

    // If no modifications notify user
    if (Object.keys(modifiedValues).length === 0) {
      this.errorMessage = 'No changes to update';
      return;
    }

    this.orderService
      .updateOrder(this.orderId, modifiedValues as UpdateOrder)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.notificationPopupService.success({
            title: 'Success',
            message: 'Order updated successfully',
            duration: 3000,
          });
        },
        error: (err) => this.notificationPopupService.error(err),
      });
  }

  onRemove(reagent: RequestedReagents) {
    if (this.reagents$.getValue().length === 1) {
      this.errorMessage =
        'Removing the last reagent will cancel the order. Do you want to proceed?';
      this.showRemoveConfirmation = true;
      this.lastReagentToRemove = reagent;
    } else {
      this.processReagentRemoval(reagent);
    }
  }

  private processReagentRemoval(reagent: RequestedReagents) {
    this.excludeReagents.push({ id: reagent.id });

    this.orderService
      .updateOrder(this.orderId, { excludeReagents: this.excludeReagents })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const updatedReagents = this.reagents$
            .getValue()
            .filter((r) => r.id !== reagent.id);

          this.reagents$.next(updatedReagents);
          this.excludeReagents = [];

          this.notificationPopupService.success({
            title: 'Success',
            message: 'Reagent removed successfully!',
            duration: 3000,
          });
        },
        error: (err) => this.notificationPopupService.error(err),
      });
  }

  confirmRemoval() {
    if (this.lastReagentToRemove) {
      this.processReagentRemoval(this.lastReagentToRemove);

      // first set order status to submitted, because of BE specifications
      this.orderService
        .updateOrder(this.orderId, { status: Status.submitted })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
      // after that set status to canceled
      this.orderService
        .updateOrder(this.orderId, { status: Status.declined })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.reagents$.next([]); // Clear reagents
            this.showRemoveConfirmation = false;
            this.lastReagentToRemove = null;

            this.notificationPopupService.success({
              title: 'Success',
              message: 'Order canceled successfully!',
              duration: 3000,
            });
          },
          error: (err) => this.notificationPopupService.error(err),
        });
    }
  }

  cancelRemoval() {
    this.showRemoveConfirmation = false;
    this.lastReagentToRemove = null;
    this.errorMessage = '';
  }

  onClose() {
    this.dialogRef.close();
    this.updateForm.reset();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
